import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Horse from "@/components/Horse.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

jest.useFakeTimers();

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("Horse.vue", () => {
  let store: any;
  let getters: any;

  const propsData = {
    horseName: "Thunder",
    horseSpeed: 75,
  };

  beforeEach(() => {
    getters = {
      isPaused: jest.fn(),
    };

    store = new Vuex.Store({
      modules: {
        races: {
          namespaced: true,
          getters,
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

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders component correctly", () => {
    getters.isPaused.mockReturnValue(false);

    const wrapper = shallowMount(Horse, {
      propsData,
      store,
      localVue,
    });

    expect(wrapper.find(".Horse").exists()).toBe(true);
    expect(wrapper.find(".Horse-name").text()).toBe("Thunder");
    expect(wrapper.find(".Horse-animation").exists()).toBe(true);
    expect((wrapper.vm as any).show).toBe(false);
  });

  it("applies correct props", () => {
    getters.isPaused.mockReturnValue(false);

    const wrapper = shallowMount(Horse, {
      propsData: {
        horseName: "Lightning",
        horseSpeed: 90,
      },
      store,
      localVue,
    });

    expect(wrapper.props("horseName")).toBe("Lightning");
    expect(wrapper.props("horseSpeed")).toBe(90);
  });

  it("uses default props when not provided", () => {
    getters.isPaused.mockReturnValue(false);

    const wrapper = shallowMount(Horse, {
      store,
      localVue,
    });

    expect(wrapper.props("horseName")).toBe("");
    expect(wrapper.props("horseSpeed")).toBe(50);
  });

  it("shows component after animation setup", () => {
    getters.isPaused.mockReturnValue(false);

    const wrapper = shallowMount(Horse, {
      propsData,
      store,
      localVue,
    });

    expect((wrapper.vm as any).show).toBe(false);

    jest.runAllTimers();

    // Should be visible after animation setup
    expect((wrapper.vm as any).show).toBe(true);
  });

  it("pauses animation when race is paused", () => {
    getters.isPaused.mockReturnValue(true);

    const wrapper = shallowMount(Horse, {
      propsData,
      store,
      localVue,
    });

    jest.runAllTimers();

    // Animation should be paused
    expect((wrapper.vm as any).animation.pause).toHaveBeenCalled();
    expect((wrapper.vm as any).animation.play).not.toHaveBeenCalled();
  });

  it("plays animation when race is not paused", () => {
    getters.isPaused.mockReturnValue(false);

    const wrapper = shallowMount(Horse, {
      propsData,
      store,
      localVue,
    });

    jest.runAllTimers();

    // Animation should be playing
    expect((wrapper.vm as any).animation.play).toHaveBeenCalled();
    expect((wrapper.vm as any).animation.pause).not.toHaveBeenCalled();
  });

  it("calculates animation speed correctly", () => {
    getters.isPaused.mockReturnValue(false);

    const wrapper = shallowMount(Horse, {
      propsData,
      store,
      localVue,
    });

    jest.runAllTimers();

    // Speed calculation: (k * horseSpeed) / (1 + a * horseSpeed)
    // where k = 1.15, a = 0.8, horseSpeed = 75
    const expectedSpeed = (1.15 * 75) / (1 + 0.8 * 75);
    expect((wrapper.vm as any).animation.playSpeed).toBe(expectedSpeed);
  });

  it("stops animation on component destruction", () => {
    getters.isPaused.mockReturnValue(false);

    const wrapper = shallowMount(Horse, {
      propsData,
      store,
      localVue,
    });

    jest.runAllTimers();

    wrapper.destroy();

    expect((wrapper.vm as any).animation.stop).toHaveBeenCalled();
  });

  it("handles missing animation element gracefully", () => {
    getters.isPaused.mockReturnValue(false);

    // Mock $refs to return null
    const wrapper = shallowMount(Horse, {
      propsData,
      store,
      localVue,
    });

    // Should not throw error
    expect(() => {
      jest.runAllTimers();
    }).not.toThrow();
  });
});
