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
        <Horse
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

<script lang="ts">
import Vue from "vue";
import Horse from "@/components/Horse.vue";
import Component from "vue-class-component";
import { mapGetters } from "vuex";
import { IRound } from "@/store/modules/types";

@Component({
  name: "HorsesList",
  components: {
    Horse,
  },
  computed: {
    ...mapGetters("races", ["getCurrentRound"]),
  },
})
export default class HorsesList extends Vue {
  public getCurrentRound!: IRound | null;
}
</script>

<style lang="scss">
.HorsesRace {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 750px;

  &-track {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100px;
    position: relative;
    border: 2px dashed #ccc;
    border-right: 5px solid var(--horseColor, #000);

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
