import clientMixin from '@/mixins/client';

import TransferEventBus from '~/plugins/event-transfer';

export default {
    data() {
        return {
            transfer: false,
            withdrawalmodalopen: false
        }
    },
    props: ['page_name', 'nobtns', 'transparent', 'showdepositbtn', 'showwithdrawbtn'],
    mixins: [clientMixin],
    methods: {
        showwithdrawalmodal() {
            this.withdrawalmodalopen = true;
        },
        hidewithdrawalmodal() {
            this.withdrawalmodalopen = false;
        },
        toggleTransferPanel() {
            this.transfer ? this.transfer = false : this.transfer = true;
        },
        openTransferPanel() {
            TransferEventBus.$emit('toggle-transfer-panel');
        }
    },
    created() {
        TransferEventBus.$on('toggle-transfer-panel', this.toggleTransferPanel);
    },
    beforeDestroy() {
        TransferEventBus.$off('toggle-transfer-panel', this.toggleTransferPanel);
    },
    computed: {
        currentpage() {
            return this.$route.name;
        }
    }
}