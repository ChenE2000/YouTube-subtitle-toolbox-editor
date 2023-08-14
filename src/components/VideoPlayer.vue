<template>
    <!-- <div class="video">
        <video id="video" controls></video>
    </div> -->

    <div>
    <div class="video">
      <video v-if="enable" id="video" ref="videoRef" @timeupdate="updateTime" controls></video>
      <div v-else>video has been disabled</div>
    </div>
    <!-- <div>
      Current time: {{ curTime }}
      <button @click="setToSpecificTime">Set to 10s</button>
    </div> -->
  </div>
</template>
  
<script setup lang="ts">
// import { emit } from 'process';
defineProps({
    enable: {
        type: Boolean,
        default: true,
    },
});
let curTime = ref(0);

const videoRef = ref(null) as any;

onMounted(() => {
    const videoElement = document.getElementById('video') as any;
    const ws = new WebSocket('ws://localhost:8000/ws/vc8UBSp1tz0');

    ws.onmessage = (event) => {
        if (event.data instanceof Blob) {
            const blob = new Blob([event.data], { type: 'video/webm' });
            const videoUrl = URL.createObjectURL(blob);
            videoElement.src = videoUrl;
        }
    };
});

const emit = defineEmits(['update:curTime']);

const updateTime =() => {
    curTime.value = videoRef.value.currentTime;
    emit('update:curTime', curTime.value)
}

// const setToSpecificTime = () => {
//     videoRef.value.currentTime = 10; // 例如设置时间为10秒
// }


</script>

<style scoped>
.video {
    width: 500px;
    height: 240px;
    border: 1px solid black;
    /* display: flex; */
    /* justify-content: center; */
    /* align-items: center; */
}
#video {
    width: 500px;
    height: 240px;
} 
</style>
  