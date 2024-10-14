import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            //client: state => state.auth.client,
            //client_token: state => state.auth.client_token,
            wallets: state => state.wallet.wallets,
            assets: state => state.list.assets
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
        assetsOwned() {
            const { wallet } = this;

            if (wallet) {
                return wallet.blcs;
            }

            return []
        }
    }
}