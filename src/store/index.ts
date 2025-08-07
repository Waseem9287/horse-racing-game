import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";

import horses from "./modules/horses";
import races from "./modules/races";
import { IRootState } from "./modules/types";

Vue.use(Vuex);

const store: StoreOptions<IRootState> = {
  modules: {
    horses,
    races,
  },
};

export default new Vuex.Store<IRootState>(store);
