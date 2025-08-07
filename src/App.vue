<template>
  <div id="app">
    <AppHeader />
    <div class="appLayout container">
      <HorsesList />
      <HorseRace />
      <RaceResults />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppHeader from "./components/AppHeader.vue";
import HorsesList from "./components/HorsesList.vue";
import HorseRace from "./components/HorsesRace.vue";
import RaceResults from "./components/RaceResults.vue";

export default Vue.extend({
  name: "App",
  components: {
    AppHeader,
    HorsesList,
    HorseRace,
    RaceResults,
  },
});
</script>

<style lang="scss">
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #eaeaea;

  * {
    box-sizing: border-box;
  }
}

#app {
  text-align: center;
  display: flex;
  flex-direction: column;
}

.appLayout {
  height: 100%;
  max-height: calc(100vh - 80px);
}

h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

h3,
h4 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.container {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  width: 100%;
  margin: 0 auto;
  gap: 10px;
}
</style>
