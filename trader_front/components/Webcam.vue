<template>
    <div>
        <div class="webcam">
            <div class="webcam__videoparent">
                <figure class="webcam__assetcontainer" ref="videoContainer"></figure>
                <div class="webcam__countdown" v-if="countdown">{{  countdown  }}</div>
                <button 
                    class="webcam__btn btn colored-btn padded-btn" 
                    v-if="!imageCaptured" 
                    @click="capture">Capture</button>
                <button 
                    class="webcam__btn btn colored-btn padded-btn" 
                    v-if="imageCaptured" 
                    @click="callUploadImage">Next Step >></button>
                <div class="webcam__retry">Or would you like to <span class="underlinelink" @click="openCam">Retry</span>?</div>
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
                countdown: 0,
                imageCaptured: false,
                imageData: null,
                stream: null
            }
        },
        mixins: [generalutilities],
        methods: {
            ...mapMutations('verification', ['SET_VERIFICATION_PHOTO']),
            ...mapActions('verification', ['uploadImage']),
            callUploadImage() {
                const { client } = this
                this.uploadImage({ imagedata: this.imageData, client_id: client._id })
                    .then(() => {
                        this.setStep(3);
                    })
            },
            capture() {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                const video = document.getElementById('webcam-video');

                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageData = canvas.toDataURL('image/jpeg');
                const photo = document.createElement('img');

                photo.src = imageData;
                const dataURItoBlob = this.dataURItoBlob(imageData);
                this.imageData = dataURItoBlob;
                this.SET_VERIFICATION_PHOTO(imageData);

                this.$refs.videoContainer.appendChild(photo);
                this.imageCaptured = true;

                if (this.stream !== null) {
                    this.stream.getTracks().forEach(function (track) {
                        track.stop();
                    });

                    this.stream = null;
                }
            },
            openCam() {
                this.imageCaptured = false;

                const videoElements = this.$refs.videoContainer.querySelectorAll('video');
                const imgElements = this.$refs.videoContainer.querySelectorAll('img');

                videoElements.forEach((video) => {
                    video.parentNode.removeChild(video);
                });

                imgElements.forEach((img) => {
                    img.parentNode.removeChild(img);
                });

                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({ video: true })
                    .then((stream) => {
                        const video = document.createElement('video');
                        video.id = 'webcam-video';
                        video.srcObject = stream;
                        video.play();

                        this.$refs.videoContainer.appendChild(video);
                        this.stream = stream;
                    })
                }
            },
            dataURItoBlob(dataURI) {
                const byteString = atob(dataURI.split(',')[1]);
                const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                return new Blob([ab], { type: mimeString });
            }
        },
        computed: {
            ...mapState({
                client: state => state.auth.client,
                verification_photo: state => state.verification.verification_photo,
                uploaded_verification_photo_details: state => state.verification.uploaded_verification_photo_details
            })
        },
        mounted() {
            this.openCam();
        }
    }
</script>

<style lang="scss">
.webcam {
    width: 100%;

    &__videoparent {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    
    &__assetcontainer {
        border-radius: 100%;
        overflow: hidden;
        height: #{scaleValue(200)};
        width: #{scaleValue(200)};
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        border: $border;
        border-color: $primary-color;
        border-width: #{scaleValue(3)};

        & video {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            object-fit: cover;
        }

        & img {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            object-fit: cover;
        }
    }

    &__countdown {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        font-size: #{scaleValue(30)};
        font-weight: 500;
    }

    &__btn {
        margin-top: #{scaleValue(30)};
        display: flex;
        align-items: center;
    }

    &__retry {
        background: $popup-background;
        padding: #{scaleValue(10)} #{scaleValue(20)};
        border-radius: #{scaleValue(4)};
        margin-top: #{scaleValue(20)};

        & span {

            &.underlinelink {
                font-size: #{scaleValue(15)};
            }
        }
    }
}
</style>