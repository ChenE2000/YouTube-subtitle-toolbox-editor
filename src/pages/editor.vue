<template>
    <header p="y-4" flex="~ items-center">
        <h1 text="gray 3xl" font="bold">
            <span text-primary>Subtitle</span> toolbox
        </h1>
        <div ml-auto>
            <a-button @click="json.open = true">
                import
            </a-button>
            <a-button @click="save.open = true">
                save
            </a-button>
            <a-button @click="exportASS">
                export
            </a-button>
        </div>

        <!-- <a-button @click="backToHome" ml-auto>
            back
        </a-button> -->
    </header>

    <!-- <div>startPoint: {{ startPoint }}</div> -->
    <!-- <div>numberOfTicks: {{ numberOfTicks }}</div> -->

    <div>currentTime:
        <MinusCircleOutlined @click="currentTime -= 1" />
        <input type="number" v-model="currentTime">
        <PlusCircleOutlined @click="currentTime += 1" />
    </div>
    <div>timeInSight: {{ timeInSight }}</div>
    <!-- <div>isSelecting: {{ isSelecting }}</div> -->
    <!-- <div>indicatorLeft: {{ indicatorLeft }}</div> -->
    <!-- <div>currentGroupID: {{ currentGroupID }}</div> -->
    <!-- <div>groupedSentences: {{ groupedSentences }}</div> -->
    <div @mousewheel="onChangeZooming">zooming:
        <MinusCircleOutlined @click="zooming -= 10" />
        <input type="number" v-model="zooming">
        <PlusCircleOutlined @click="zooming += 10" />
    </div>

    <div style="margin: 20px;"></div>

    <!-- <div>ctrlPressed: {{ ctrlPressed }}</div> -->
    <div class="root-container">
        <div class="outer-container" @mousewheel="onMouseWheel" :style="{ 'width': `${timeLineTotalWidth}px` }">
            <div class="container" ref="container" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp">
                <!-- :class="{ selected: div.isSelected }" -->
                <div v-for="div in divs" :key="div.id" :style="boxStyle(div)" class="box" @click="onEditBox(div)">

                    {{ div.word }}
                    <!-- <input v-else v-model="div.word"> -->
                </div>

                <div v-if="isSelecting" :style="selectionStyle" class="selection"></div>
                <!-- <button v-if="noWordInSight" @click="jumpToNext">
                    jump to next
                </button> -->
                <a-button v-if="noWordInSight" @click="jumpToNext">jump to next</a-button>

            </div>
            <div class="time-ruler">
                <div v-for="n in numberOfTicks" :key="n" :style="{ 'margin-left': `${(n - 1) * timeUnit * zooming}px` }"
                    class="tick">
                    <div class="label">{{ formatTime(n - 1 + currentTime) }}</div>
                </div>

            </div>
            <div class="indicator">
                <div>{{ formatTime(cursorTime) }}</div>
                <div style="font-size: 20px;">words remaining: {{ wordLeft }}</div>
            </div>
        </div>

        <script-list :scripts="groupedSentences"></script-list>
    </div>

    <a-modal v-model:open="edit.open" title="change content">
        <a-input v-model:value="edit.content.word" placeholder="Basic usage" />
    </a-modal>
    <a-modal width="400" v-model:open="ass.open" title="results.ass">
        <div v-for="row in ass.content">{{ row }}</div>
    </a-modal>
    <a-modal @ok="loadData" v-model:open="json.open" title="vtt.json">
        <a-textarea v-model:value="json.content" :rows="8" />
    </a-modal>
    <a-modal v-model:open="save.open" title="save">
        <a-textarea v-model:value="sentencesStr" :rows="8" />
    </a-modal>
</template>
  

<style scoped>
* {
    --container-width: 1000px;
    --container-height: 580px;
}

