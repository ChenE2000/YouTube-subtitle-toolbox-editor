<script setup lang="ts">
import YouTubePlayer from "youtube-player";
import { usePlayer } from "~/store/usePlayer";

const props = defineProps({
  videoId: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    default: 480,
  },
  height: {
    type: Number,
    default: 320,
  },
});

let player: any;
const store = usePlayer();
const timer = ref();

onMounted(async () => {
  player = YouTubePlayer("player", {
    host: "https://www.youtube.com",
    width: props.width,
    height: props.height,
    videoId: props.videoId,
  });

  player.playVideo();

  player.on("stateChange", (e: any) => {
    if (e.data === 2)
      clearInterval(timer.value);

    if (e.data === 1) {
      timer.value = setInterval(() => {
        getCurrentTime();
      }, 1000);
    }
  });

  timer.value = setInterval(() => {
    getCurrentTime();
  }, 1000);

  store.duration = await getTotalDuration();
});

function getCurrentTime() {
  if (player && player.getCurrentTime) {
    player.getCurrentTime().then((result: number) => {
      store.curTime = result;
    });
  }
}

function getTotalDuration() {
  if (player && player.getDuration)
    return player.getDuration();

  return 0;
}
</script>

<template>
  {{ store.curTime }}
  <div id="player" />
</template>

