<template>
    <div>
        <div class="tradingbots">
            <div class="content">
                <HeaderBox />

                <div class="content__body">
                    <div class="container">
                        <SideNav />

                        <div class="layout-stretch">
                            <PageIndicator :page_name="'Trading Bots'" />

                            <div class="tradingbots__main layout-padding">
                                <TradingBotCopyPopup :action="create_bot" :text="`This account has not been activated, 
                                            please go to the Rebalancing Bot strategy 
                                            trading page to create a strategy to activate the 
                                            account.`" />

                                <div v-if="viewbot && tradingbot && tradingbotStrategies.length">
                                    <BotDetails :tradingbot="tradingbot" :toggleviewbot="toggleviewbot"/>
                                </div>

                                <div class="balancearea row">
                                    <div class="balancearea__section main">
                                        <div class="balancearea__primarylabel">
                                            <h3 class="balancearea__primarylabel--h3">Estimated Balance</h3>
                                            <span class="balancearea__primarylabel--eyesvg">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                    class="eye css-16vuvx8">
                                                    <path d="M12 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" fill="currentColor">
                                                    </path>
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M6.555 6.31L1 12l5.555 5.69a7.572 7.572 0 0010.89 0L23 12l-5.555-5.69a7.572 7.572 0 00-10.89 0zM17 12a5 5 0 11-10 0 5 5 0 0110 0z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </span>
                                        </div>

                                        <div class="balancearea__primarybalance">
                                            <p class="balancearea__primarybalance--btcvalue">{{ balanceInBTC ? balanceInBTC
                                                : 0 }} BTC</p>
                                            <span class="balancearea__primarybalance--equals">≈</span>
                                            <p class="balancearea__primarybalance--usdvalue">${{ balance ? balance : 0 }}
                                            </p>
                                        </div>
                                    </div>

                                </div>

                                <AssetSearch :create_bot="create_bot" :toggleviewbots="toggleviewbots"
                                    :viewbots="viewbots" />

                                <div class="assetlistheader" v-if="!viewbots">
                                    <div class="assetlistheader__item fiatandspot">
                                        <label class="assetlistheader__item--label">Asset</label>
                                        <div class="assetlistheader__item--arrows">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                    class="css-1c0zcq0">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5zm6.5 6.303V13.5h-6.5v1.652l3.25 3.5 3.25-3.5z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="assetlistheader__item fiatandspot">
                                        <label class="assetlistheader__item--label">Asset balance</label>
                                        <div class="assetlistheader__item--arrows">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                    class="css-1c0zcq0">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5zm6.5 6.303V13.5h-6.5v1.652l3.25 3.5 3.25-3.5z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="assetlistheader__item fiatandspot">
                                        <label class="assetlistheader__item--label">Balance in USD</label>
                                        <div class="assetlistheader__item--arrows">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                    class="css-1c0zcq0">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5zm6.5 6.303V13.5h-6.5v1.652l3.25 3.5 3.25-3.5z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="assetlistheader__item fiatandspot">
                                        <label class="assetlistheader__item--label">Balance in BTC</label>
                                        <div class="assetlistheader__item--arrows">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                    class="css-1c0zcq0">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5zm6.5 6.303V13.5h-6.5v1.652l3.25 3.5 3.25-3.5z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="assetlistheader__item fiatandspot">
                                        <label class="assetlistheader__item--label">Available</label>
                                        <div class="assetlistheader__item--arrows">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                    class="css-1c0zcq0">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5zm6.5 6.303V13.5h-6.5v1.652l3.25 3.5 3.25-3.5z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="assetlistheader__item fiatandspot">
                                        <label class="assetlistheader__item--label">Action</label>
                                    </div>
                                </div>

                                <div class="assetlist" v-if="!viewbots">
                                    <div class="assetlist__item fiatandspot"
                                        v-for="cryptoasset in listByPages[currentPage - 1]"
                                        @click.stop="navigateToPageWithParams('trade', cryptoasset._id)">

                                        <div class="assetlist__area fiatandspot">
                                            <figure class="assetlist__area--assetlogo">
                                                <img src="https://assets.coincap.io/assets/icons/256/btc.png" />
                                            </figure>
                                            <div class="assetlist__area--asset">
                                                <span class="assetlist__area--assetsymbol">{{ cryptoasset.coin }}</span>
                                                <span class="assetlist__area--assetname">{{
                                                    limitTextLength(cryptoasset.name, 9) }}</span>
                                            </div>
                                        </div>

                                        <div class="assetlist__area fiatandspot number-value">
                                            <p>
                                                {{
                                                    returnAssetBalanceOBJ(cryptoasset) ?
                                                    limitTextLength(`${returnAssetBalanceOBJ(cryptoasset).base.balanceinWallet}`,
                                                        10) :
                                                    `0.00000000`
                                                }}
                                            </p>
                                        </div>

                                        <div class="assetlist__area fiatandspot number-value">
                                            <p>
                                                {{
                                                    returnAssetBalanceOBJ(cryptoasset) ?
                                                    limitTextLength(`${returnAssetBalanceOBJ(cryptoasset).balanceInDollars}`,
                                                        10) :
                                                    `0.00000000`
                                                }}
                                            </p>
                                        </div>

                                        <div class="assetlist__area fiatandspot number-value">
                                            <p>
                                                {{
                                                    returnAssetBalanceOBJ(cryptoasset) ?
                                                    limitTextLength(`${returnAssetBalanceOBJ(cryptoasset).balanceInBTC}`, 10) :
                                                    `0.00000000`
                                                }}
                                            </p>
                                        </div>

                                        <div class="assetlist__area fiatandspot number-value">
                                            <p>
                                                {{
                                                    returnAssetBalanceOBJ(cryptoasset) ?
                                                    limitTextLength(`${returnAssetBalanceOBJ(cryptoasset).base.balanceinWallet}`,
                                                        10) :
                                                    `0.00000000`
                                                }}
                                            </p>
                                        </div>


                                        <div class="assetlist__area fiatandspot assetlist__areabtns">
                                            <button class="btn color-primary">Deposit</button>
                                            <button class="btn color-primary">Withdraw</button>
                                            <button class="btn color-primary"
                                                @click.stop="navigateToPageWithParams('trade', cryptoasset._id)">Trade</button>
                                            <button class="btn color-primary">Earn</button>
                                            <button class="btn color-primary">Convert</button>
                                        </div>
                                    </div>
                                </div>

                                <div class="assetlist__navigation" v-if="!viewbots">
                                    <span @click="reduPage" class="assetlist__navigation--prev" :class="{
                                        visible: currentPage > 1,
                                        notvisible: currentPage === 1
                                    }">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                            class="css-3kwgah">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M11.934 12l3.89 3.89-1.769 1.767L8.398 12l1.768-1.768 3.89-3.889 1.767 1.768-3.889 3.89z"
                                                fill="currentColor"></path>
                                        </svg>
                                    </span>
                                    <span v-if="currentPage >= 5" @click="setCurrentPage(1)">1</span>
                                    <span v-if="currentPage >= 5">...</span>
                                    <span v-for="(arrItem, index) in listByPages" @click="setCurrentPage((index + 1))"
                                        :class="{
                                            current: currentPage === (index + 1),
                                            notvisible: (index + 1) > (currentPage + 4) || (index + 1) < (currentPage - 3)
                                        }">{{ index + 1 }}</span>
                                    <span v-if="listByPages.length >= 6 && currentPage <= listByPages.length - 5">...</span>
                                    <span v-if="listByPages.length >= 6 && currentPage <= listByPages.length - 5"
                                        @click="setCurrentPage(listByPages.length)">{{ listByPages.length }}</span>
                                    <span @click="incrPage" class="assetlist__navigation--next" :class="{
                                        visible: currentPage >= 1,
                                        notvisible: currentPage === listByPages.length
                                    }">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                            class="css-3kwgah">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M12.288 12l-3.89 3.89 1.768 1.767L15.823 12l-1.768-1.768-3.889-3.889-1.768 1.768 3.89 3.89z"
                                                fill="currentColor"></path>
                                        </svg>
                                    </span>
                                </div>


                                <div class="assetlistheader" v-if="viewbots">

                                    <div class="assetlistheader__item fiatandspot">
                                        <label class="assetlistheader__item--label">Name/Strategy</label>
                                        <div class="assetlistheader__item--arrows">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                    class="css-1c0zcq0">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5zm6.5 6.303V13.5h-6.5v1.652l3.25 3.5 3.25-3.5z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="assetlistheader__item fiatandspot">
                                        <label class="assetlistheader__item--label">Initial Capital</label>
                                        <div class="assetlistheader__item--arrows">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                    class="css-1c0zcq0">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5zm6.5 6.303V13.5h-6.5v1.652l3.25 3.5 3.25-3.5z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="assetlistheader__item fiatandspot">
                                        <label class="assetlistheader__item--label">Balance in USD</label>
                                        <div class="assetlistheader__item--arrows">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                    class="css-1c0zcq0">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5zm6.5 6.303V13.5h-6.5v1.652l3.25 3.5 3.25-3.5z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="assetlistheader__item fiatandspot">
                                        <label class="assetlistheader__item--label">Balance in BTC</label>
                                        <div class="assetlistheader__item--arrows">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                    class="css-1c0zcq0">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5zm6.5 6.303V13.5h-6.5v1.652l3.25 3.5 3.25-3.5z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="assetlistheader__item fiatandspot">
                                        <label class="assetlistheader__item--label">24h Gain</label>
                                        <div class="assetlistheader__item--arrows">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                    class="css-1c0zcq0">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5zm6.5 6.303V13.5h-6.5v1.652l3.25 3.5 3.25-3.5z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="assetlistheader__item fiatandspot">
                                        <label class="assetlistheader__item--label">24h Loss</label>
                                        <div class="assetlistheader__item--arrows">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                    class="css-1c0zcq0">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5zm6.5 6.303V13.5h-6.5v1.652l3.25 3.5 3.25-3.5z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="assetlistheader__item fiatandspot">
                                        <label class="assetlistheader__item--label">Action</label>
                                    </div>
                                </div>

                                <div class="assetlist" v-if="viewbots">
                                    <div class="assetlist__item fiatandspot"
                                        v-for="tradingbotStrategy in tradingbotStrategies">

                                        <div class="assetlist__area fiatandspot">
                                            <div class="assetlist__area--asset">
                                                <span class="assetlist__area--assetsymbol">{{ tradingbotStrategy.name}}</span>
                                                <span class="assetlist__area--assetname primary-colored">{{ tradingbotStrategy.type }}</span>
                                            </div>
                                        </div>

                                        <div class="assetlist__area fiatandspot">
                                            <div class="assetlist__area--asset">
                                                <span class="assetlist__area--assetsymbol">${{ tradingbotStrategy.capital}}</span>
                                            </div>
                                        </div>

                                        <div class="assetlist__area fiatandspot">
                                            <div class="assetlist__area--asset">
                                                <span class="assetlist__area--assetsymbol">$200</span>
                                            </div>
                                        </div>

                                        <div class="assetlist__area fiatandspot">
                                            <div class="assetlist__area--asset">
                                                <span class="assetlist__area--assetsymbol">$200</span>
                                            </div>
                                        </div>

                                        <div class="assetlist__area fiatandspot">
                                            <div class="assetlist__area--asset">
                                                <span class="assetlist__area--assetsymbol">${{ tradingbotStrategy.profit }}</span>
                                                <div class="assetlist__area--assetpercent up">
                                                    <span>3%</span>
                                                    <span class="up">{{'<-'}}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="assetlist__area fiatandspot">
                                            <div class="assetlist__area--asset">
                                                <span class="assetlist__area--assetsymbol">${{ tradingbotStrategy.loss }}</span>
                                                <div class="assetlist__area--assetpercent down">
                                                    <span>3%</span>
                                                    <span class="down">{{'<-'}}</span>
                                                </div>
                                            </div>
                                        </div>


                                        <div class="assetlist__area fiatandspot assetlist__areabtns">
                                            <button class="btn color-primary" @click.stop="toggleviewbot(tradingbotStrategy)">Details</button>
                                            <button class="btn color-primary">Withdraw</button>
                                            <button class="btn color-primary" @click.stop="triggerCloseBot(tradingbotStrategy._id)">Close</button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

import walletMixin from '@/mixins/wallet';
import listMixin from '@/mixins/list';
import generalutilities from '@/mixins/generalutilities.js';

export default {
    data() {
        return {
            wallettype: "bot trading",
            viewbots: true,
            viewbot: false,
            tradingbot: null,
            closeBotWarning: false
        }
    },
    mixins: [generalutilities, walletMixin, listMixin],
    methods: {
        ...mapActions('bot', ['getBots', 'closeBot']),
        create_bot() {
            this.$router.push('/createbot');
        },
        toggleviewbots() {
            this.viewbots ? this.viewbots = false : this.viewbots = true;
        },
        toggleviewbot(bot) {
            const { viewbot, tradingbot } = this;

            if (!viewbot && !tradingbot) {
                this.tradingbot = bot;
                this.viewbot = true;
            } else {
                this.viewbot = false;
                this.tradingbot = null
            }
        },
        triggerCloseBot(botid) {
            /*const { closeBot } = this;

            closeBot(botid);*/
            this.closeBotWarning = true;
        }
    },
    mounted() {
        const { getBots } = this;

        getBots();
    },
    computed: {
        ...mapState({
            tradingbotStrategies: state => state.bot.tradingbots
        })
    }
}
</script>