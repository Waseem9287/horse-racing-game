import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import races from "@/store/modules/races";
import horses from "@/store/modules/horses";
import { IRound, IRace, ERoundDistance } from "@/store/modules/types";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Races Module", () => {
  let store: any;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        races: {
          ...races,
          state: () => ({
            paused: true,
            currentRound: null,
            currentRace: null,
            previousRaces: [],
          }),
        },
        horses: {
          ...horses,
          state: () => ({
            horses: [],
          }),
        },
      },
    });
  });

  describe("State", () => {
    it("should have initial state", () => {
      expect(store.state.races.paused).toBe(true);
      expect(store.state.races.currentRound).toBe(null);
      expect(store.state.races.currentRace).toBe(null);
      expect(store.state.races.previousRaces).toEqual([]);
    });
  });

  describe("Mutations", () => {
    it("should set paused state", () => {
      store.commit("races/setPaused", false);
      expect(store.state.races.paused).toBe(false);
    });

    it("should set current round", () => {
      const mockRound: IRound = {
        id: "Test Round",
        distance: ERoundDistance.ROUND1,
        horses: [],
        places: [],
        roundProgress: {},
      };

      store.commit("races/setCurrentRound", mockRound);
      expect(store.state.races.currentRound).toEqual(mockRound);
    });

    it("should update round progress", () => {
      const mockRound: IRound = {
        id: "Test Round",
        distance: ERoundDistance.ROUND1,
        horses: [],
        places: [],
        roundProgress: {},
      };

      store.commit("races/setCurrentRound", mockRound);

      const progress = { Red: 50, Blue: 75 };
      store.commit("races/updateRoundProgress", progress);

      expect(store.state.races.currentRound?.roundProgress).toEqual(progress);
    });

    it("should update round places", () => {
      const mockRound: IRound = {
        id: "Test Round",
        distance: ERoundDistance.ROUND1,
        horses: [],
        places: [],
        roundProgress: {},
      };

      store.commit("races/setCurrentRound", mockRound);

      const places = ["Red", "Blue", "Green"];
      store.commit("races/updateRoundPlaces", places);

      expect(store.state.races.currentRound?.places).toEqual(places);
    });

    it("should set current race", () => {
      const mockRace: IRace = {
        id: "Test Race",
        rounds: [],
      };

      store.commit("races/setCurrentRace", mockRace);
      expect(store.state.races.currentRace).toEqual(mockRace);
    });

    it("should add round to race", () => {
      const mockRace: IRace = {
        id: "Test Race",
        rounds: [],
      };

      const mockRound: IRound = {
        id: "Test Round",
        distance: ERoundDistance.ROUND1,
        horses: [],
        places: [],
        roundProgress: {},
      };

      store.commit("races/setCurrentRace", mockRace);
      store.commit("races/addRoundToRace", mockRound);

      expect(store.state.races.currentRace?.rounds).toHaveLength(1);
      expect(store.state.races.currentRace?.rounds[0]).toEqual(mockRound);
    });

    it("should add previous race", () => {
      const mockRace: IRace = {
        id: "Test Race",
        rounds: [],
      };

      store.commit("races/addPreviousRace", mockRace);
      expect(store.state.races.previousRaces).toHaveLength(1);
      expect(store.state.races.previousRaces[0]).toEqual(mockRace);
    });
  });

  describe("Actions", () => {
    it("should pause race", async () => {
      await store.dispatch("races/pauseRace");
      expect(store.state.races.paused).toBe(true);
    });

    it("should resume race", async () => {
      store.commit("races/setPaused", true);
      await store.dispatch("races/resumeRace");
      expect(store.state.races.paused).toBe(false);
    });

    it("should generate round with horses", async () => {
      // First generate some horses
      await store.dispatch("horses/generateProgram");

      const round = await store.dispatch("races/generateRound", 0);

      expect(round).toBeDefined();
      expect(round.id).toBe("Round #1");
      expect(round.distance).toBe(ERoundDistance.ROUND1);
      expect(round.horses).toHaveLength(10);
      expect(round.places).toEqual([]);
      expect(Object.keys(round.roundProgress)).toHaveLength(10);
    });

    it("should emulate round progress", async () => {
      // First generate some horses and a round
      await store.dispatch("horses/generateProgram");
      await store.dispatch("races/generateRound", 0);
      await store.dispatch("races/resumeRace");

      const initialProgress = {
        ...store.state.races.currentRound?.roundProgress,
      };

      await store.dispatch("races/emulateRoundProgress");

      const updatedProgress = store.state.races.currentRound?.roundProgress;

      // Progress should have been updated
      expect(updatedProgress).not.toEqual(initialProgress);
    });
  });

  describe("Getters", () => {
    it("should return paused state", () => {
      expect(store.getters["races/isPaused"]).toBe(true);

      store.commit("races/setPaused", false);
      expect(store.getters["races/isPaused"]).toBe(false);
    });

    it("should return current round", () => {
      expect(store.getters["races/getCurrentRound"]).toBe(null);

      const mockRound: IRound = {
        id: "Test Round",
        distance: ERoundDistance.ROUND1,
        horses: [],
        places: [],
        roundProgress: {},
      };

      store.commit("races/setCurrentRound", mockRound);
      expect(store.getters["races/getCurrentRound"]).toEqual(mockRound);
    });

    it("should return current race", () => {
      expect(store.getters["races/getCurrentRace"]).toBe(null);

      const mockRace: IRace = {
        id: "Test Race",
        rounds: [],
      };

      store.commit("races/setCurrentRace", mockRace);
      expect(store.getters["races/getCurrentRace"]).toEqual(mockRace);
    });

    it("should return previous races", () => {
      expect(store.getters["races/getPreviousRaces"]).toEqual([]);

      const mockRace: IRace = {
        id: "Test Race",
        rounds: [],
      };

      store.commit("races/addPreviousRace", mockRace);
      expect(store.getters["races/getPreviousRaces"]).toHaveLength(1);
      expect(store.getters["races/getPreviousRaces"][0]).toEqual(mockRace);
    });
  });
});
