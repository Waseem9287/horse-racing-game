import Vue, { VNode } from "vue";

export type LoadedLottieAnimation = HTMLElement & {
  play: () => void;
  stop: () => void;
  pause: () => void;
  playSpeed: number;
};

declare global {
  interface Window {
    lottie: {
      loadAnimation: (options: any) => LoadedLottieAnimation;
    };
  }

  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
