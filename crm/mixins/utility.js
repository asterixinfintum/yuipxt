import { mapActions, mapState } from 'vuex';
import urlMixin from '@/mixins/url.js';

export default {
    mixins: [urlMixin],
    methods: {
        ...mapActions('auth', ['getCurrentAdmin', 'getClients']),
        ...mapActions('client', ['getClients', 'getClient', 'getClientVerificationMedia']),
        ...mapActions('assets', ['getAssets', 'getAsset', 'editAsset']),
        ...mapActions('announcements', ['getAnnouncements']),
        goToUser(client_id, admin_token, adminId) {
            this.$router.push(`/client/${client_id}?admin_token=${admin_token}&adminId=${adminId}`);
        },
        editUser(client_id, admin_token, adminId) {
            this.$router.push(`/editclient/${client_id}?admin_token=${admin_token}&adminId=${adminId}`);
        },
        routeTo(path) {
            this.$router.push(path);
        },
        openPage(page) {
            const { routeTo, adminIdQuery } = this;
            routeTo(`/${page}${adminIdQuery}`);
        },
        openItemPage(page, itemid) {
            const { routeTo } = this;
            const adminId = this.admin._id;

            routeTo(`/${page}?assetId=${itemid}&adminId=${adminId}`);
        },
        openwithSubject(page, itemid) {
            const { routeTo } = this;
            const adminId = this.admin._id;

            routeTo(`/${page}?subjectId=${itemid}&adminId=${adminId}`);
        },
        reloadPage() {
            window.location.reload(true)
        }
    },
    computed: {
        ...mapState({
            clients: state => state.client.clients,
            client: state => state.client.client,
            client_files: state => state.client.client_files,
            admin_token: state => state.auth.admin_token,
            admin: state => state.auth.admin,
            assets: state => state.assets.items,
            asset: state => state.assets.item,
            announcements: state => state.announcements.items,
            announcement: state => state.announcements.item,
        }),
        adminIdQuery() {
            const adminId = this.admin._id;
            return `?adminId=${adminId}`
        }
    }
}