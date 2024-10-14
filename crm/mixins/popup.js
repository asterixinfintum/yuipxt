export default {
    data() {
        return {
            upload_popup: false
        }
    },
    methods: {
        open_csvupload() {
            this.upload_popup ? this.upload_popup = false : this.upload_popup = true;
        }
    }
}