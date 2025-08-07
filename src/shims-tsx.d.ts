import Vue, { VNode } from "vue";

declare global {
  interface Window {
    lottie: any;
  }

  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
