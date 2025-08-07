<template>
  <div class="RaceResults">
    <div class="RaceResults-current">
      <h2>Current</h2>
      <template v-if="getCurrentRace">
        <div
          class="RaceResults-round"
          v-for="round in getCurrentRace.rounds"
          :key="`${getCurrentRace.id}-${round.id}`"
        >
          <h3>{{ round.id }} {{ round.distance }}m</h3>
          <RoundResultTable :roundInfo="round" />
        </div>
      </template>
      <template v-else>
        <div class="RaceResults-empty">
          No current program available. Please generate a program first.
        </div>
      </template>
    </div>
    <div class="RaceResults-prev">
      <h2>Previous</h2>
      <template v-if="getPreviousRaces.length">
        <div
          class="RaceResults-prev-race"
          v-for="race in getPreviousRaces"
          :key="race.id"
        >
          <h3>{{ race.id }}</h3>
          <div class="RaceResults-prev-rounds">
            <div
              class="RaceResults-prev-round"
              v-for="round in race.rounds"
              :key="`${race.id}-${round.id}`"
            >
              <h4>{{ round.id }} - {{ round.distance }}m</h4>
              <RoundResultTable :round-info="round" />
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="RaceResults-empty">No previous programs available.</div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { mapGetters } from "vuex";
import { IRace } from "@/store/modules/types";
import RoundResultTable from "@/components/RoundResultTable.vue";

@Component({
  name: "RaceResults",
  components: { RoundResultTable },
  computed: {
    ...mapGetters("races", ["getCurrentRace", "getPreviousRaces"]),
  },
})
export default class RaceResults extends Vue {
  public getCurrentRace!: IRace | null;

  public mounted() {
    // You can fetch or compute any initial data here if needed
  }
}
</script>

<style lang="scss">
.RaceResults {
  display: flex;
  align-items: stretch;
  gap: 5px;
  width: 100%;
  min-width: 350px;
  max-width: 600px;
  background: white;

  &-current,
  &-prev {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;

    overflow: auto;
  }

  &-prev {
    h2 {
      background: #b2ff9d;
    }
    h3 {
      background: #ffffa5;
    }
    h4 {
      background: #ffabab;
    }
  }

  &-current {
    h2 {
      background: #7e7eff;
    }

    h3 {
      background: #ffabab;
    }
  }

  &-empty {
    text-align: center;
    color: #888;
  }
}
</style>
