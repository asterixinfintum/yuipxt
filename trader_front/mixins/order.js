import { mapActions, mapState, mapMutations } from 'vuex';

import tradeMixin from '@/mixins/trade';
import generalutilities from '@/mixins/generalutilities';
import walletMixin from './wallet';
import globalMixin from '@/mixins/global';

import createorderMixin from '@/mixins/createorder';
import marketorderMixin from '@/mixins/marketorder';
import autotradeorderMixin from '@/mixins/autotradeorder';
import limitorderMixin from '@/mixins/limitorder';
import stoplimitorderMixin from '@/mixins/stoplimit';

export default {
    props: [
        'asset',
        'orderType',
        'fundaccount_popup_toggle',
        'openFundAccountPopup',
        'margin',
        'currentpair'
    ],
    mixins: [
        tradeMixin,
        generalutilities,
        walletMixin,
        globalMixin,
        marketorderMixin,
        createorderMixin,
        autotradeorderMixin,
        limitorderMixin,
        stoplimitorderMixin
    ],
    data() {
        return {
            tradingPair: '',
            type: '',
            side: '',
            quantity: 0,
            buy_quantity: null,
            sell_quantity: null,
            price: 0,
            timeInForce: '',
            expiresAt: null,
            status: '',
            stopLossPrice: null,
            takeProfitPrice: null,
            trailingStopDistance: null,
            scaleOutQuantity: null,
            orderAmount: 0,
            filled: 0,
            cancelAll: false,
            triggerConditions: [],
            sellError: false,
            buyError: false,
            optimalPrice: 'Optimal price',
            triggerpricebuy: '',
            triggerpricesell: '',
            orderDetailsOpen: false,
            order: {},
            submittingOrder: false,
            strategiesOpen: false,
            tradeCapitalLimit: 100,
            autoTradeDetails: {},
            errorMessage: null,
            successMessage: null,
            loading: false,
            orderdetails: null,
            tradepercentage: 5
        }
    },
    computed: {
        ...mapState({
            assets: state => state.list.assets,
            autotradestrategies: state => state.order.autotradestrategies
        }),
        autoTrade() {
            const autotrade = this.$route.query.autotrader;

            return autotrade;
        },
        wallettype() {
            const wallettype = this.$route.query.wallet;
            if (wallettype === 'margin') {
                return 'margin'
            }
            if (wallettype === 'spot') {
                return 'fiat/spot'
            }
        },
        currentTradingWallet() {
            return this.$route.query.wallet;
        },
        priceOfUsdt() {
            const { assets } = this;

            const priceOfUsdt = assets.find(asset => asset.coin === 'USDT');
            return priceOfUsdt.price;
        },
        assetOnRightSideOfOrderPair() {
            const { assets, currentpair } = this;

            if (assets.length && currentpair) {
                // Extract the symbol on the left side of '/'
                const leftSymbol = currentpair.pair.split('/')[1].toLowerCase();

                // Filter the assets array to find the asset matching the leftSymbol
                const assetOnLeftSideOfOrderPair = assets.find(asset => asset.coin.toLowerCase() === leftSymbol);
                return assetOnLeftSideOfOrderPair;
            }

            return {}
        },
        orderdetailspreview() {
            const { orderdetails } = this;
            const details = []

            if (orderdetails) {
                for (let [key, value] of Object.entries(orderdetails)) {
                    details.push(key)
                }

                return details;
            } else {
                return []
            }
        }
    },
    methods: {
        ...mapMutations('order', ['SET_AUTOTRADESTRATEGIES']),
        ...mapActions('order', [
            'createMktOrder',
            'createLmtOrder',
            'createStpLmtOrder',
            'createAutoTrade'
        ]),
        ...mapActions('wallet', ['getwallets']),
        ...mapActions('order', ['getorders', 'getautotrades', 'gettrades']),
        toDecimal(num) {
            if (num >= 1 && num <= 100) {
                return num / 100;
            }
        },
        calltradecreation() {
            const {
                createbuymarketorder,
                createsellmarketorder,
                createlimitbuyorder,
                createlimitsellorder,
                createstopbuyorder,
                createstopsellorder,
                createautotradeorder,
                orderType,
                orderdetails
            } = this;

            const { side } = orderdetails;

            if (this.autoTrade === 'true') {
                return createautotradeorder();
            }

            if (orderType === 'market') {
                side === 'buy' ? createbuymarketorder() : createsellmarketorder();
            }

            if (orderType === 'limit') {
                side === 'buy' ? createlimitbuyorder() : createlimitsellorder();
            }

            if (orderType === 'stop limit') {
                side === 'buy' ? createstopbuyorder() : createstopsellorder();
            }
        },
        assetblc(asst) {
            const { wallets, wallettype } = this;

            if (wallets.length) {
                const wallet = wallets.find(wallet => wallet.walletType === wallettype);
                const walletblcs = wallet.blcs;

                const assetblc = walletblcs.filter(walletblc => {
                    if (asst._id === walletblc.assetid) {
                        return {
                            blc: walletblc.blc.balance,
                            usdblc: (parseFloat(`${walletblc.blc.balance}`.replace(/,/g, '')) * parseFloat(`${walletblc.asset.price}`.replace(/,/g, '')))
                        }
                    }
                });

                if (assetblc.length) {
                    const blcdtls = {
                        blc: assetblc[0].blc.balance,
                        usdblc: (parseFloat(`${assetblc[0].blc.balance}`.replace(/,/g, '')) * parseFloat(`${assetblc[0].asset.price}`.replace(/,/g, '')))
                    }

                    return blcdtls;
                } else {
                    return {
                        blc: '0',
                        usdblc: '0'
                    }
                }
            } else {
                return {
                    blc: '0',
                    usdblc: '0'
                }
            }
        },
        showorderdetails(details) {
            this.orderdetails = details
        },
        hideorderdetails() {
            this.orderdetails = null
        },
        togglestrategiesState() {
            this.strategiesOpen ? this.strategiesOpen = false : this.strategiesOpen = true;
        },
        closeError() {
            this.errorMessage = null
        },
        closeSuccess() {
            this.successMessage = null;
        },
        getRandomMillisecs() {
            return Math.floor(Math.random() * 114000) + 6000;
        },
        toggleSliderPercentage(percentage, assetBalance, side) {
            const { asset } = this;
            const amount = (assetBalance * percentage);
            const quantity = amount / asset.price;

            return {
                amount,
                quantity
            }
        }
    }
}