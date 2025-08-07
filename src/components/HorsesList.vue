<template>
  <div class="HorsesList">
    <h2>Horses List</h2>

    <div class="HorsesList-grid">
      <div class="HorsesList-grid-header">
        <div>#</div>
        <div>Name</div>
        <div>Condition</div>
        <div>Color</div>
      </div>

      <template v-if="getHorses && getHorses.length">
        <div
          class="HorsesList-grid-row"
          v-for="(horse, i) in getHorses"
          :key="`horse-${i}`"
          :style="{ '--horseColor': horse.color.colorCode }"
        >
          <div>{{ i + 1 }}</div>
          <div>{{ horse.name }}</div>
          <div>{{ horse.condition }}</div>
          <div class="HorsesList-grid-color">
            {{ horse.color.colorName }}
          </div>
        </div>
      </template>

      <template v-else>
        <div class="HorsesList-grid-empty">
          No horses available, generate a program first.
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { mapGetters } from "vuex";
import { IHorse } from "@/store/modules/types";

@Component({
  name: "HorsesList",
  computed: {
    ...mapGetters("horses", ["getHorses"]),
  },
})
export default class HorsesList extends Vue {
  public getHorses!: Array<IHorse>;
}
</script>

<style lang="scss">
.HorsesList {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 400px;
  min-width: 350px;

  &-grid {
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    overflow: auto;

    &-header {
      display: grid;
      grid-template-columns: 40px 1fr 1fr 1fr;
      background-color: #f4f4f4;
      font-weight: bold;
      padding: 10px;
      border-bottom: 1px solid #ddd;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    &-row {
      display: grid;
      grid-template-columns: 40px 1fr 1fr 1fr;
      padding: 10px;
      align-items: center;
      position: relative;
      color: #333;
      border-bottom: 1px solid #ddd;

      background: white;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 6px;
        background-color: var(--horseColor, #fff);
      }
    }

    &-color {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
    }

    &-empty {
      padding: 20px;
      text-align: center;
      color: #999;
    }
  }
}
</style>
