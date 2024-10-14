import { mapActions, mapState } from 'vuex';

import BASE_VARS from '@/store/base_vars';

const { VERIFICATION_FRONT } = BASE_VARS;

export default {
    data() {
        return {
            popupopen: true
        }
    },
    methods: {
        formatDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleString('en-US', { month: 'long', day: 'numeric' });
        },
        navigateToPage(page, id) {
            this.$router.push(`/${page}`)
        },
        navigateToPageWithParams(path, item_param) {
            this.$router.push(`/${path}/${item_param}`);
        },
        navigateOutWithParams(item_url, item_param) {
            const url = `${item_url}/?token=${item_param}`;
            console.log(url);

            window.open(url, '_blank');
        },
        navigateToTradePage(path, item_id) {
            this.$router.push(`/${path}&asset=${item_id}`)
        },
        popupAction(action) {
            if (typeof action === 'function') {
                action();
            }

            this.popupopen ? this.popupopen = false : this.popupopen = true;
        },
        limitTextLength(text, maxLength) {
            if (text.length <= maxLength) {
                return text;
            } else {
                return text.substring(0, maxLength) + '...';
            }
        },
        openInNewTab(url) {
            window.open(url, '_blank').focus();
        },
        formatNumberCommas(number, decimalPlaces = 0) {
            if (typeof number !== 'number' || isNaN(number)) {
                return 'Invalid number';
            }

            const options = {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
            };

            return number.toLocaleString(undefined, options);
        },
        formatNumberCommasMoreDecims(number, decimalPlaces = 8) {
            if (typeof number !== 'number' || isNaN(number)) {
                return 'Invalid number';
            }

            const options = {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
            };

            return number.toLocaleString(undefined, options);
        },
        formatNumber(number) {
            return this.formatNumberCommas(parseInt(number, 10));
        },
        /*returnCryptoLogo(symbol) {
            const { base_url, cryptoLogos } = this;
            const logo = cryptoLogos.find(cryptoLogo => cryptoLogo.toLowerCase().includes(symbol.toLowerCase()));
            return `${base_url}/${logo}`;
        }*/
    },
    computed: {
        currentRoute: function () {
            return this.$route.name
        },
        ...mapState({
            client_token: state => state.auth.client_token,
            key_token: state => state.auth.key_token
        }),
    }
}