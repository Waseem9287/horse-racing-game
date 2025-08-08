import Vue from "vue";
import Vuex from "vuex";

import horses from "./modules/horses";
import races from "./modules/races";
import { IRootState } from "./modules/types";

Vue.use(Vuex);

const store = new Vuex.Store<IRootState>({
  modules: {
    horses,
    races,
  },
});

export default store;

export const useStore = () => store;
