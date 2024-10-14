import tradingstrategiesMixin from '@/mixins/tradingstrategies';
import subtypedataMixin from '@/mixins/subtypedata';

import { mapActions } from 'vuex';

export default {
    mixins: [tradingstrategiesMixin, subtypedataMixin],
    data() {
        return {
            name: '',
            type: '',
            subtype: '',
            capital: null,
            strategiesVisible: false,
            nameerror: false,
            capitalerror: false,
            subtypeOptions: [],
            parameters: {},
            loading: false
        }
    },
    methods: {
        ...mapActions('bot', ['createBot']),
        selectType(type) {
            this.type = type;
        },
        unselectType() {
            this.type = '';
        },
        selectSubtype(subtype, subtypeOptions) {
            this.subtype = subtype;
            this.subtypeOptions = subtypeOptions;
        },
        unSelectSubtype() {
            this.subtype = '';
            this.subtypeOptions = [];
            this.parameters = {}
        },
        showStrategies() {
            if (!this.name.length) {
                this.nameerror = true;
            }

            if (!this.capital) {
                this.capitalerror = true;
            }

            if (this.nameerror || this.capitalerror) {
                return;
            }

            this.strategiesVisible = true;
        },
        backToNameInput() {
            this.strategiesVisible = false;
        },
        genericWatchHandler(propertyName, newVal, oldVal) {
            this.parameters[`${propertyName}`] = newVal;
        },
        triggerCreateBot() {
            const { type, createBot, strategy } = this;

            if (type === 'Smart Control') {
                const smartcontrol = strategy;
                smartcontrol.parameters = {
                    automatic: true
                }

                createBot(smartcontrol)
                    .then(() => {
                        this.loading = false;
                        this.$router.go();
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }

            if (type !== 'Smart Control') {
                this.loading = true;
                createBot(strategy)
                    .then(() => {
                        this.loading = false;
                        this.$router.go();
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        }
    },
    created() {
        const properties = Object.keys(this.$data);
        const propertiesToWatch = properties.filter(property => {
            return property !== 'wallettype' &&
                property !== 'name' && property !== 'type' &&
                property !== 'subtype' &&
                property !== 'strategiesVisible' &&
                property !== 'nameerror' &&
                property !== 'capitalerror' &&
                property !== 'subtypeOptions' &&
                property !== 'parameters' &&
                property !== 'loading' &&
                property !== 'capital'
        });

        propertiesToWatch.forEach(property => {
            this.$watch(property, (newVal, oldVal) => {
                this.genericWatchHandler(property, newVal, oldVal);
            }, {
                deep: true
            });
        });
    },
    computed: {
        usdtBalance() {
            const { cryptoassets, balances } = this;

            if (cryptoassets.length && balances.length) {
                const balance = balances.find(balance => balance.wallet === 'bot trading')
                const { assetDetails } = balance;

                const usdt = cryptoassets.find(item => item.coin === 'USDT');
                const usdtBalance = assetDetails.find(assetdetail => assetdetail.base.assetdb_id === usdt._id);

                if (usdtBalance) {
                    return usdtBalance
                } else {
                    return null;
                }
            } else {
                return null;
            }
        },
        strategy() {
            const { name, type, subtype, capital, parameters } = this;

            const strategy = {
                name,
                type,
                subtype,
                capital,
                parameters
            };

            return strategy;
        }
    },
    watch: {
        name() {
            this.nameerror = false;
        },
        capital(newVal, oldVal) {
            const { usdtBalance } = this;
            const { balanceInDollars } = usdtBalance;

            if (newVal >= balanceInDollars ) {
                return this.capitalerror = true;
            } else {
                return this.capitalerror = false;
            }
        }
    }
}