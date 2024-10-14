<template>
    <div class="addannouncement container">
        <DashboardHeader />

        <div class="createasset__contents">
            <div class="createasset__inputs">
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Header</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="Header" v-model="header" />
                    </span>
                </div>

                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Preview</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="Preview" v-model="preview" />
                    </span>
                </div>

                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Content</label>
                    </span>
                    <span class="formInputField textarea">
                        <textarea placeholder="Content" v-model="content"></textarea>
                    </span>
                </div>

                <div class="createasset__inputarea">
                    <span>
                        <label for="imageUpload">Choose an image for the announcement:</label>
                    </span>
                    <span class="formInputField">
                        <input type="file" id="imageUpload" name="symbolImg" accept="image/*" @change="handleFileUpload">
                    </span>
                </div>

            </div>

            <div class="createasset__btns">
                <div class="formButtonArea">
                    <button class="formSubmitbutton" @click="createAnnouncement">Create Announcement</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import utilityMixin from '@/mixins/utility.js';

    export default {
        mixins: [utilityMixin],
        data() {
            return {
                header: '',
                preview: '',
                content: '',
                selectedImage: ''
            }
        },
        methods: {
            async createAnnouncement() {
                const { base_url, admin } = this;

                const {
                    header,
                    preview,
                    content,
                    selectedImage
                } = this;

                try {
                    if (header.length && preview.length && content.length) {
                        const admin_token = localStorage.getItem('873__jh6bdjkadmtoken');
                        const createdBy = this.$route.query.adminId;

                        const announcement = {
                            header,
                            preview,
                            content,
                            createdBy,
                            selectedImage
                        };

                        const formData = new FormData();
                        Object.keys(announcement).forEach(key => formData.append(key, announcement[key]));

                        fetch(`${base_url}/createannouncement?admin=${admin._id}`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${admin_token}`
                            },
                            body: formData
                        })
                        .then(response => response.json())
                        .then(data => {
                           // console.log(data)
                            this.openPage('announcements')
                        }).catch(err => {
                            console.log(err, 'this is error')
                        })
                    } else {
                        alert('fill out the fields to prevent errors')
                    }
                } catch (error) {
                    console.log(error)
                }
            },
            handleFileUpload(event) {
                this.selectedImage = event.target.files[0];
            }
        }
    }
</script>

<style lang="scss" scoped>
.addannouncement {
    @include base-container-style;

    &__contents {
        @include content;
        padding: #{scaleValue(30)};
    }   
}
</style>