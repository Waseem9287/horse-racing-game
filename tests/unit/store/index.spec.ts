import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import store from "@/store";
import { IRootState } from "@/store/modules/types";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Store", () => {
  it("should create store with correct modules", () => {
    expect(store.state.horses).toBeDefined();
    expect(store.state.races).toBeDefined();
  });

  it("should have horses module with correct initial state", () => {
    expect(store.state.horses.horses).toEqual([]);
  });

  it("should have races module with correct initial state", () => {
    expect(store.state.races.paused).toBe(true);
    expect(store.state.races.currentRound).toBe(null);
    expect(store.state.races.currentRace).toBe(null);
    expect(store.state.races.previousRaces).toEqual([]);
  });

  it("should have horses getters", () => {
    expect(store.getters["horses/getHorses"]).toBeDefined();
  });

  it("should have races getters", () => {
    expect(store.getters["races/isPaused"]).toBeDefined();
    expect(store.getters["races/getCurrentRound"]).toBeDefined();
    expect(store.getters["races/getCurrentRace"]).toBeDefined();
    expect(store.getters["races/getPreviousRaces"]).toBeDefined();
  });

  it("should be able to dispatch horses actions", async () => {
    await expect(
      store.dispatch("horses/generateProgram")
    ).resolves.toBeUndefined();
  });

  it("should be able to dispatch races actions", async () => {
    await expect(store.dispatch("races/pauseRace")).resolves.toBeUndefined();
    await expect(store.dispatch("races/resumeRace")).resolves.toBeUndefined();
  });

  it("should be able to commit horses mutations", () => {
    const mockHorses = [
      {
        name: "Test Horse",
        color: { colorName: "Red", colorCode: "#FF0000" },
        condition: 85,
      },
    ];
    expect(() => store.commit("horses/setHorses", mockHorses)).not.toThrow();
  });

  it("should be able to commit races mutations", () => {
    expect(() => store.commit("races/setPaused", false)).not.toThrow();
    expect(() => store.commit("races/setCurrentRound", null)).not.toThrow();
  });
});
