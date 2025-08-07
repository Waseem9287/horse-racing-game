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

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { mapActions, mapGetters } from "vuex";
import { IHorse, IRound } from "@/store/modules/types";

@Component({
  name: "AppHeader",
  computed: {
    ...mapGetters("races", ["isPaused", "getCurrentRound"]),
    ...mapGetters("horses", ["getHorses"]),
  },
  methods: {
    ...mapActions("horses", ["generateProgram"]),
    ...mapActions("races", ["pauseRace", "resumeRace", "generateRace"]),
  },
})
export default class AppHeader extends Vue {
  public isPaused!: boolean;
  public getCurrentRound!: IRound | null;
  public getHorses!: Array<IHorse>;
  public pauseRace!: () => void;
  public resumeRace!: () => void;
  public generateProgram!: () => void;
  public generateRace!: () => void;

  public toggleRace(): void {
    if (this.isPaused && this.getCurrentRound) {
      this.resumeRace();
    } else if (this.isPaused && !this.getCurrentRound) {
      this.generateRace();
      this.resumeRace();
    } else {
      this.pauseRace();
    }
  }

  public StartProgram(): void {
    this.generateProgram();
    if (!this.isPaused) {
      this.pauseRace();
    }
  }
}
</script>

<style lang="scss">
.AppHeader {
  background-color: #282c34;
  color: #dddddd;

  height: 80px;

  h1 {
    margin: 0;
    font-size: 32px;
    font-weight: bold;
  }

  &-actions {
    display: flex;
    gap: 10px;

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
