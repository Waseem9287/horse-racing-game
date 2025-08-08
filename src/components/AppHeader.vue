<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/store";
import type { IHorse, IRound } from "@/store/modules/types";

const store = useStore();

const isPaused = computed(() => store.getters["races/isPaused"]);
const getCurrentRound = computed<IRound | null>(
  () => store.getters["races/getCurrentRound"]
);
const getHorses = computed<IHorse[]>(() => store.getters["horses/getHorses"]);

const generateProgram = () => store.dispatch("horses/generateProgram");
const generateRace = () => store.dispatch("races/generateRace");
const pauseRace = () => store.dispatch("races/pauseRace");
const resumeRace = () => store.dispatch("races/resumeRace");

function toggleRace() {
  if (isPaused.value && getCurrentRound.value) {
    resumeRace();
  } else if (isPaused.value && !getCurrentRound.value) {
    generateRace();
    resumeRace();
  } else {
    pauseRace();
  }
}

function StartProgram() {
  generateProgram();
  if (!isPaused.value) {
    pauseRace();
  }
}
</script>

<template>
  <div class="AppHeader">
    <div class="container">
      <h1>Horse Racing</h1>
      <div class="AppHeader-actions">
        <button @click="StartProgram">Generate Program</button>
        <button @click="toggleRace" :disabled="!getHorses.length">
          {{ isPaused ? "Start" : "Pause" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/assets/styles/variables.scss" as *;

.AppHeader {
  background-color: #282c34;
  color: #dddddd;

  height: 80px;

  @media (max-width: $laptop) {
    height: auto;
  }

  h1 {
    margin: 0;
    font-size: 32px;
    font-weight: bold;
  }

  &-actions {
    display: flex;
    gap: 10px;

    @media (max-width: $laptop) {
      flex-direction: column;
    }

    button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      border: none;
      border-radius: 5px;
      background-color: #535353;
      color: #dddddd;
      transition: background-color 0.3s;

      &:hover {
        background-color: #404e48;
      }

      &:disabled {
        background-color: #888888;
        cursor: not-allowed;
      }
    }
  }
}
</style>
