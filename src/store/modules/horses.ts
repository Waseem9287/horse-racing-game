import { ActionContext } from "vuex";
import HorsesMock from "@/assets/horses-mock.json";
import {
  IHorse,
  IHorseColor,
  IHorsesState,
  IRootState,
} from "@/store/modules/types";

const HORSE_NAMES: Array<string> = HorsesMock.names;
const HORSE_COLORS: Array<IHorseColor> = HorsesMock.colors;

const state: IHorsesState = {
  horses: [],
};

const mutations = {
  setHorses(state: IHorsesState, horses: IHorse[]) {
    state.horses = horses;
  },
};

const actions = {
  generateProgram({ commit }: ActionContext<IHorsesState, IRootState>) {
    const horses: IHorse[] = [];

    const uniqueColors = new Set<IHorseColor>();

    const groupSize = 20;

    while (uniqueColors.size < groupSize) {
      const color =
        HORSE_COLORS[Math.floor(Math.random() * HORSE_COLORS.length)];
      uniqueColors.add(color);
    }

    const uniqueColorsArray = Array.from(uniqueColors);

    for (let i = 0; i < groupSize; i++) {
      const horse: IHorse = {
        name: HORSE_NAMES[Math.floor(Math.random() * HORSE_NAMES.length)],
        color: uniqueColorsArray[i],
        condition: Math.floor(Math.random() * 100) + 1,
      };
      horses.push(horse);
    }

    commit("setHorses", horses);
  },
};

const getters = {
  getHorses(state: IHorsesState): IHorse[] {
    return state.horses || [];
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
