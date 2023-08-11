<script setup lang="ts">
import subtitles from "~/assets/script.json";
import { usePlayer } from "~/store/usePlayer";

defineProps<{
  id: string
}>();

const router = useRouter();
const store = usePlayer();

const sentences = subtitles.sentences;
const paragraphs = sentences.map(item => item.chrs).join(" ");

function goBack() {
  router.back();
}
</script>

<template>
  <header p="y-4" flex="~ items-center">
    <button text-btn text-xl @click="goBack">
      Back
    </button>
    <button btn ml-auto>
      Preview
    </button>
  </header>
  <div>
    <YtPlayer video-id="iAMGlA0HPpc" />
  </div>
  <div flex="~ gap-2 wrap">
    <span v-for="item in sentences" v-show="item.start_time < store.curTime" :key="item.start_time">{{ item.chrs }}</span>
  </div>
  <div w-full mt-4>
    <textarea v-model="paragraphs" w-full h-48 p-4 border="1 solid black" outline-none />
  </div>
</template>
