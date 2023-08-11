<template>
    <div class="container">
        <!-- groupedSentences -->
        <!-- {{ scripts }}
    {{ Object.keys(scripts)   }} -->
        <div v-for="(k, index) in Object.keys(scripts)" :key="index" >
            <div class="time">{{ formatTime(scripts[k][0].time) }} - {{ formatTime(scripts[k][scripts[k].length - 1].time) }}</div>
            <div class="row">
                <div v-for="(sentence, index) in scripts[k]" :key="index" class="word">
                    {{ sentence.word }}
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">

// import from '../utils/TimeFormatter'
import { formatTime } from '../utils/TimeFormatter'

const props = defineProps({
    scripts: {
        type: Object,
        required: true,
    },
})
console.log(props.scripts)

//watch props.scripts
// watch(() => props.scripts, (newVal, oldVal) => {
//     for (let i = 0; i < newVal.length; i++) {
//   let startTime = newVal[i][0].time
//   let endTime = newVal[i][newVal[i].length - 1].time
//   console.log('change', i, startTime, endTime)
// }
// })


// let sentences = ref([])
// sentences = props.scripts

// let groupedSentences = ref({})

// filter sentenceID != -1
// groupedSentences = props.scripts.filter((script) => script.sentenceID != -1)
// groupby sentenceID
// const gs = sentences.reduce((r, a) => {
//   r[a.sentenceID] = [...r[a.sentenceID] || [], a]
//   return r
// }, {})
// console.log(gs)
</script>


<style scoped>
.container {
    width: 360px;
    background-color: rgba(255, 228, 196, 0.195);
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
}

.row {
    display: flex;
    flex-direction: row;
    /* justify-content: space-between; */
    /* align-items: center; */
    /* padding: 10px; */
    /* border-bottom: 1px solid #ccc; */
}

.time {
    margin-top: 3px;
    border-top: 1px solid #cccccc9b;
}

.word {
    margin-right: 4px;
}

</style>