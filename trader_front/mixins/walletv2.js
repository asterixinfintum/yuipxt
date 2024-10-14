import cryptologosMixin from "@/mixins/cryptologos";
import generalutilities from "@/mixins/generalutilities";

import { mapActions, mapState, mapMutations } from 'vuex';

export default {
    mixins: [cryptologosMixin, generalutilities],
    data() {
        return {
            searchInput: '',
            pageSize: 20,
            currentPage: 1,
            currentAssetcategory: 'crypto'
        }
    },
    computed: {
        ...mapState({
            walletassets: state => state.wallet.walletassets,
            wallets: state => state.wallet.wallets,
            paginator: state => state.wallet.paginator,
            assetscategory: state => state.wallet.assetscategory
        }),
        wallet() {
            const { wallets, currentpath } = this;

            if (currentpath === 'margin') {
                const wallet = wallets.find(wallet => wallet.walletType === currentpath);

                return wallet;
            }

            if (currentpath === 'fiat/spot') {
                const wallet = wallets.find(wallet => wallet.walletType === currentpath);

                return wallet;
            }

            return null
        },
        currentpath() {
            let currentpath;

            if (this.$route.query.wallet) {
                currentpath = this.$route.query.wallet;
            } else {
                currentpath = this.$route.name;
            }

            if (currentpath === 'margin') {
                return 'margin'
            } else {
                return 'fiat/spot'
            }
        },
    },
    methods: {
        ...mapActions('wallet', ['getwallets', 'getwalletsassets', 'setwalletassetscategory']),
        setCurrentPage(page) {
            const { scrollToTop } = this;
            this.currentPage = page;

            /*this.getwalletsassets({
                wallettype: this.wallet.walletType,
                assettype: this.assetscategory,
                pageSize: this.pageSize,
                currentPage: this.currentPage
            });*/

            scrollToTop();
        },
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        },
        setCurrentCategory(category) {


            console.log(category);

            this.currentAssetcategory = category;
            this.setwalletassetscategory(category);

            this.getwalletsassets({
                wallettype: this.wallet.walletType,
                assettype: this.assetscategory,
                pageSize: this.pageSize,
                currentPage: this.currentPage
            });
        },
        totalBlcUSD(wallettype) {
            const { wallets } = this;

            if (wallets.length) {
                const walletdata = wallets.find(wallet => wallet.walletType === wallettype);

                return walletdata.totalblc.totalusdblc;
            }

            return `0.00000000`
        },
        totalBlcBTC(wallettype) {
            const { wallets } = this;

            if (wallets.length) {
                const walletdata = wallets.find(wallet => wallet.walletType === wallettype);

                return walletdata.totalblc.totalbtcblc;
            }

            return `0.00000000`
        }
    }
}