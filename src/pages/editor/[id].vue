<template>
    <header flex="~ items-center">
        <h1 text="gray 3xl" font="bold" @click="goToHome">
            <span style="color: #e93323;">Subtitle</span> toolbox
        </h1>
        <div ml-auto>
            <!-- <a-button @click="json.open = true">
                import
            </a-button> -->
            <a-button size="small" @click="onHandleSave">
                save
            </a-button>
            <a-button size="small" @click="exportASS">
                export
            </a-button>
        </div>
    </header>

    <!-- <div>{{ currentTime }}/{{ videoCurTime }}/{{ videoDuration }} </div> -->
    <a-progress :showInfo="false" :stroke-color="{
        '0%': '#f9c710',
        '100%': '#e93323',
    }" :percent="videoCurTime / videoDuration * 100" />
    <!-- <div>startPoint: {{ startPoint }}</div> -->
    <!-- <div>numberOfTicks: {{ numberOfTicks }}</div> -->
    <!-- <div>isSelecting: {{ isSelecting }}</div> -->
    <!-- <div>{{ sentences }}</div> -->
    <!-- <div>indicatorLeft: {{ indicatorLeft }}</div> -->
    <!-- <div>currentGroupID: {{ currentGroupID }}</div> -->
    <!-- <div>groupedSentences: {{ groupedSentences }}</div> -->
    <!-- <div>ctrlPressed: {{ ctrlPressed }}</div> -->
    <!-- <div>videoCurTime: {{ videoCurTime }}</div> -->
    <!-- <div>currentTime:
        <a-input-number id="inputCurrentTime" v-model:value="currentTime" size="small" />
    </div> -->
    <!-- <div>timeInSight: {{ timeInSight }}</div> -->
    <div @mousewheel="onChangeZooming">zooming:
        <a-input-number id="inputZooming" v-model:value="zooming" :step="10" size="small" />
    </div>

    <a-button :disabled="markerInSight" @click="centerizeMarker" size="small">CenterizeMarker</a-button>
    <a-button size="small" @click="onDeleteSelected">Delete Selectd</a-button>
    <!-- <div style="margin: 20px;"></div> -->

    <div flex="~">
        <VideoPlayer :id="props.id" :enable="true" :curTime="videoCurTime" :cursorTime="cursorTime"
            @update:curTime="onUpdateCurTime" @update:loaded="onUpdateVideoLoaded" />
        <ScriptList :scripts="groupedSentences" @locate="onHandleLocate" />
    </div>


    <div class="root-container">
        <div class="outer-container" @mousewheel="onMouseWheel" :style="{ 'width': `${timeLineTotalWidth}px` }">
            <div class="container" ref="container" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp">
                <!-- :class="{ selected: div.isSelected }" -->
                <div v-for="(div, index) in divs" :key="index" :style="boxStyle(div)" class="box" @click="onEditBox(div)"
                    @dblclick="videoCurTime = div.time">
                    {{ div.word }}
                </div>

                <div v-if="isSelecting" :style="selectionStyle" class="selection"></div>
                <a-button v-if="noWordInSight" @click="jumpToNext">jump to next</a-button>
            </div>
            <div class="time-ruler">
                <div v-for="n in numberOfTicks" :key="n" :style="{ 'margin-left': `${(n - 1) * timeUnit * zooming}px` }"
                    class="tick">
                    <div class="label">{{ formatTime(n - 1 + currentTime) }}</div>
                </div>

            </div>
            <div class="indicator">
                <div class="marker" :style="markerStyle"></div>
                <div>{{ formatTime(cursorTime) }}</div>
                <div style="font-size: 20px;">words remaining: {{ wordLeft }}</div>
            </div>
        </div>
    </div>

    <a-modal v-model:open="edit.open" title="Change Content">
        <template #footer>
            <a-button key="capitalize" @click="onCapitalize">
                Capitalize
            </a-button>
            <a-button key="wrap" @click="onWrap">
                Wrap
            </a-button>
            <!-- <a-button type="primary" key="submit" @click="edit.open = false">
                Submit
            </a-button> -->
        </template>
        <a-input v-model:value="edit.content.word" placeholder="empty" />
    </a-modal>


    <a-modal :width="800" v-model:open="ass.open" :footer="null" title=".ASS Result">
        <!-- <template #footer>
            <a-button type="primary" key="back" :icon="h(SnippetsOutlined)"
            @click="handleCopy(assStr)">Copy to Clipboard</a-button>
        </template> -->
        <a-textarea :value="assStr" placeholder="Basic usage" :rows="8" />
        <!-- <div>
            <div v-for="row in ass.content">{{ row }}</div>
        </div> -->
    </a-modal>
    <a-modal v-model:open="save.open" title="Save" :width="300" :footer="null">
        <!-- <a-textarea :value="sentencesStr" :rows="8" /> -->
        <!-- {{ save.content }} -->
        <div flex flex-col gap-2>
            <a-button type="primary" @click="handleCopy(save.content)" :icon="h(SnippetsOutlined)">Copy to Clipboard</a-button>
            <a-button type="primary" @click="handleSaveToServer" :icon="h(CloudServerOutlined)">Save to Server</a-button>
            <a-button type="primary" @click="handleSaveFile" :icon="h(DownloadOutlined)">Save to Local</a-button>

        </div>

    </a-modal>

    <!-- float button -->
    <a-float-button tooltip="HELP INFO" :style="{
        right: '24px',
    }">
        <template #icon>
            <FileTextOutlined />
        </template>
    </a-float-button>
