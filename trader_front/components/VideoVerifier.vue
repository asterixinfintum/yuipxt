<template>
    <div>
        <div class="videoverifier">
            <div class="videoverifier__videoelement" ref="videoContainer">
                
            </div>
            <div class="videoverifier__counter">
                {{ recordingTimer }}
            </div>
        </div>
    </div>
</template>

<script>
import generalutilities from '@/mixins/generalutilities.js';

import { mapActions, mapState, mapMutations } from 'vuex';

export default {
    props: ['setStep'],
    data() {
        return {
            recordingTimer: 0,
            recordedChunks: [],
            recordedBlob: null,
            recording: false,
            mediaRecorder: null,
            stream: null
        }
    },
    mixins: [generalutilities],
    methods: {
        ...mapMutations('verification', ['SET_VERIFICATION_VIDEO']),
        ...mapActions('verification', ['uploadVideoBloB']),
        updaterecordingTimer() {
            if (this.recording && this.recordingTimer < 10) {
                let recordingTimer = this.recordingTimer
                recordingTimer += 1;
                this.recordingTimer = recordingTimer;

                console.log(this.recordingTimer);

                setTimeout(() => {
                    this.updaterecordingTimer();
                }, 1000); 
            } else if (this.recordingTimer >= 10) {
                this.mediaRecorder.stop();
                this.recording = false;
            }
        },
        async openrecording() {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    const mediaRecorder = new MediaRecorder(stream);

                    this.stream = stream;

                    const video = document.createElement('video');
                    video.autoplay = true;
                    video.srcObject = stream;

                    this.$refs.videoContainer.appendChild(video);

                    mediaRecorder.addEventListener('dataavailable', (event) => {
                        if (event.data.size > 0) {
                            this.recordedChunks.push(event.data);
                            console.log(event)
                        }
                    });

                    mediaRecorder.addEventListener('start', () => {
                        console.log('Recording started...');
                        this.recording = true;
                        this.updaterecordingTimer();
                        this.mediaRecorder = mediaRecorder
                    });

                    mediaRecorder.addEventListener('stop', () => {
                        const recordedBlob = new Blob(this.recordedChunks, { type: 'video/webm' });
                        const { client } = this;
                        this.recordedBlob = recordedBlob;
                        this.SET_VERIFICATION_VIDEO(this.recordedBlob);
                        this.uploadVideoBloB({ blobData: this.recordedBlob, client_id: client._id })
                            .then(() => {
                                this.setStep(4)
                                const tracks = this.stream.getTracks();
                                tracks.forEach(track => track.stop());
                                this.stream = null
                            })
                    });

                    mediaRecorder.addEventListener('error', (event) => {
                        console.error('Error occurred during recording:', event.error);
                    });

                    mediaRecorder.start();
 
                } catch (error) {
                    // Handle error accessing the microphone and camera
                    console.error('Error accessing the microphone and camera:', error);
                }
            }
        }
    },
    mounted() {
        this.openrecording();
    },
    beforeUnmount() {
        if (this.stream) {
            const tracks = this.stream.getTracks();
            tracks.forEach(track => track.stop());
            this.stream = null
        }
    },
    computed: {
        ...mapState({
                client: state => state.auth.client,
        }),
    }
}
</script>

<style lang="scss">
.videoverifier {
    position: relative;

    &__videoelement {
        position: relative;
        overflow: hidden;
        height: #{scaleValue(250)};
        width: #{scaleValue(300)};
        margin: 0 auto;
        border: $border;
        border-color: $primary-color;
        border-width: #{scaleValue(3)};
        margin-top: #{scaleValue(30)};

        & video {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            object-fit: cover;
        }
    }

    &__counter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: #{scaleValue(60)};
        font-weight: 500;
        opacity: .7;
    }
}
</style>