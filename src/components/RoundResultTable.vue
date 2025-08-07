<template>
  <div class="RoundResultTable">
    <div class="RoundResultTable-grid-header">
      <div>Position</div>
      <div>Name</div>
    </div>

    <div
      class="RoundResultTable-grid-row"
      v-for="({ name, color }, i) in sortedResults"
      :key="`horse-${i}`"
      :style="{ '--horseColor': color?.colorCode }"
    >
      <div>{{ i + 1 }}</div>
      <div>{{ name }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { IHorse, IRound } from "@/store/modules/types";

const ResultTableProps = Vue.extend({
  name: "RoundResultTable",
  props: {
    roundInfo: {
      type: Object,
      required: true,
    },
  },
});

@Component
export default class ResultTable extends ResultTableProps {
  public get sortedResults() {
    return (this.roundInfo as IRound).places.map((colorName) => {
      const horse = this.roundInfo.horses.find(
        (h: IHorse) => h.color.colorName === colorName
      );
      return {
        color: horse?.color,
        name: horse?.name,
      };
    });
  }
}
</script>

<style scoped lang="scss">
.RoundResultTable {
  &-grid {
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    overflow: auto;

    &-header {
      display: grid;
      grid-template-columns: 75px 1fr;
      background-color: #f4f4f4;
      font-weight: bold;
      padding: 10px;
      border-bottom: 1px solid #ddd;
      top: 0;
      z-index: 1;
    }

    &-row {
      display: grid;
      grid-template-columns: 75px 1fr;
      padding: 10px;
      align-items: center;
      position: relative;
      color: #333;
      border-bottom: 1px solid #ddd;

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
  }
}
</style>
