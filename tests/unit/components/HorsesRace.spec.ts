import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import HorsesRace from "@/components/HorsesRace.vue";
import Horse from "@/components/Horse.vue";

describe("HorsesRace.vue", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  let store: any;
  let racesModule: any;

  beforeEach(() => {
    racesModule = {
      namespaced: true,
      getters: {
        getCurrentRound: jest.fn(),
      },
    };
    store = new Vuex.Store({
      modules: {
        races: racesModule,
      },
    });
  });

  it("renders waiting message if no current round", () => {
    racesModule.getters.getCurrentRound.mockReturnValue(null);
    const wrapper = shallowMount(HorsesRace, { store, localVue });
    expect(wrapper.text()).toContain("Waiting for round starting");
  });

  it("renders current round and horse tracks", () => {
    const mockRound = {
      id: "R1",
      distance: 1000,
      horses: [
        {
          name: "Horse 1",
          color: { colorName: "Red", colorCode: "#f00" },
          condition: 10,
        },
        {
          name: "Horse 2",
          color: { colorName: "Blue", colorCode: "#00f" },
          condition: 12,
        },
      ],
      roundProgress: { Red: 500, Blue: 1000 },
      places: ["Blue", "Red"],
    };
    racesModule.getters.getCurrentRound.mockReturnValue(mockRound);
    const wrapper = shallowMount(HorsesRace, {
      store,
      localVue,
      stubs: { Horse: true },
    });
    expect(wrapper.text()).toContain("R1");
    expect(wrapper.text()).toContain("1000m");
    // Should render two tracks
    expect(wrapper.findAll(".HorsesRace-track").length).toBe(2);
  });

  it('shows "Finished" for horses with Infinity progress', () => {
    const mockRound = {
      id: "R2",
      distance: 1200,
      horses: [
        {
          name: "Horse 1",
          color: { colorName: "Red", colorCode: "#f00" },
          condition: 10,
        },
      ],
      roundProgress: { Red: Infinity },
      places: ["Red"],
    };
    racesModule.getters.getCurrentRound.mockReturnValue(mockRound);
    const wrapper = shallowMount(HorsesRace, {
      store,
      localVue,
      stubs: { Horse: true },
    });
    expect(wrapper.text()).toContain("Finished");
    expect(wrapper.text()).toContain("1"); // Finished №1
  });
});
