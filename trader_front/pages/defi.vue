<template>
    <div>
        <div class="defi">
            <div class="content">
                <HeaderBox />

                <div class="popup" @click.stop="toggledefipopup" v-if="contractpopup">
                    <div class="popup__body defi__popupbody">
                        <div class="defi__popuplogos">
                            <div class="defi__deficardstate--logo-img">
                                <figure class="defi__deficardstate--logo-figure">
                                    <img src="https://rawcdn.githack.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"/>
                                </figure>
                            </div>

                            <div class="defi__popuplogos--arrowright">
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg>
                            </div>

                            <div class="defi__deficardstate--logos">
                                <div class="defi__deficardstate--logo-img">
                                    <figure class="defi__deficardstate--logo-figure">
                                        <img src="https://assets.coincap.io/assets/icons/256/eth.png"/>
                                    </figure>
                                </div>
                                <div class="defi__deficardstate--logo-imgwrapper">
                                    <div class="defi__deficardstate--logo-img">
                                        <figure class="defi__deficardstate--logo-figure">
                                            <img src="https://rawcdn.githack.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"/>
                                        </figure>
                                    </div>
                                    <div class="defi__deficardstate--logo-img">
                                        <figure class="defi__deficardstate--logo-figure">
                                            <img src="https://assets.coincap.io/assets/icons/256/fox.png"/>
                                        </figure>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="defi__popupheader">
                            <h2 class="defi__popupheader--h2">Deposit ETH-FOX LP tokens to Fox Farming to earn</h2>
                            <h3 class="defi__popupheader--h3">25.43% APR</h3>
                        </div>

                        <div class="defi__popupdescription">
                            <p>Approve and stake your liquidity tokens to earn bonus FOX rewards.</p>
                            <p>The rewards you earn will accrue automatically.</p>
                        </div>

                        <div class="defi__popupbtn">
                            <button class="btn padded-btn colored-btn" @click.stop="opendepositor">Deposit USDT Now</button>
                        </div>

                    </div>
                </div>

                <div v-if="deposit">
                    <Deposit 
                        :toggleOfferCard="toggleOfferCard"
                        :toggledepositor="toggledepositor"/>
                </div>

                <div v-if="withdraw">
                    <Withdraw 
                        :toggleOfferCard="toggleOfferCard"
                        :togglewithdrawer="togglewithdrawer"/>
                </div>

                <div v-if="offercard">
                    <OfferCard 
                        :toggleOfferCard="toggleOfferCard"
                        :toggledepositor="toggledepositor"
                        :togglewithdrawer="togglewithdrawer"/>
                </div>

                <div class="content__body">
                    <div class="container">
                        <SideNav />

                        <div class="layout-stretch">
                            <PageIndicator :page_name="'Optimize Your Returns'"/>

                            <div class="defi__main layout-padding">

                                <div class="balancearea row">
                                    <div class="balancearea__section main">
                                        <div class="balancearea__primarylabel">
                                            <h3 class="balancearea__primarylabel--h3">Total Balance</h3>
                                            <span class="balancearea__primarylabel--eyesvg">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="eye css-16vuvx8"><path d="M12 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M6.555 6.31L1 12l5.555 5.69a7.572 7.572 0 0010.89 0L23 12l-5.555-5.69a7.572 7.572 0 00-10.89 0zM17 12a5 5 0 11-10 0 5 5 0 0110 0z" fill="currentColor"></path></svg>
                                            </span>
                                        </div>

                                        <div class="balancearea__primarybalance">
                                            <p class="balancearea__primarybalance--btcvalue">{{ balanceInBTC ? balanceInBTC : 0 }} BTC</p>
                                            <span class="balancearea__primarybalance--equals">≈</span>
                                            <p class="balancearea__primarybalance--usdvalue">${{ balance ? balance : 0 }}</p>
                                        </div>
                                    </div>
                                </div>

                                <AssetSearch :OptimizeYourReturns="true"/>


                                <div class="defi__deficards">

                                    <div class="defi__deficard" @click="toggleOfferCard">

                                        <div class="defi__deficardheader">
                                            <div class="defi__deficardheader--left">
                                                <figure class="deficard-img">
                                                    <img src="https://assets.coincap.io/assets/icons/256/fox.png"/>
                                                </figure>
                                                <span class="name" :style="{ 
                                                        marginLeft: contractnameDivMarginLeft(1) 
                                                    }">
                                                    <p>ETH/FOX Staking</p>
                                                </span>
                                                <span class="clientbalance">
                                                    <p>$0.00</p>
                                                </span>
                                            </div>

                                            <div class="defi__deficardheader--right">
                                                <span class="apy red">
                                                    <p>25.43% Net APY</p>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="defi__deficardlabel">
                                            <div class="defi__deficardlabel--left">
                                                <span class="contractname">V6</span>
                                            </div>

                                            <div class="defi__deficardlabel--right">
                                                <span class="right-side-area">Balance</span>
                                                <span class="right-side-area">Value</span>
                                            </div>
                                        </div>

                                        <div class="defi__deficardstate">
                                            <div class="defi__deficardstate--left">
                                                <div class="defi__deficardstate--logos">
                                                    <div class="defi__deficardstate--logo-img">
                                                        <figure class="defi__deficardstate--logo-figure">
                                                            <img src="https://assets.coincap.io/assets/icons/256/eth.png"/>
                                                        </figure>
                                                    </div>
                                                    <div class="defi__deficardstate--logo-imgwrapper">
                                                        <div class="defi__deficardstate--logo-img">
                                                            <figure class="defi__deficardstate--logo-figure">
                                                                <img src="https://rawcdn.githack.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"/>
                                                            </figure>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="defi__deficardstate--contractname"
                                                    :style="{ 
                                                        marginLeft: contractnameDivMarginLeft(2) 
                                                    }">
                                                    <span>ETH/FOX Pool</span>
                                                    <span class="green">25.43% APY</span>
                                                </div>
                                            </div>

                                            <div class="defi__deficardstate--right">
                                                <div class="right-side-area">
                                                    <span class="balance">0 UNI-V2</span>
                                                </div>
                                                <div class="defi__deficardstate--rightvalue right-side-area">
                                                    <span>$0.00</span>
                                                    <span class="red">0.00%</span>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                    <div class="defi__deficard">

                                        <div class="defi__deficardheader">
                                            <div class="defi__deficardheader--left">
                                                <figure class="deficard-img">
                                                    <img src="https://assets.coincap.io/assets/icons/256/fox.png"/>
                                                </figure>
                                                <span class="name" :style="{ 
                                                        marginLeft: contractnameDivMarginLeft(1) 
                                                    }">
                                                    <p>ETH/FOX Staking</p>
                                                </span>
                                                <span class="clientbalance">
                                                    <p>$0.00</p>
                                                </span>
                                            </div>

                                            <div class="defi__deficardheader--right">
                                                <span class="apy green">
                                                    <p>25.43% Net APY</p>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="defi__deficardlabel">
                                            <div class="defi__deficardlabel--left">
                                                <span class="contractname">V6</span>
                                            </div>

                                            <div class="defi__deficardlabel--right">
                                                <span class="right-side-area">Balance</span>
                                                <span class="right-side-area">Value</span>
                                            </div>
                                        </div>

                                        <div class="defi__deficardstate">
                                            <div class="defi__deficardstate--left">

                                                <div class="defi__deficardstate--logos">
                                                    <div class="defi__deficardstate--logo-img">
                                                        <figure class="defi__deficardstate--logo-figure">
                                                            <img src="https://assets.coincap.io/assets/icons/256/eth.png"/>
                                                        </figure>
                                                    </div>
                                                    <div class="defi__deficardstate--logo-imgwrapper">
                                                        <div class="defi__deficardstate--logo-img">
                                                            <figure class="defi__deficardstate--logo-figure">
                                                                <img src="https://rawcdn.githack.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"/>
                                                            </figure>
                                                        </div>
                                                        <div class="defi__deficardstate--logo-img">
                                                            <figure class="defi__deficardstate--logo-figure">
                                                                <img src="https://assets.coincap.io/assets/icons/256/fox.png"/>
                                                            </figure>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="defi__deficardstate--contractname" 
                                                    :style="{ 
                                                        marginLeft: contractnameDivMarginLeft(3) 
                                                    }">
                                                    <span>ETH/FOX Pools</span>
                                                    <span class="green">25.43% APY</span>
                                                </div>
                                            </div>

                                            <div class="defi__deficardstate--right">
                                                <div class="right-side-area">
                                                    <span class="balance">0 UNI-V2</span>
                                                </div>
                                                <div class="defi__deficardstate--rightvalue right-side-area">
                                                    <span>$0.00</span>
                                                    <span class="green">0.00%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="defi__deficardstate" @click="toggledefipopup">
                                            <div class="defi__deficardstate--left">
                                                <div class="defi__deficardstate--logos">
                                                    <div class="defi__deficardstate--logo-img">
                                                        <figure class="defi__deficardstate--logo-figure">
                                                            <img src="https://assets.coincap.io/assets/icons/256/eth.png"/>
                                                        </figure>
                                                    </div>
                                                    <div class="defi__deficardstate--logo-imgwrapper">
                                                        
                                                    </div>
                                                </div>

                                                <div class="defi__deficardstate--contractname"
                                                    :style="{ 
                                                        marginLeft: contractnameDivMarginLeft(1) 
                                                    }">
                                                    <span>ETH/FOX Pool</span>
                                                    <span class="red">25.43% APY</span>
                                                </div>
                                            </div>

                                            <div class="defi__deficardstate--right">
                                                <div class="right-side-area">
                                                    <span class="balance">0 UNI-V2</span>
                                                </div>
                                                <div class="defi__deficardstate--rightvalue right-side-area">
                                                    <span>$0.00</span>
                                                    <span class="green">0.00%</span>
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
        </div>
    </div>
