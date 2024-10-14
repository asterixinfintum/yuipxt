import { mapActions, mapState, mapMutations } from 'vuex';

import walletMixin from './wallet';
import TransactionpopupMixin from './transactionpopup';
import listMixin from '@/mixins/list';
import globalMixin from '@/mixins/global';

export default {
    data() {
        return {
            fromInput: '',
            toInput: '',
            walletCategory: "fiat/spot",
            walletCategoriesOpen: false,
            assetCategoriesOpen: false,
            currentAssetFrom: null,
            currentAssetTo: null,
            swapDirection: 'from',
            assetCategoryFrom: 'crypto',
            assetCategoryTo: 'crypto',
            fromAssetBalance: 0,
            toAssetBalance: 0,
            fromAssetBalanceInUSD: 0,
            toAssetBalanceInUSD: 0,
            transactionFee: 0,
            transactionTotal: 0,
            inputError: false,
            transactionType: 'conversion',

            youpayval: 0,
            yougetval: 0
        }
    },
    mixins: [walletMixin, TransactionpopupMixin, listMixin, globalMixin],
    mounted() {
        this.selectWallet('fiat/spot')
    },
    computed: {
        ...mapState({
            allpairs: state => state.trade.allpairs,
            cryptopairs: state => state.trade.cryptopairs,
            stockpairs: state => state.trade.stockpairs,
            commoditiespairs: state => state.trade.commoditiespairs,
        }),
        transactionDescription() {
            const { fromInput, toInput, currentAssetFrom, currentAssetTo, walletCategory } = this;

            if (currentAssetFrom && currentAssetTo && !isNaN(parseFloat(fromInput))) {
                const description = `converted ${parseFloat(fromInput)} ${currentAssetFrom._id} to ${parseFloat(toInput)} ${currentAssetTo._id} in ${walletCategory} wallet`;

                return description
            }

            return '';
        },
        enablePreviewBtn() {
            const { fromInput, toInput, inputError, currentAssetFrom, currentAssetTo } = this;

            if (currentAssetFrom._id === currentAssetTo._id) {
                return false;
            }

            if (!isNaN(parseFloat(fromInput)) && !isNaN(parseFloat(toInput))) {

                if (parseFloat(fromInput) > 0 && parseFloat(fromInput) > 0 && !inputError) {
                    return true
                }
            }

            return false;
        },
        conversiontotal() {
            const { fromInput, youpayval, transactionFee } = this;

            if (fromInput && transactionFee && youpayval) {
                return parseFloat(youpayval) + parseFloat(transactionFee);
            }

            return 0;
        }
    },
    watch: {
        fromInput() {
            const { youPayUSD, currentAssetTo, calculatePercentage } = this;
            this.youpayval = youPayUSD();
            this.toInput = youPayUSD() / parseFloat(currentAssetTo.price);
            this.yougetval = (parseFloat(this.toInput) * parseFloat(currentAssetTo.price)).toFixed(5);
            this.transactionFee = calculatePercentage(this.yougetval, 5);
            this.inputError = false;

            this.checkBlcOfAsstinWllt();
        },
        currentAssetFrom() {
            this.fromInput = '';
            this.toInput = '';
            this.inputError = false;
        },
        currentAssetTo() {
            this.fromInput = '';
            this.toInput = '';
            this.inputError = false;
        },
        walletCategory() {
            this.fromInput = '';
            this.inputError = false;
        }
    },
    methods: {
        ...mapActions('trade', ['getallpairs']),
        youPayUSD() {
            const { currentAssetFrom, fromInput } = this;

            if (fromInput.length && currentAssetFrom) {
                const fromInpt = this.convertToFloat(fromInput);

                if (fromInpt) {
                    const currasspric = parseFloat(currentAssetFrom.price);

                    return (fromInpt * currasspric).toFixed(5)
                }
            }

            return 0;
        },
        youGetUSD() {
            const { currentAssetTo, toInput } = this;

            if (toInput.length && currentAssetTo) {
                const toInpt = parseFloat(toInput);

                if (toInpt) {
                    const currasspric = parseFloat(currentAssetTo.price);
                    return (toInpt * currasspric).toFixed(6)
                }
            }

            return 0;
        },
        toggleWalletCat() {
            this.walletCategoriesOpen ? this.walletCategoriesOpen = false : this.walletCategoriesOpen = true
        },
        toggleCryptoCat() {
            this.assetCategoriesOpen ? this.assetCategoriesOpen = false : this.assetCategoriesOpen = true
        },
        setCurrentAsset(asset) {
            const { toggleCryptoCat, clearInput, setAssetCategory } = this;

            if (this.swapDirection === 'from') {
                this.currentAssetFrom = asset
            }

            if (this.swapDirection === 'to') {
                this.currentAssetTo = asset
            }

            if (asset.assetType) {
                const { assetType } = asset;
                setAssetCategory(assetType);
            } else {
                setAssetCategory('crypto');
            }

            toggleCryptoCat();
            clearInput();
        },
        setandreturnFromAsset(asset) {
            this.currentAssetFrom = asset;
            return this.currentAssetFrom;
        },
        setandreturnToAsset(asset) {
            this.currentAssetTo = asset;
            return this.currentAssetTo;
        },
        setSwapDirection(direction) {
            this.swapDirection = direction;
            this.assetCategoriesOpen = true;
        },
        selectWallet(wallet) {
            this.$router.push({ path: '/swap', query: { wallet } })
            this.walletCategory = wallet;
            this.walletCategoriesOpen = false;
        },
        setAssetCategory(category) {
            if (this.swapDirection === 'from') {
                this.assetCategoryFrom = category
            }

            if (this.swapDirection === 'to') {
                this.assetCategoryTo = category
            }
        },
        checkBlcOfAsstinWllt() {
            const { assetblcUSD, currentAssetFrom, conversiontotal } = this;

            if (this.fromInput === "") {
                return;
            }

            if (currentAssetFrom) {

                if (assetblcUSD(currentAssetFrom) > conversiontotal && conversiontotal !== 0) {
                    this.inputError = false;
                } else {
                    this.inputError = true;
                }
            } else {
                return this.inputError = true;
            }
        },
        calculatePercentage(input, percentage) {
            return (input * (percentage / 100));
        },
        setfromInputToMax() {
            const { assetblc, currentAssetFrom, calculatePercentage } = this;
            const maxbalance = parseFloat(assetblc(currentAssetFrom))
            const percentageval = calculatePercentage(maxbalance, 5)
            const max = (maxbalance - percentageval).toFixed(5)

            this.fromInput = max;
        },
        previewTrade() {
            if (!this.inputError) {
                this.toggleconfirmTrade();
            }
        }
    }
}