</template>
  

<style scoped>
* {
    --container-width: 1000px;
    --container-height: 400px;
}

/* .root-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    overflow: hidden;
    height: var(--container-height);
} */

.outer-container {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    overflow: hidden;
    /* height: var(--container-height); */
}

.container {
    /* position: relative; */
    border-radius: 2px;
    background-color: rgba(167, 167, 167, 0.143);
    height: var(--container-height);
    padding: 20px;
}

.time-ruler {
    background-color: rgb(188, 255, 233);
    position: relative;
    width: 100%;
    height: 30px;
    padding: 5px;
    /* 刻度尺的高度，可以根据需求进行调整 */
    /* background: repeating-linear-gradient(90deg, #000, #000 1px, #fff 1px, #fff 5%); */
    /* 这会创建一个简单的刻度效果 */
}

.marker {
    position: absolute;
    width: 1px;
    border: 1px dashed rgb(184, 0, 0);
    height: 100%;
    /* animation that makes it move smoothly */
    transition: all 0.3s linear 0s;
}



.tick {
    position: absolute;
    top: 0;
    width: 1px;
    height: 10px;
    /* or whatever height you desire for the tick mark */
    background-color: #000;
}

.label {
    position: absolute;
    top: 10px;
    transform: translateX(-50%);
    font-size: 9px;
    user-select: none;
}

.indicator {
    /* position: absolute; */
    height: var(--container-height);
    width: var(--container-width);
    border: 1px dashed red;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgba(128, 128, 128, 0.2);
    font-size: 70px;
    user-select: none;
    pointer-events: none;
    overflow: hidden;
}

.box {
    color: #000000b1;
    width: 45px;
    border-radius: 2px;
    font-size: 7px;
    height: 18px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    /* float: left; */
    position: relative;
    padding: 2px;
    user-select: none;
    -webkit-user-select: none;
    /* Chrome, Safari, Opera */
    -moz-user-select: none;
    /* Firefox */
    -ms-user-select: none;
    /* IE 10+/ Edge */
    user-select: none;
    /* Standard syntax */
    display: flex;
    align-items: center;
    justify-content: center;
    /* transition: all 0.2s linear 0s; */
    transition: transform 0.5s ease-in-out;
}

.selected {
    background-color: yellow;
}

