<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/store";
import AnimatedHorse from "@/components/AnimatedHorse.vue";
import type { IRound } from "@/store/modules/types";

const store = useStore();
const getCurrentRound = computed<IRound | null>(
  () => store.getters["races/getCurrentRound"]
);
</script>

<template>
  <div class="HorsesRace">
    <template v-if="getCurrentRound">
      <h2>{{ getCurrentRound.id }} ({{ getCurrentRound.distance }}m)</h2>
      <div
        class="HorsesRace-track"
        v-for="(horse, i) in getCurrentRound.horses"
        :key="`horse-${i}`"
        :style="{
          '--horseColor': horse.color.colorCode,
          '--horseDistance': `${
            (getCurrentRound.roundProgress[horse.color.colorName] /
              getCurrentRound.distance) *
            100
          }%`,
        }"
      >
        <div class="HorsesRace-track-name">{{ i + 1 }}</div>
        <AnimatedHorse
          class="HorsesRace-horse"
          :horseSpeed="horse.condition"
          :horseName="horse.name"
          v-if="
            getCurrentRound.roundProgress[horse.color.colorName] !== Infinity
          "
        />

        <div class="HorsesRace-track-finished" v-else>
          Finished №
          {{ getCurrentRound.places.indexOf(horse.color.colorName) + 1 }}
        </div>
      </div>
    </template>
    <template v-else>
      <h2>Waiting for round starting</h2>
    </template>
  </div>
</template>
<style lang="scss">
@use "@/assets/styles/variables.scss" as *;

.HorsesRace {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 615px;

  @media (max-width: $laptop) {
    width: 100%;
    min-width: 100%;
  }

  &-track {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100px;
    position: relative;
    border: 2px dashed #ccc;
    border-right: 5px solid var(--horseColor, #000);

    @media (max-width: $mobile) {
      height: 50px;
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(
        to right,
        var(--horseColor, #000) 50%,
        #2e2e2e 50%
      );
      background-size: 30px 100%;
      opacity: 0.4;
      z-index: -1;
    }

    &-name {
      position: absolute;
      left: 0;
      font-weight: bold;
      color: var(--horseColor, #000);
      background: #2e2e2e;
      transform: rotate(-90deg) translateY(-30px);
      z-index: -1;
      width: 96px;
      padding: 10px 0;

      @media (max-width: $mobile) {
        width: 50px;
        padding: 5px 0;
        transform: rotate(-90deg) translateY(-10px);
      }
    }

    &-finished {
      position: absolute;
      left: 0;
      top: 0;
      font-weight: bold;
      color: var(--horseColor, #000);
      backdrop-filter: blur(5px);
      z-index: -1;
      width: 100%;
      height: 100%;
      padding: 10px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      background: rgba(46, 46, 46, 0.3);
    }
  }

  &-horse {
    position: absolute;
    left: calc(var(--horseDistance, 0) - 30px);
    transition: left 0.1s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
