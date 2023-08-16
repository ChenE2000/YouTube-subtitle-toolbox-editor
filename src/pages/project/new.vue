<template>
    <div class="root-container">
        <div style="width: 60%;">
            <a-steps :current="current" :items="items"></a-steps>

            <div class="steps-content">
                <div v-if="current === 0">

                        <a-input-search v-model:value="id" addon-before="https://www.youtube.com/watch?v="
                            placeholder="video id" enter-button @search="onSearch" :loading="status.isSearching" />


                </div>
                <div v-if="current === 1" flex flex-row justify-space>

                    <a-image :src="meta.thumbnail" />

                    <div>
                        <div>
                            <div>title: {{ meta.title }}</div>
                            <div>by:{{ meta.channel }}</div>
                            <div>
                                <a-button v-for="item in vtt" size="small">{{ item.name }}</a-button>
                                <!-- {{ vtt[0].url }} -->
                            </div>
                        </div>
                        <div>
                            <a-button size="small" style="margin-right: 8px" @click="prev">Cancel</a-button>
                            <a-button size="small" type="primary" @click="startPreparation">Next</a-button>
                            
                        </div>

                    </div>


                </div>
                <div v-if="current === 2">
                    <a-button type="primary" size="large" :disabled="status.isVttDownloaded"
                    :loading="!status.isVttDownloaded">Downloading VTT</a-button>
                    <a-button type="primary" size="large" :disabled="status.isVideoDownloaded"
                    :loading="!status.isVideoDownloaded">Downloading Preview Video</a-button>
                    
                    <a-button size="small" @click="backToHome"
                    v-if="status.isVideoDownloaded && status.isVttDownloaded">Back to Project Home</a-button>
                </div>
            </div>

            <!-- <div class="steps-action">
                <a-button v-if="current < steps.length - 1" type="primary" @click="next">Next</a-button>
                <a-button v-if="current == steps.length - 1" type="primary"
                    @click="message.success('Processing complete!')">
                    Done
                </a-button>
                <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">Previous</a-button>
            </div> -->
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import downloaderDataService from '~/api/downloader';
import vttDataService from '~/api/vtt';

const router = useRouter();

const steps = [
    {
        title: 'Search Video',
        content: 'First-content',
    },
    {
        title: 'Select Subtitle',
        content: 'Second-content',
    },
    {
        title: 'Preperation',
        content: 'Last-content',
    },
];
const current = ref<number>(0);
let id = ref<string>('SA2S4TaeyXU');
let meta = ref<any>({});
let vtt = ref<any>([]);
let status = ref({
    isSearching: false,
    isVttDownloaded: false,
    isVideoDownloaded: false,
});

const next = () => {
    current.value++;
};
const prev = () => {
    current.value--;
    status.value.isSearching = false;
};


const items = steps.map(item => ({ key: item.title, title: item.title }));

const onSearch = async () => {
    if (id.value.length !== 11) {
        message.error('Invalid video id');
        return;
    }
    status.value.isSearching = true;
    const _meta = await downloaderDataService.meta(id.value)
    if (_meta.data === null) {
        message.error('Invalid video id');
        status.value.isSearching = false;
        return;
    }
    console.log("meta", _meta.data)
    meta.value = _meta.data;
    // only en for now
    let automaticCaptions = _meta.data.automatic_captions.en as any[]
    automaticCaptions = automaticCaptions.filter((item) => {
        return item.ext === 'vtt'
    })
    vtt.value = automaticCaptions
    next();
}

const startPreparation = async() => {
    next();
    //download vtt
    status.value.isVttDownloaded = await vttDataService.downloadVtt(vtt.value[0].url, id.value)
    //download video
    status.value.isVideoDownloaded = await downloaderDataService.downloadVideo(id.value, '(mp4,webm)')//(mp4,webm)[filesize>20M]
    if (status.value.isVideoDownloaded && status.value.isVttDownloaded) {
        message.success('Download complete!')
    } else {
        message.error('Download failed!')
    }
}

const backToHome = () => {
    router.push('/')
}

</script>




<style scoped>
.root-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.steps-content {
    padding: 10px;
    margin-top: 16px;
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    /* padding-top: 30px; */
}

.steps-action {
    margin-top: 24px;
}

[data-theme='dark'] .steps-content {
    background-color: #2f2f2f;
    border: 1px dashed #404040;
}
</style>
  