.root-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.outer-container {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    overflow: hidden;
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

<script>
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons-vue';
import subtitles from "~/assets/script.json";
import ScriptList from "~/components/ScriptList.vue";
import { formatTime } from '../utils/TimeFormatter'

const sentences = subtitles.sentences.map((sentence) => {
    return {
        id: sentence.id,
        isSelected: false,
        word: sentence.chrs,
        time: sentence.start_time,
        sentenceID: sentence.sentence_id,
        isClicked: false
    };
})

export default {
    components: {
        PlusCircleOutlined,
        MinusCircleOutlined
    },
    data() {
        return {
            // time * zooming = pixels
            dy: 0,
            currentTime: 0,
            cursorTime: 0,
            zooming: 110,
            isSelecting: false,
            startPoint: { x: 0, y: 0 },
            endPoint: { x: 0, y: 0 },
            timeLineTotalWidth: 1000,
            timeUnit: 1,
            indicatorLeft: 0,
            ctrlPressed: false,
            sentences: sentences,
            divs: sentences,
            ctrlPressed: false,
            groupedSentences: {},
            currentGroupID: 0,
            edit: {
                open: false,
                content: null,
            },
            ass: {
                open: false,
                content: null,
            },
            json: {
                open: false,
                content: null
            },
            save: {
                open: false
            }


            // divs: [
            //     { id: 1, isSelected: false, word: "hello", time: 1, sentenceID: 1 },
            //     { id: 2, isSelected: false, word: "my", time: 2, sentenceID: 1 },
            //     { id: 3, isSelected: false, word: "name", time: 3, sentenceID: 1 },
            //     { id: 3, isSelected: false, word: "cy", time: 3.2, sentenceID: 1 },
            //     // ... add as many divs as needed
            // ],
        };
    },
    mounted() {
        window.addEventListener("keydown", this.handleKeydown);
        window.addEventListener("keyup", this.handleKeyup);
    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeydown);
        window.removeEventListener("keyup", this.handleKeyup);
    },
    computed: {
        selectionStyle() {
            const left = Math.min(this.startPoint.x, this.endPoint.x);
            const top = Math.min(this.startPoint.y, this.endPoint.y);
            const width = Math.abs(this.startPoint.x - this.endPoint.x);
            const height = Math.abs(this.startPoint.y - this.endPoint.y);

            return {
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
            };
        },
        // 'left': `${(div.time - currentTime) * zooming}px`
        noWordInSight() {
            return this.divs.length === 0;
        },
        numberOfTicks() {
            return Math.floor(this.timeLineTotalWidth / (this.timeUnit * this.zooming)) + 1;
        },
        timeInSight() {
            return {
                start: this.currentTime,
                end: this.currentTime + this.numberOfTicks * this.timeUnit,
            };

        },
        sentencesStr() {
            return JSON.stringify(sentences)
        }
    },
    watch: {
        timeInSight: {
            handler: function () {
                this.divs = sentences.filter((sentence) => {
                    return sentence.time >= this.timeInSight.start && sentence.time <= this.timeInSight.end;
                });
                this.wordLeft = sentences.filter((sentence) => {
                    return sentence.time >= this.currentTime;
                }).length
            },
            immediate: true
        },
    },
    methods: {
        formatTime: formatTime,
        boxStyle(div) {
            if (div.sentenceID == -1) {
                return {
                    'background-color': `hsl(0, 0%, 90%)`,
                    'left': `${(div.time - this.currentTime) * this.zooming}px`
                }
            }
            return {
                // 根据sentenceID%6分配一个背景颜色
                'background-color': `hsl(${div.sentenceID % 6 * 60}, 100%, 80%)`,
                'left': `${(div.time - this.currentTime) * this.zooming}px`
            }
        },
        preventZoomOnCtrlScroll(event) {
            if (event.ctrlKey) {
                event.preventDefault();
            }
        },
        jumpToNext() {
            this.currentTime = Math.floor(sentences[sentences.length - this.wordLeft].time)

        },
        onKeyDown(e) {
            console.log(e)
        },
        onMouseWheel(e) {
            if (e.wheelDeltaY > 0) {
                if (this.currentTime - 0.5 < 0) {
                    return
                }
                this.currentTime -= 0.5
            } else {
                this.currentTime += 0.5
            }

        },
        handleKeydown(event) {
            if (event.key === "Control") {
                this.ctrlPressed = true;
            }
        },
        handleKeyup(event) {
            if (event.key === "Control") {
                this.ctrlPressed = false;
            }
        },
        onChangeZooming(e) {
            if (e.wheelDeltaY > 0) {
                if (this.zooming + 2 > 220) {
                    return
                }
                this.zooming += 2
            } else {
                if (this.zooming - 2 < 100) {
                    return
                }

                this.zooming -= 2
            }
        },
        onMouseDown(e) {
            console.log("mouse down")
            this.isSelecting = true;
            this.startPoint.x = e.clientX;
            this.startPoint.y = e.clientY;
            this.endPoint.x = e.clientX;
            this.endPoint.y = e.clientY;
        },
        onMouseUp() {
            console.log("mouse up")
            this.isSelecting = false;
            // 在此处检测框选范围
            this.checkSelection();
            // filter sentenceID != -1
            let gs = sentences.filter((sentence) => sentence.sentenceID != -1)
            // groupby sentenceID
            gs = gs.reduce((r, a) => {
                r[a.sentenceID] = [...r[a.sentenceID] || [], a]
                return r
            }, {})
            // sort by first item's time
            gs = Object.values(gs).sort((b, a) => a[0].time - b[0].time)

            this.groupedSentences = gs
            this.currentGroupID++;
        },

        onMouseMove(e) {
            this.cursorTime = this.currentTime + (e.clientX-80)/this.zooming
            // this.indicatorLeft = e.clientX-167;
            if (!this.isSelecting) return;
            // 获取距离父div的x, y
            this.endPoint.x = e.clientX;
            this.endPoint.y = e.clientY;
            
            this.checkSelection();
        },
        // indicatorListener(e) {
        //     this.indicatorLeft = e.clientX-167;
        // },

        onEditBox(item) {
            console.log(item)
            this.edit.open = true;
            this.edit.content = item;
        },
        handleOk() {
            this.edit.open = false;
        },
        checkSelection() {
            const left = Math.min(this.startPoint.x, this.endPoint.x);
            const top = Math.min(this.startPoint.y, this.endPoint.y);
            const right = Math.max(this.startPoint.x, this.endPoint.x);
            const bottom = Math.max(this.startPoint.y, this.endPoint.y);

            // 框选区域太小时，不进行检测
            if (right - left < 10 || bottom - top < 5) return;

            this.divs.forEach((div, index) => {
                // get all div in container
                const divElement = document.querySelector(".container .box:nth-child(" + (index + 1) + ")");
                const divRect = divElement.getBoundingClientRect();

                if (
                    divRect.right > left &&
                    divRect.left < right &&
                    divRect.bottom > top &&
                    divRect.top < bottom
                ) {
                    this.divs[index].isSelected = true;
                    this.divs[index].sentenceID = this.currentGroupID
                } else {
                    this.divs[index].isSelected = false;
                }
            });
        },
        exportASS() {
            // Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
            this.ass.open = true
            let results = []
            console.log('keys', Object.keys(this.groupedSentences))
            Object.keys(this.groupedSentences).forEach(k => {
                // console.log(k)
                let startTime = formatTime(this.groupedSentences[k][0].time)
                let endTime = formatTime(this.groupedSentences[k][this.groupedSentences[k].length - 1].time)
                let text = this.groupedSentences[k].map((sentence) => sentence.word).join(" ")
                let row = `Dialogue: 0,${startTime},${endTime},Default,,0,0,0,,${text}`
                results.push(row)
            })

            this.ass.content = results
        },
        addAttrToRawJSON(str) {
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
        },
        loadData() {
            const data = this.addAttrToRawJSON(this.json.content)
            console.log(data)
            this.json.open = false
            // sentences = d 
        }
    }
}
</script>
