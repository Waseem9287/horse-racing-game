import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import horses from "@/store/modules/horses";
import { IHorse, IHorseColor } from "@/store/modules/types";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Horses Module", () => {
  let store: any;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
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
    it("should have initial state with empty horses array", () => {
      expect(store.state.horses.horses).toEqual([]);
    });
  });

  describe("Mutations", () => {
    it("should set horses in state", () => {
      const mockHorses: IHorse[] = [
        {
          name: "Test Horse",
          color: { colorName: "Red", colorCode: "#FF0000" },
          condition: 85,
        },
      ];

      store.commit("horses/setHorses", mockHorses);
      expect(store.state.horses.horses).toEqual(mockHorses);
    });
  });

  describe("Actions", () => {
    it("should generate program with 20 horses", async () => {
      await store.dispatch("horses/generateProgram");

      expect(store.state.horses.horses).toHaveLength(20);
    });

    it("should generate horses with unique colors", async () => {
      await store.dispatch("horses/generateProgram");

      const horses = store.state.horses.horses;
      const colors = horses.map((horse: IHorse) => horse.color);
      const uniqueColors = new Set(
        colors.map((color: IHorseColor) => color.colorName)
      );

      expect(uniqueColors.size).toBe(20);
    });

    it("should generate horses with valid properties", async () => {
      await store.dispatch("horses/generateProgram");

      const horses = store.state.horses.horses;

      horses.forEach((horse: IHorse) => {
        expect(horse.name).toBeDefined();
        expect(horse.name.length).toBeGreaterThan(0);
        expect(horse.color).toBeDefined();
        expect(horse.color.colorName).toBeDefined();
        expect(horse.color.colorCode).toBeDefined();
        expect(horse.condition).toBeGreaterThan(0);
        expect(horse.condition).toBeLessThanOrEqual(100);
      });
    });
  });

  describe("Getters", () => {
    it("should return horses from state", () => {
      const mockHorses: IHorse[] = [
        {
          name: "Test Horse",
          color: { colorName: "Red", colorCode: "#FF0000" },
          condition: 85,
        },
      ];

      store.commit("horses/setHorses", mockHorses);
      expect(store.getters["horses/getHorses"]).toEqual(mockHorses);
    });

    it("should return empty array when no horses", () => {
      expect(store.getters["horses/getHorses"]).toEqual([]);
    });
  });
});
