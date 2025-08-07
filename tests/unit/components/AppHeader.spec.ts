import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import AppHeader from "@/components/AppHeader.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("AppHeader.vue", () => {
  let store: any;
  let actions: any;
  let getters: any;

  beforeEach(() => {
    actions = {
      "horses/generateProgram": jest.fn(),
      "races/pauseRace": jest.fn(),
      "races/resumeRace": jest.fn(),
      "races/generateRace": jest.fn(),
    };

    getters = {
      isPaused: jest.fn(),
      getCurrentRound: jest.fn(),
      getHorses: jest.fn().mockImplementation(() => []),
    };

    store = new Vuex.Store({
      modules: {
        horses: {
          namespaced: true,
          actions: {
            generateProgram: actions["horses/generateProgram"],
          },
          state: {
            horses: [],
          },
          getters: {
            getHorses: getters.getHorses,
          },
        },
        races: {
          namespaced: true,
          actions: {
            pauseRace: actions["races/pauseRace"],
            resumeRace: actions["races/resumeRace"],
            generateRace: actions["races/generateRace"],
          },
          getters: {
            isPaused: getters.isPaused,
            getCurrentRound: getters.getCurrentRound,
          },
          state: {
            paused: true,
            currentRound: null,
            currentRace: null,
            previousRaces: [],
          },
        },
      },
    });
  });

  it("renders component correctly", () => {
    getters.isPaused.mockReturnValue(true);
    getters.getCurrentRound.mockReturnValue(null);

    const wrapper = shallowMount(AppHeader, {
      store,
      localVue,
    });

    expect(wrapper.find(".AppHeader").exists()).toBe(true);
    expect(wrapper.find("h1").text()).toBe("Horse Racing");
    expect(wrapper.find(".AppHeader-actions").exists()).toBe(true);
  });

  it("displays correct button text when paused", () => {
    getters.isPaused.mockReturnValue(true);
    getters.getCurrentRound.mockReturnValue(null);
    getters.getHorses.mockReturnValue(["Horse 1", "Horse 2"]);

    const wrapper = shallowMount(AppHeader, {
      store,
      localVue,
    });

    const buttons = wrapper.findAll("button");
    expect(buttons.at(0).text()).toBe("Generate Program");
    expect(buttons.at(1).text()).toBe("Start");
  });

  it("displays correct button text when not paused", () => {
    getters.isPaused.mockReturnValue(false);
    getters.getCurrentRound.mockReturnValue({});

    const wrapper = shallowMount(AppHeader, {
      store,
      localVue,
    });

    const buttons = wrapper.findAll("button");
    expect(buttons.at(0).text()).toBe("Generate Program");
    expect(buttons.at(1).text()).toBe("Pause");
  });

  it("calls generateProgram when Generate Program button is clicked", async () => {
    getters.isPaused.mockReturnValue(true);
    getters.getCurrentRound.mockReturnValue(null);

    const wrapper = shallowMount(AppHeader, {
      store,
      localVue,
    });

    const generateButton = wrapper.findAll("button").at(0);
    await generateButton.trigger("click");

    expect(actions["horses/generateProgram"]).toHaveBeenCalled();
  });

  it("pauses race when paused and current round exists", async () => {
    getters.isPaused.mockReturnValue(true);
    getters.getCurrentRound.mockReturnValue({ id: "test" });
    getters.getHorses.mockReturnValue(["Horse 1", "Horse 2"]);

    const wrapper = shallowMount(AppHeader, {
      store,
      localVue,
    });

    const toggleButton = wrapper.findAll("button").at(1);
    await toggleButton.trigger("click");

    expect(actions["races/resumeRace"]).toHaveBeenCalled();
    expect(actions["races/generateRace"]).not.toHaveBeenCalled();
    expect(actions["races/pauseRace"]).not.toHaveBeenCalled();
  });

  it("generates and starts race when paused and no current round", async () => {
    getters.isPaused.mockReturnValue(true);
    getters.getCurrentRound.mockReturnValue(null);
    getters.getHorses.mockReturnValue(["Horse 1", "Horse 2"]);

    const wrapper = shallowMount(AppHeader, {
      store,
      localVue,
    });

    const toggleButton = wrapper.findAll("button").at(1);
    await toggleButton.trigger("click");

    expect(actions["races/generateRace"]).toHaveBeenCalled();
    expect(actions["races/resumeRace"]).toHaveBeenCalled();
    expect(actions["races/pauseRace"]).not.toHaveBeenCalled();
  });

  it("pauses race when not paused", async () => {
    getters.isPaused.mockReturnValue(false);
    getters.getCurrentRound.mockReturnValue({ id: "test" });
    getters.getHorses.mockReturnValue(["Horse 1", "Horse 2"]);

    const wrapper = shallowMount(AppHeader, {
      store,
      localVue,
    });

    const toggleButton = wrapper.findAll("button").at(1);
    await toggleButton.trigger("click");

    expect(actions["races/pauseRace"]).toHaveBeenCalled();
    expect(actions["races/resumeRace"]).not.toHaveBeenCalled();
    expect(actions["races/generateRace"]).not.toHaveBeenCalled();
  });

  it("pauses race after generating program if not paused", async () => {
    getters.isPaused.mockReturnValue(false);
    getters.getCurrentRound.mockReturnValue(null);

    const wrapper = shallowMount(AppHeader, {
      store,
      localVue,
    });

    const generateButton = wrapper.findAll("button").at(0);
    await generateButton.trigger("click");

    expect(actions["horses/generateProgram"]).toHaveBeenCalled();
    expect(actions["races/pauseRace"]).toHaveBeenCalled();
  });

  it("does not pause race after generating program if already paused", async () => {
    getters.isPaused.mockReturnValue(true);
    getters.getCurrentRound.mockReturnValue(null);

    const wrapper = shallowMount(AppHeader, {
      store,
      localVue,
    });

    const generateButton = wrapper.findAll("button").at(0);
    await generateButton.trigger("click");

    expect(actions["horses/generateProgram"]).toHaveBeenCalled();
    expect(actions["races/pauseRace"]).not.toHaveBeenCalled();
  });

  it("has correct CSS classes", () => {
    getters.isPaused.mockReturnValue(true);
    getters.getCurrentRound.mockReturnValue(null);

    const wrapper = shallowMount(AppHeader, {
      store,
      localVue,
    });

    expect(wrapper.find(".AppHeader").exists()).toBe(true);
    expect(wrapper.find(".AppHeader-actions").exists()).toBe(true);
    expect(wrapper.find(".container").exists()).toBe(true);
  });

  it("has two buttons", () => {
    getters.isPaused.mockReturnValue(true);
    getters.getCurrentRound.mockReturnValue(null);

    const wrapper = shallowMount(AppHeader, {
      store,
      localVue,
    });

    const buttons = wrapper.findAll("button");
    expect(buttons).toHaveLength(2);
  });
});