.selection {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    border: 2px dashed blue;
    background-color: rgba(0, 0, 255, 0.1);
    /* 半透明蓝色 */
    pointer-events: none;
    /* 确保框选框不会干扰其他鼠标事件 */
}
</style>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import { SnippetsOutlined, FileTextOutlined, CloudServerOutlined, DownloadOutlined } from '@ant-design/icons-vue';
// import subtitles from "~/assets/script.json";
import ScriptList from "~/components/ScriptList.vue";
import { formatTime } from '../../utils/TimeFormatter'
import VideoPlayer from "~/components/VideoPlayer.vue";
import vttDataService from "~/api/vtt";

interface Coord {
    x: number
    y: number
}

interface Word {
    isSelected: boolean
    word: string
    time: number
    sentenceID: number
    isClicked: boolean
}

const props = defineProps<{
    id: string
}>();

let subtitles = await vttDataService.getParsedVtt(props.id)
console.log(subtitles)
let router = useRouter()
let sentences = ref(subtitles.data.sentences.map((sentence) => {
    return {
        isSelected: false,
        word: sentence.chrs,
        time: sentence.start_time,
        sentenceID: sentence.sentence_id,
        isClicked: false
    };
}))

// find biggest sentenceID in sentences
let maxSentenceID = Math.max(...sentences.value.map((sentence) => sentence.sentenceID))

let videoCurTime = ref(0)
let videoDuration = ref(0)
let currentTime = ref(0)
let cursorTime = ref(0)
let zooming = ref(110)
let isSelecting = ref<boolean>(false)
let startPoint = ref<Coord>({ x: 0, y: 0 })
let endPoint = ref<Coord>({ x: 0, y: 0 })
let timeLineTotalWidth = ref(1000)
let timeUnit = ref(1)
//    let indicatorLeft= ref(1)
// let ctrlPressed = ref<boolean>(false)
//    let sentences = ref(sentences)
let divs = ref([] as Word[])
let groupedSentences = ref({})
let currentGroupID = ref(maxSentenceID + 1)
let wordLeft = ref(0)
let edit = ref({
    open: false as boolean,
    content: {} as Word,
})
let ass = ref({
    open: false,
    content: [] as string[],
})
let json = ref({
    open: false,
    content: "" as string
})
let save = ref({
    open: false as boolean,
    content: "" as string
})


// beforeUnmount() {
//     window.removeEventListener("keydown", this.handleKeydown);
//     window.removeEventListener("keyup", this.handleKeyup);
// },


// const handleKeyup = (event) => {
//     if (event.key === "Control") {
//         ctrlPressed.value = false;
//     }
// }
const onCapitalize = () => {
    let word = edit.value.content.word
    edit.value.content.word = word.charAt(0).toUpperCase() + word.slice(1)
}
const onWrap = () => {
    // wrap using ""
    // if edit.value.content.word has "" already
    edit.value.content.word = `“${edit.value.content.word}”`
}


const handleSaveFile = () => {
    const data = vttDataService.download(props.id, "vtt.json")
    // TODO save data to user's fs

}
const onUpdateVideoLoaded = (e: number) => {
    videoDuration.value = e
}

const goToHome = () => {
    router.push('/')
}
const onUpdateCurTime = (e: number) => {
    videoCurTime.value = e
}

const onHandleLocate = (time: number) => {
    currentTime.value = Math.floor(time)
}

const markerInSight = computed(() => {
    return timeInSight.value.start <= videoCurTime.value && videoCurTime.value <= timeInSight.value.end
})

const markerStyle = computed(() => {
    const visible = timeInSight.value.start <= videoCurTime.value && videoCurTime.value <= timeInSight.value.end
    return {
        display: visible ? "block" : "none",
        left: `${(videoCurTime.value - currentTime.value) * zooming.value}px`
    };
})

