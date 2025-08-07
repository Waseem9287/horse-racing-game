<template>
  <div class="Horse" v-show="show">
    <p class="Horse-name">
      {{ horseName }}
    </p>
    <div class="Horse-animation" ref="animation" />
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "HorsesRace",
  props: {
    horseSpeed: {
      type: Number,
      default: 50,
    },
    horseName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      animation: null,
      show: false,
    };
  },
  computed: {
    ...mapGetters("races", ["isPaused"]),
  },
  mounted() {
    const animationElement = this.$refs.animation;
    if (animationElement && window.lottie) {
      try {
        this.animation = window.lottie?.loadAnimation({
          container: animationElement,
          renderer: "svg",
          loop: true,
          autoplay: false,
          path: "./horse-animation.json",
          rendererSettings: {
            progressiveLoad: true,
          },
        });

        const k = 1.15;
        const a = 0.8;
        this.animation.playSpeed =
          (k * this.horseSpeed) / (1 + a * this.horseSpeed); // Adjust speed for better animation

        setTimeout(() => {
          if (this.isPaused) {
            this.animation.pause();
          } else {
            this.animation.play();
          }

          this.show = true;
        }, 250);
      } catch (error) {
        this.show = true;
      }
    }
  },
  beforeDestroy() {
    if (this.animation) {
      this.animation.stop();
    }
  },
  watch: {
    isPaused(newVal) {
      if (this.animation) {
        if (newVal) {
          this.animation.pause();
        } else {
          this.animation.play();
        }
      }
    },
  },
});
</script>

<style lang="scss">
.Horse {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 65px;

  &-name {
    margin: 0 0 -10px;
    font-size: 10px;
    font-weight: bold;
  }

  &-animation {
    transform: scaleX(-1);
    display: flex;
    align-items: center;
    width: 100%;
  }
}
</style>
