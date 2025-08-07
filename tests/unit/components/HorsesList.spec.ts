import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import HorsesList from "@/components/HorsesList.vue";
import { IHorse } from "@/store/modules/types";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("HorsesList.vue", () => {
  let store: any;
  let actions: any;
  let getters: any;

  beforeEach(() => {
    actions = {
      generateProgram: jest.fn(),
    };

    getters = {
      getHorses: jest.fn(),
    };

    store = new Vuex.Store({
      modules: {
        horses: {
          namespaced: true,
          actions,
          getters,
          state: {
            horses: [],
          },
        },
      },
    });
  });

  it("renders component correctly", () => {
    getters.getHorses.mockReturnValue([]);

    const wrapper = shallowMount(HorsesList, {
      store,
      localVue,
    });

    expect(wrapper.find(".HorsesList").exists()).toBe(true);
    expect(wrapper.find("h2").text()).toBe("Horses List");
  });

  it("displays grid header correctly", () => {
    getters.getHorses.mockReturnValue([]);

    const wrapper = shallowMount(HorsesList, {
      store,
      localVue,
    });

    const header = wrapper.find(".HorsesList-grid-header");
    expect(header.exists()).toBe(true);

    // With shallowMount, the header cells are rendered as a single text block
    expect(header.text()).toContain("#");
    expect(header.text()).toContain("Name");
    expect(header.text()).toContain("Condition");
    expect(header.text()).toContain("Color");
  });

  it("displays empty state when no horses", () => {
    getters.getHorses.mockReturnValue([]);

    const wrapper = shallowMount(HorsesList, {
      store,
      localVue,
    });

    expect(wrapper.find(".HorsesList-grid-empty").exists()).toBe(true);
    expect(wrapper.find(".HorsesList-grid-empty").text()).toContain(
      "No horses available"
    );
  });

  it("displays horses when available", () => {
    const mockHorses: IHorse[] = [
      {
        name: "Thunder",
        color: { colorName: "Red", colorCode: "#FF0000" },
        condition: 85,
      },
      {
        name: "Lightning",
        color: { colorName: "Blue", colorCode: "#0000FF" },
        condition: 92,
      },
    ];

    getters.getHorses.mockReturnValue(mockHorses);

    const wrapper = shallowMount(HorsesList, {
      store,
      localVue,
    });

    const rows = wrapper.findAll(".HorsesList-grid-row");
    expect(rows).toHaveLength(2);

    // Check first horse
    const firstRow = rows.at(0);
    expect(firstRow.text()).toContain("1");
    expect(firstRow.text()).toContain("Thunder");
    expect(firstRow.text()).toContain("85");
    expect(firstRow.text()).toContain("Red");

    // Check the second horse
    const secondRow = rows.at(1);
    expect(secondRow.text()).toContain("2");
    expect(secondRow.text()).toContain("Lightning");
    expect(secondRow.text()).toContain("92");
    expect(secondRow.text()).toContain("Blue");
  });

  it("applies horse color styling", () => {
    const mockHorses: IHorse[] = [
      {
        name: "Thunder",
        color: { colorName: "Red", colorCode: "#FF0000" },
        condition: 85,
      },
    ];

    getters.getHorses.mockReturnValue(mockHorses);

    const wrapper = shallowMount(HorsesList, {
      store,
      localVue,
    });

    const row = wrapper.find(".HorsesList-grid-row");
    expect(row.attributes("style")).toContain("--horseColor: #FF0000");
  });
});
