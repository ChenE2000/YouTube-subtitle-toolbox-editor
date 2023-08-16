<template>
    <!-- <div class="video">
        <video id="video" controls></video>
    </div> -->

    <a-spin :spinning="loading">
        <div class="video">
            <video v-if="enable" id="video" ref="videoRef" @loadedmetadata="captureDuration" @timeupdate="updateTime"
                controls></video>
            <div v-else>video has been disabled</div>
        </div>
        <!-- <div>
      Current time: {{ curTime }}
      <button @click="setToSpecificTime">Set to 10s</button>
    </div> -->
    </a-spin>
</template>
  
<script setup lang="ts">
// import { emit } from 'process';
const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    enable: {
        type: Boolean,
        default: true,
    },
    cursorTime: {
        type: Number,
        default: 0,
    }
});
let curTime = ref(0);
let loading = ref(true);
const videoRef = ref(null) as any;
const emit = defineEmits(['update:curTime', 'update:loaded']);
onMounted(() => {

    const handleKeyPress = (event: any) => {
        if (event.keyCode === 32) { // 空格键的键码是32
            event.preventDefault(); // 阻止默认的空格键行为（如滚动页面）
            // console.log(videoRef.value);
            if (videoRef.value.paused) {
                videoRef.value.play(); // 如果视频暂停，则开始播放
            } else {
                videoRef.value.pause(); // 如果视频正在播放，则暂停播放
            }
        }
        if (event.key === "t") {
            setCurTime(props.cursorTime)
            // ctrlPressed.value = true;
        }
    }
    window.addEventListener('keydown', handleKeyPress);


    const videoElement = document.getElementById('video') as any;
    const ws = new WebSocket(`ws://localhost:8000/ws/${props.id}`);
    console.log('ws connected');
    ws.onmessage = (event) => {
        if (event.data instanceof Blob) {
            console.log('video received');
            const blob = new Blob([event.data], { type: 'video/webm' });
            const videoUrl = URL.createObjectURL(blob);
            videoElement.src = videoUrl;
            loading.value = false;
        }
    };
});


const updateTime = () => {
    curTime.value = videoRef.value.currentTime;
    emit('update:curTime', curTime.value)
}
const setCurTime = (time: number) => {
    videoRef.value.currentTime = time;
}

const captureDuration = () => {
    console.log('duration captured');
    emit('update:loaded', videoRef.value.duration);
}



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
  