<template>
    <div class="list">
        <!-- groupedSentences -->
        <!-- {{ scripts }}
    {{ Object.keys(scripts)   }} -->
        <div v-for="(k, index) in Object.keys(scripts)" :key="index">
            <div class="time" @click="onHandelLocate(scripts[k][0].time)">{{ formatTime(scripts[k][0].time) }} - {{
                formatTime(scripts[k][scripts[k].length - 1].time) }}</div>
            <div class="row" :style="rowStyle(scripts[k])">
                <!-- 'background-color': `hsl(${div.sentenceID % 6 * 60}, 100%, 80%)`, -->
                <div v-for="(sentence, index) in scripts[k]" :key="index" class="word">
                    {{ sentence.word }}
                </div>

                <a-popover title="Add Punctuation">
                    <template #content>
                        <a-button ml-1 v-for="punc in puctuations" size="small" type="primary" shape="circle"
                            @click="onHandlePuncSelect(scripts[k][scripts[k].length - 1], punc)">{{ punc }}</a-button>
                        <a-button ml-1 size="small" shape="circle"
                            @click="onHandlePuncClean(scripts[k][scripts[k].length - 1])">X</a-button>
                    </template>
                    <plus-square-outlined />
                </a-popover>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">

// import from '../utils/TimeFormatter'
import { PlusSquareOutlined } from '@ant-design/icons-vue';
import { formatTime } from '../utils/TimeFormatter'

const props = defineProps({
    scripts: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(['locate'])
const puctuations = ['.', ',', '?', '!', '...']


const rowStyle = (row) => {
    let isSelected = row[0].isSelected
    // console.log('rowStyle', isSelected)

    return {
        'borderLeft': `5px solid hsl(${row[0].sentenceID % 6 * 60}, 100%, 80%)`,
        'backgroundColor': isSelected ? 'rgba(255, 248, 37, 0.3)' : 'transparent',
    }
}

const onHandlePuncClean = (item) => {
    item.word = item.word.replace(/[.,\/#?!$%\^&\*;:{}=\-_`~()]/g, '')
}

const onHandlePuncSelect = (item, punc: string) => {
    onHandlePuncClean(item)
    item.word += punc
}

const onHandelLocate = (time: number) => {
    console.log('locate', time)
    emit('locate', time)
}

//watch props.scripts
// watch(() => props.scripts, (newVal, oldVal) => {
//     for (let i = 0; i < newVal.length; i++) {
//   let startTime = newVal[i][0].time
//   let endTime = newVal[i][newVal[i].length - 1].time
//   console.log('change', i, startTime, endTime)
// }
// })
</script>


<style scoped>
.list {
    font-family: popins, sans-serif;
    font-size: 13px;
    padding: 5px;
    width: 100%;
    background-color: rgba(167, 167, 167, 0.143);
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    height: 240px;
}

.row {
    display: flex;
    flex-direction: row;
    padding-left: 3px;
    /* justify-content: space-between; */
    /* align-items: center; */
    /* padding: 10px; */
    /* border-bottom: 1px solid #ccc; */
}

.time {
    color: rgba(0, 0, 0, 0.488);
    font-size: 9px;
    margin-top: 3px;
    border-top: 1px solid #cccccc9b;
}

.word {
    margin-right: 4px;
}
</style>