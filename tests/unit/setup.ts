// Jest setup file for unit tests
import Vue from "vue";
import Vuex from "vuex";

// Global Vue configuration
Vue.use(Vuex);

Object.defineProperty(window, "lottie", {
  writable: true,
  value: {
    loadAnimation: jest.fn().mockImplementation(() => {
      return {
        play: jest.fn(),
        stop: jest.fn(),
        pause: jest.fn(),
        playSpeed: 1,
      };
    }),
  },
});
