import BASE_VARS from './base_vars';

const { BASE_URL } = BASE_VARS;

export const state = () => ({
    verification_file: null,
    verification_photo: null,
    verification_video: null,
    upload_progress: 0,
    uploaded_verification_file_details: null,
    uploaded_verification_photo_details: null,
    uploaded_verification_video_details: null
});

export const mutations = {
    SET_FILE(state, data) {
        state.verification_file = data;
    },
    SET_VERIFICATION_PHOTO(state, data) {
        state.verification_photo = data;
    },
    SET_VERIFICATION_VIDEO(state, data) {
        state.verification_video = data;
    },
    SET_UPLOAD_PROGRESS(state, data) {
        state.upload_progress = data
    },
    SET_UPLOADED_VERIFICATION_FILE_DETAILS(state, data) {
        state.uploaded_verification_file_details = data
    },
    SET_UPLOADED_VERIFICATION_PHOTO_DETAILS(state, data) {
        state.uploaded_verification_photo_details = data
    },
    SET_UPLOADED_VERIFICATION_VIDEO_DETAILS(state, data) {
        state.uploaded_verification_video_details = data
    }
}

export const actions = {
    async uploadFile({ commit }, { file, client_id }) {
        return new Promise((resolve, reject) => {
            try {
                const formData = new FormData();
                formData.append('file', file);
    
                const xhr = new XMLHttpRequest();
    
                xhr.upload.addEventListener('progress', event => {
                    if (event.lengthComputable) {
                      const uploadProgress = Math.round((event.loaded / event.total) * 100);
                      commit('SET_UPLOAD_PROGRESS', uploadProgress);
                    }
                });
    
                xhr.open('POST', `${BASE_URL}/upload?client_id=${client_id}`);
    
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        const responseObject = JSON.parse(xhr.response);
                        const responseData = responseObject.uploaded_verification_file_details
                        commit('SET_UPLOADED_VERIFICATION_FILE_DETAILS', responseData);
                        commit('SET_UPLOAD_PROGRESS', 0)
                        resolve(responseData);
                    } else {
                        console.error('File upload failed');
                        commit('SET_UPLOAD_PROGRESS', 0)
                        reject(new Error('File upload failed'));
                    }
                }
    
                xhr.send(formData);
            } catch (error) {
                console.log(error, 'error here');
                reject(error);
            }
        });
    },
    async uploadImage({ commit }, { imagedata, client_id }) {
        return new Promise((resolve, reject) => {
            try {
                const formData = new FormData();
                formData.append('photo', imagedata);

                fetch(`${BASE_URL}/imageupload?client_id=${client_id}`, {
                    method: 'POST',
                    body: formData,
                })
                .then((response) => response.json())
                .then(data => {
                    const responseData = data.uploaded_verification_photo_details
                    commit('SET_UPLOADED_VERIFICATION_PHOTO_DETAILS', responseData);
                    resolve(responseData);
                })
                .catch(function (error) {
                    console.log(error, 'there is error')
                    reject(new Error('Image upload failed'));
                });
            } catch (error) {
                console.log(error)
            }
        });
    },
    async uploadVideoBloB({ commit }, { blobData, client_id }) {
        return new Promise((resolve, reject) => {
            try {
                const formData = new FormData();
                formData.append('video', blobData, 'recorded-video.webm');
                fetch(`${BASE_URL}/videoupload?client_id=${client_id}`, {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data, 'video uploaded');
                    const responseData = data.uploaded_verification_video_details
                    commit('SET_UPLOADED_VERIFICATION_VIDEO_DETAILS', responseData);
                    resolve(responseData);
                })
                .catch(error => {
                    console.log(error, 'there is error')
                    reject(new Error('Video upload failed'));
                });
            } catch (error) {

            }
        })
    }
}