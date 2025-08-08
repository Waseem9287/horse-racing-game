import { ActionContext } from "vuex";
import {
  AROUND_DISTANCES,
  IHorse,
  IRace,
  IRacesState,
  IRootState,
  IRound,
} from "@/store/modules/types";

const RACE_CONFIG = {
  HORSES_PER_ROUND: 10,
  SHUFFLE_RANDOMNESS: 0.5,
  BASE_SPEED: 10,
  CONDITION_DIVIDER: 20,
  RANDOM_FACTOR_RANGE: 2.5,
  ROUND_PROGRESS_DELAY_MS: 50,
  ROUND_START_DELAY_MS: 250,
  ROUND_FINISH_DELAY_MS: 1000,
  INFINITY_PROGRESS: Infinity,
};

const state: IRacesState = {
  paused: true,
  currentRound: null,
  currentRace: null,
  previousRaces: [],
};

const mutations = {
  setPaused(state: IRacesState, paused: boolean) {
    state.paused = paused;
  },

  setCurrentRound(state: IRacesState, round: IRound | null) {
    state.currentRound = round;
  },

  updateRoundProgress(
    state: IRacesState,
    roundProgress: Record<string, number>
  ) {
    if (state.currentRound) {
      state.currentRound.roundProgress = roundProgress;
    }
  },

  updateRoundPlaces(state: IRacesState, places: Array<string>) {
    if (state.currentRound) {
      state.currentRound.places = places;
    }
  },

  setCurrentRace(state: IRacesState, race: IRace | null) {
    state.currentRace = race;
  },

  addRoundToRace(state: IRacesState, round: IRound) {
    if (state.currentRace) {
      state.currentRace.rounds.push(round);
    }
  },

  addPreviousRace(state: IRacesState, race: IRace) {
    state.previousRaces.push(race);
  },
};

const actions = {
  pauseRace({ commit }: ActionContext<IRacesState, IRootState>) {
    commit("setPaused", true);
  },

  resumeRace({ commit }: ActionContext<IRacesState, IRootState>) {
    commit("setPaused", false);
  },

  async generateRound(
    { commit, rootGetters }: ActionContext<IRacesState, IRootState>,
    index: number
  ) {
    const horses: Array<IHorse> = rootGetters["horses/getHorses"];
    const shuffledHorses = [...horses].sort(
      () => RACE_CONFIG.SHUFFLE_RANDOMNESS - Math.random()
    );
    const horsesInRound = shuffledHorses.slice(0, RACE_CONFIG.HORSES_PER_ROUND);

    const round: IRound = {
      id: `Round #${index + 1}`,
      distance: AROUND_DISTANCES[index],
      horses: horsesInRound,
      places: [],
      roundProgress: horsesInRound.reduce(
        (acc: Record<string, number> = {}, horse) => {
          acc[horse.color.colorName] = 0;
          return acc;
        },
        {} as Record<string, number>
      ),
    };

    commit("setCurrentRound", round);

    return round;
  },

  emulateRoundProgress(context: ActionContext<IRacesState, IRootState>) {
    return new Promise((resolve) => {
      const { commit, state } = context;

      if (!state.currentRound || state.paused) {
        setTimeout(resolve, RACE_CONFIG.ROUND_START_DELAY_MS);
      } else {
        const currentRound = state.currentRound;
        const horses = currentRound.horses;
        const currentRoundFinishers: Array<string> = [];

        const progressUpdates = horses.reduce(
          (acc: Record<string, number>, horse) => {
            if (currentRound.places.includes(horse.color.colorName)) {
              acc[horse.color.colorName] = RACE_CONFIG.INFINITY_PROGRESS;
              return acc;
            }

            const colorName = horse.color.colorName;
            const currentProgress = currentRound.roundProgress[colorName];
            const baseSpeed =
              RACE_CONFIG.BASE_SPEED +
              horse.condition / RACE_CONFIG.CONDITION_DIVIDER;
            const randomFactor =
              Math.random() * RACE_CONFIG.RANDOM_FACTOR_RANGE -
              RACE_CONFIG.RANDOM_FACTOR_RANGE / 2;
            const progress = currentProgress + baseSpeed + randomFactor; // More randomness
            acc[colorName] = progress;

            if (progress > currentRound.distance) {
              currentRoundFinishers.push(colorName);
            }

            return acc;
          },
          {} as Record<string, number>
        );

        const updatedPlaces = [
          ...currentRound.places,
          ...currentRoundFinishers.sort((a, b) => {
            return (
              currentRound.roundProgress[b] - currentRound.roundProgress[a]
            );
          }),
        ];

        if (updatedPlaces.length === horses.length - 1) {
          const lastHorse = horses.find(
            (horse) => !updatedPlaces.includes(horse.color.colorName)
          );
          if (lastHorse) {
            updatedPlaces.push(lastHorse.color.colorName);
          }
        }

        commit("updateRoundProgress", progressUpdates);
        commit("updateRoundPlaces", updatedPlaces);

        setTimeout(resolve, RACE_CONFIG.ROUND_PROGRESS_DELAY_MS);
      }
    });
  },

  async generateRace({
    commit,
    dispatch,
  }: ActionContext<IRacesState, IRootState>) {
    const race: IRace = {
      id: `Race #${state.previousRaces.length + 1}`,
      rounds: [] as IRound[],
    };
    commit("setCurrentRace", race);

    for (let i = 0; i < AROUND_DISTANCES.length; i++) {
      const round = await dispatch("generateRound", i);

      while (
        (state.currentRound?.places.length || 0) < RACE_CONFIG.HORSES_PER_ROUND
      ) {
        await dispatch("emulateRoundProgress");
      }

      commit("addRoundToRace", round);
      commit("setCurrentRound", null);

      await new Promise((resolve) =>
        setTimeout(resolve, RACE_CONFIG.ROUND_FINISH_DELAY_MS)
      ); // Simulate a delay between rounds
    }

    commit("addPreviousRace", race);
    commit("setCurrentRound", null);
    commit("setCurrentRace", null);
    commit("setPaused", true);
  },
};

const getters = {
  isPaused: (state: IRacesState) => state.paused,
  getCurrentRound: (state: IRacesState) => state.currentRound,
  getCurrentRace: (state: IRacesState) => state.currentRace,
  getPreviousRaces: (state: IRacesState) => state.previousRaces,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
