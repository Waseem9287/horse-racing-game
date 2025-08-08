<template>
  <div id="app">
    <AppHeader />
    <div class="appLayout container">
      <HorsesList />
      <HorsesRace />
      <RacesResults />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "./components/AppHeader.vue";
import HorsesList from "./components/HorsesList.vue";
import HorsesRace from "./components/HorsesRace.vue";
import RacesResults from "./components/RacesResults.vue";
</script>

<style lang="scss">
@use "@/assets/styles/variables.scss" as *;

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

  @media (max-width: $laptop) {
    flex-direction: column;
  }
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