const selectionStyle = computed(() => {
    const left = Math.min(startPoint.value.x, endPoint.value.x);
    const top = Math.min(startPoint.value.y, endPoint.value.y);
    const width = Math.abs(startPoint.value.x - endPoint.value.x);
    const height = Math.abs(startPoint.value.y - endPoint.value.y);

    return {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
    };
})

const assStr = computed(() => {
    return ass.value.content.join('\n')
})

const noWordInSight = computed(() => {
    return divs.value.length === 0;
})

const numberOfTicks = computed(() => {
    return Math.floor(timeLineTotalWidth.value / (timeUnit.value * zooming.value)) + 1;
})

const timeInSight = computed(() => {
    return {
        start: currentTime.value,
        end: currentTime.value + numberOfTicks.value * timeUnit.value,
    };

})

const centerizeMarker = () => {
    currentTime.value = Math.floor(videoCurTime.value - numberOfTicks.value / 2)
}

const onHandleSave = () => {
    save.value.open = true
    save.value.content = sentencesStr()
}

const onDeleteSelected = () => {
    console.log(sentences.value.filter((sentence) => sentence.isSelected).length)
    sentences.value = sentences.value.filter((sentence) => !sentence.isSelected)
    // fresh div 
    currentTime.value++
    currentTime.value--
}

const sentencesStr = () => {
    const obj = {
        "sentences": sentences.value.map((sentence) => {
            return {
                "chrs": sentence.word,
                "start_time": sentence.time,
                "sentence_id": sentence.sentenceID
            }
        })
    }
    return JSON.stringify(obj)
}

//Watch
watch(timeInSight, () => {
    divs.value = sentences.value.filter((sentence) => {
        return sentence.time >= timeInSight.value.start && sentence.time <= timeInSight.value.end;
    });
    wordLeft.value = sentences.value.filter((sentence) => {
        return sentence.time >= currentTime.value;
    }).length
}, { immediate: true })

// watch(videoCurTime, () => {
//     currentTime.value = videoCurTime.value
// }, { immediate: true })


// formatTime: formatTime,
const boxStyle = (div: Word) => {
    if (div.sentenceID == -1) {
        return {

            'background-color': `hsl(0, 0%, 90%)`,
            'left': `${(div.time - currentTime.value) * zooming.value}px`
        }
    }
    let border = div.isSelected ? '2' : '0'

    return {
        // 根据sentenceID%6分配一个背景颜色
        'border': `${border}px solid rgb(255, 123, 0)`,
        'background-color': `hsl(${div.sentenceID % 6 * 60}, 100%, 80%)`,
        'left': `${(div.time - currentTime.value) * zooming.value}px`
    }
}

const jumpToNext = () => {
    currentTime.value = Math.floor(sentences.value[sentences.value.length - wordLeft.value].time)
}

const handleSaveToServer = () => {
    vttDataService.updateVtt(props.id, "vtt.json", {
        "updated_at": new Date().toISOString().slice(0, 19).replace('T', ' '),
        "sentences": sentences.value.map((sentence) => {
            return {
                "chrs": sentence.word,
                "start_time": sentence.time,
                "sentence_id": sentence.sentenceID
            }
        })
    })
    message.success(`Saved to Server`)
}

const onMouseWheel = (e: any) => {
    if (e.wheelDeltaY > 0) {
        if (currentTime.value - 0.5 < 0) {
            return
        }
        currentTime.value -= 0.5
    } else {
        currentTime.value += 0.5
    }
}


const onChangeZooming = (e: any) => {
    if (e.wheelDeltaY > 0) {
        if (zooming.value + 2 > 220) {
            return
        }
        zooming.value += 2
    } else {
        if (zooming.value - 2 < 100) {
            return
        }

        zooming.value -= 2
    }
}

const onMouseDown = (e: any) => {
    console.log("mouse down")
    isSelecting.value = true;
    startPoint.value.x = e.clientX;
    startPoint.value.y = e.clientY;
    endPoint.value.x = e.clientX;
    endPoint.value.y = e.clientY;
}

