import { defineStore } from "pinia";

export const usePlayer = defineStore("player", {
  state: () => ({
    curTime: 0,
    duration: 0,
  }),
});
