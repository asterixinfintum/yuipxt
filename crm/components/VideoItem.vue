<template>
    <div class="videoitem">
        <figure :id="videoName">
            <video :id="`video-element-${videoName}`" controls></video>
        </figure>
    </div>
</template>

<script>
import variables from '@/store/variables';

const { BASE_API_URL_TWO } = variables;

export default {
    props: ['viditem', 'ind'],
    data() {
        return {
            base_api_url: BASE_API_URL_TWO
        }
    },
    mounted() {
        this.renderVideo();
    },
    methods: {
        renderVideo() {
            const { videoName, base_api_url } = this;
            const videoItem = document.getElementById(`video-element-${videoName}`);
            const videoSrc = `${base_api_url}/${videoName}`;
            videoItem.src = videoSrc;
        }
    },
    computed: {
        videoName: function() {
            const filePath = `${this.viditem.filePath}`;
            const filename = filePath.substring(filePath.indexOf('/') + 1);

            return filename
        }
    }
}
</script>

<style lang="scss" scoped>
.videoitem {
    width: 100%;
    height: 100%;

    & figure {
        width: 100%;
        height: 100%;

        & video {
            width: 100%;
            height: 100%;
        }
    }
}
</style>