const checkSelection = () => {
    const left = Math.min(startPoint.value.x, endPoint.value.x);
    const top = Math.min(startPoint.value.y, endPoint.value.y);
    const right = Math.max(startPoint.value.x, endPoint.value.x);
    const bottom = Math.max(startPoint.value.y, endPoint.value.y);

    // 框选区域太小时，不进行检测
    if (right - left < 10 || bottom - top < 5) return;
    // set all isSelected to false
    // sentences.value = sentences.value.forEach((div) => {
    //     div.isSelected = false;
    // })

    divs.value.forEach((div, index) => {
        // get all div in container
        const divElement = document.querySelector(".container .box:nth-child(" + (index + 1) + ")")!;
        const divRect = divElement.getBoundingClientRect();

        if (
            divRect.right > left &&
            divRect.left < right &&
            divRect.bottom > top &&
            divRect.top < bottom
        ) {
            div.isSelected = true;
            div.sentenceID = currentGroupID.value
        }
    })
}

const onMouseUp = () => {
    console.log("mouse up")
    // set all isSelected to false
    sentences.value = sentences.value.map((div) => {
        div.isSelected = false;
        return div;
    })
    isSelecting.value = false;
    // 在此处检测框选范围
    checkSelection();
    // filter sentenceID != -1
    let gs = sentences.value.filter((sentence) => sentence.sentenceID != -1) as Word[]
    // groupby sentenceID
    gs = gs.reduce((r, a) => {
        r[a.sentenceID] = [...r[a.sentenceID] || [], a]
        return r
    }, {}) as Word[]
    // sort by first item's time
    gs = Object.values(gs).sort((b, a) => a[0].time - b[0].time)

    groupedSentences.value = gs
    currentGroupID.value++;
}

const onMouseMove = (e: any) => {
    cursorTime.value = currentTime.value + (e.clientX - 80) / zooming.value
    // indicatorLeft = e.clientX - 167;
    if (!isSelecting.value) return;
    // 获取距离父div的x, y
    endPoint.value.x = e.clientX;
    endPoint.value.y = e.clientY;

    checkSelection();
}


const onEditBox = (item: Word) => {
    console.log(item)
    edit.value.open = true;
    edit.value.content = item;
}
// const handleOk = () => {
//     edit.value.open = false;
// }

const exportASS = () => {
    // Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
    ass.value.open = true
    let results = [] as string[]
    let exportSentences = groupedSentences.value as Word[];
    console.log('keys', Object.keys(exportSentences))
    Object.keys(exportSentences).forEach(k => {
        // console.log(k)
        let startTime = formatTime(exportSentences[k][0].time)
        let endTime = formatTime(exportSentences[k][exportSentences[k].length - 1].time + 0.015)
        exportSentences[k] = exportSentences[k].filter((item) => item !== "")
        let text = exportSentences[k].map((sentence) => sentence.word).join(" ")
        let row = `Dialogue: 0,${startTime},${endTime},Default,,0,0,0,,${text}`
        results.push(row)
    })
    ass.value.content = results.reverse()
}



const addAttrToRawJSON = (str: string) => {
    let obj = JSON.parse(str)
    return obj.sentences.map((sentence) => {
        return {
            id: sentence.id,
            isSelected: false,
            word: sentence.chrs,
            time: sentence.start_time,
            sentenceID: sentence.sentence_id,
            isClicked: false
        };
    })
}
const loadData = () => {
    const data = addAttrToRawJSON(json.value.content) as Word[]
    json.value.open = false
    sentences.value = data
}

const handleCopy = (content: string) => {
    // let content = JSON.stringify(content_o)
    let aux = document.createElement("input");
    // join ass.value.content with \n
    // 获取assOutput的内容
    // const assOutput = ref()

    aux.setAttribute("value", content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);

    // navigator.clipboard.writeText()
    message.success(`Copied to Clipboard`)
}

</script>