</template>

<script>
import walletMixin from '@/mixins/wallet';
import listMixin from '@/mixins/list';

export default {
    data() {
        return {
            wallettype: "defi",
            contractpopup: false,
            deposit: false,
            transfer: true,
            withdraw: false,
            offercard: false
        }
    },
    methods: {
        contractnameDivMarginLeft(numberoflogos) {
           const marginLeft = 1;
           return `${marginLeft*numberoflogos}rem`
        },
        toggleOfferCard() {
            this.offercard ? this.offercard = false : this.offercard = true;
            this.deposit = false;
            this.withdraw = false;
        },
        toggledefipopup() {
            this.defipopup ? this.defipopup = false : this.defipopup = true;
        },
        toggledepositor() {
            this.deposit ? this.deposit = false : this.deposit = true;
            this.offercard = false;
        },
        togglewithdrawer() {
            this.withdraw ? this.withdraw = false : this.withdraw = true;
            this.offercard = false;
        }
    },
    mixins: [walletMixin, listMixin]
}
</script>

<style lang="scss" scoped>
.defi {

    &__deficard {
        border-radius: #{scaleValue(10)};
        border: $border;
        background: rgba($primary-color, .03);
        margin-bottom: #{scaleValue(25)};
        cursor: pointer;
    }

    &__deficardheader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: $border;
        padding: #{scaleValue(20)} #{scaleValue(25)};

        &--left {
            display: flex;
            align-items: center;

            & span {
                display: flex;
                align-items: center;

                &.name {
                    font-size: #{scaleValue(16)};
                    font-weight: 600;
                    margin-right: #{scaleValue(10)};
                }

                &.clientbalance {
                    font-size: #{scaleValue(15)};
                    transform: translateY(#{scaleValue(2)});
                }
            }
        }

        &--right {
            display: flex;
            align-items: center;

            & span {

                &.apy {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: #{scaleValue(6)} #{scaleValue(8)};
                    
                    font-size: #{scaleValue(13)};
                    border-radius: #{scaleValue(6)};

                    &.red {
                        color: $red;
                        background: rgba($red, .2);
                    }

                    &.green {
                        color: $green;
                        background: rgba($green, .2);
                    }
                }
            }
        }
    }

    &__deficardlabel {
        display: flex;
        justify-content: space-between;
        border-bottom: $border;
        padding: #{scaleValue(10)} #{scaleValue(25)};
        font-size: #{scaleValue(12)};

        opacity: .5;
        font-weight: 500;
        text-transform: uppercase;

        &--right {
            display: flex;
        }
    }

    &__deficardstate {
        display: flex;
        justify-content: space-between;
        padding: #{scaleValue(20)} #{scaleValue(25)};
        position: relative;
        cursor: pointer;
        transition: all .4s ease;

        &:hover {
            background: rgba($primary-color, .1);
        }

        &--logos {
            display: flex;
        }

        &--logo-img {
            display: flex;
            align-items: center;
        }

        &--logo-imgwrapper {
            display: flex;
            transform: translateX(#{scaleValue(-30)});

            position: relative;
            & .defi__deficardstate--logo-img {
                position: absolute;
                top: 0;
                left: 0;
                @include translate-each;
            }
        }

        &--logo-figure {
            height: #{scaleValue(30)};
            width: #{scaleValue(30)};
            overflow: hidden;
            border-radius: 100%;

            & img {
                object-fit: cover;
                height: #{scaleValue(30)};
                width: #{scaleValue(30)};
            }
        }

        &--left {
            display: flex;
            align-items: center;
        }

        &--contractname {
            display: flex;
            flex-direction: column;

            & span {
                display: inline-block;

                &:nth-child(1) {
                    font-size: #{scaleValue(15)};
                }

                &:nth-child(2) {
                    font-size: #{scaleValue(12)};
                    margin-top: #{scaleValue(1)};

                    &.red {
                        color: $red;
                    }

                    &.green {
                        color: $success
                    }
                }
            }
        }

        &--right {
            display: flex;
            align-items: center;

            & span {

                &.balance {
                    color: rgba($light-font-color, .6);
                    font-size: #{scaleValue(13)};
                }
            }
        }

        &--rightvalue {
            display: flex;
            flex-direction: column;

            & span {

                &:nth-child(1) {
                    font-size: #{scaleValue(15)};
                    color: rgba($light-font-color, .6);
                    font-weight: 500;
                }

                &:nth-child(2) {
                    font-size: #{scaleValue(12)};
                    margin-top: #{scaleValue(3)};

                    &.red {
                        color: $red;
                    }

                    &.green {
                        color: $green;
                    }
                }
            }
        }
    }

    &__popupbody {
        background: rgba($defipopup-body, 1)
    }

    &__popuplogos {
        display: flex;
        align-items: center;
        width: #{scaleValue(300)};
        justify-content: center;

        &--arrowright {
           margin: 0 #{scaleValue(12)};

           & svg {
                width: #{scaleValue(12)};
                height: #{scaleValue(12)};
           }
        }
    }

    &__popupheader {
        text-align: center;
        margin-top: #{scaleValue(12)};

        &--h2 {
            font-size: #{scaleValue(14.5)};
            font-weight: 500;
        }

        &--h3 {
            color: $green;
            font-size: #{scaleValue(15)};
            font-weight: 500;
            margin-top: #{scaleValue(12)};
        }
    }

    &__popupdescription {
        text-align: center;

        & p {
            margin-top: #{scaleValue(30)};
            font-size: #{scaleValue(15)};
            
        }
    }

    &__popupbtn {
        margin-top: #{scaleValue(40)};
        width: 100%;

        & button {
            width: 100%;
            font-size: #{scaleValue(15.5)};
        }
    }
}

.deficard-img {
    height: #{scaleValue(30)};
    width: #{scaleValue(30)};
    overflow: hidden;
    border-radius: 100%;

    & figure {

    }

    & img {
        object-fit: cover;
        height: #{scaleValue(30)};
        width: #{scaleValue(30)};
    }
}

.right-side-area {
    display: flex;
    width: #{scaleValue(230)};
    text-align: left;
}
</style>