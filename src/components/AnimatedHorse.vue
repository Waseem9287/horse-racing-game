<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  defineProps,
} from "vue";
import { useStore } from "@/store";
import { LoadedLottieAnimation } from "@/shims-tsx";

const props = defineProps<{
  horseSpeed?: number;
  horseName?: string;
}>();

const animation = ref<LoadedLottieAnimation>(null);
const show = ref(false);
const animationEl = ref<HTMLElement | null>(null);

const store = useStore();
const isPaused = computed(() => store.getters["races/isPaused"]);

const ANIMATION_CONFIG = {
  SPEED_COEFF: 1.15,
  SPEED_SLOWDOWN_COEFF: 0.8,
  DEFAULT_SPEED: 50,
  START_DELAY_MS: 250,
};

onMounted(() => {
  const animationElement = animationEl.value;
  if (animationElement && window.lottie) {
    try {
      animation.value = window.lottie?.loadAnimation({
        container: animationElement,
        renderer: "svg",
        loop: true,
        autoplay: false,
        path: "./horse-animation.json",
        rendererSettings: {
          progressiveLoad: true,
        },
      });

      const speed = props.horseSpeed ?? ANIMATION_CONFIG.DEFAULT_SPEED;
      animation.value.playSpeed =
        (ANIMATION_CONFIG.SPEED_COEFF * speed) /
        (1 + ANIMATION_CONFIG.SPEED_SLOWDOWN_COEFF * speed);

      setTimeout(() => {
        if (isPaused.value) {
          animation.value.pause();
        } else {
          animation.value.play();
        }
        show.value = true;
      }, ANIMATION_CONFIG.START_DELAY_MS);
    } catch (error) {
      show.value = true;
    }
  }
});

onBeforeUnmount(() => {
  if (animation.value) {
    animation.value.stop();
  }
});

watch(isPaused, (newVal) => {
  if (animation.value) {
    if (newVal) {
      animation.value.pause();
    } else {
      animation.value.play();
    }
  }
});
</script>

<template>
  <div class="AnimatedHorse" v-show="show">
    <p class="AnimatedHorse-name">
      {{ horseName }}
    </p>
    <div class="AnimatedHorse-animation" ref="animationEl" />
  </div>
</template>

<style lang="scss">
@use "@/assets/styles/variables.scss" as *;

.AnimatedHorse {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 65px;

  @media (max-width: $mobile) {
    width: 35px;
  }

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
