<template>
    <div>
        <div class="walletwithdraw">

            <div class="popup" v-if="showconfirm">
                <div class="popup__body transactionstyle__body">
                    <div class="transactionstyle__subject">
                        <div class="transactionstyle__subject--name">
                            <h3>Confirm Withdrawal Details</h3>
                        </div>
                        <div class="transactionstyle__subject--closebtn">
                            <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-onkibi" aria-hidden="true">
                                <path fill="currentColor"
                                    d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z">
                                </path>
                            </svg>
                        </div>
                    </div>

                    <div class="transactionstyle__container">
                        <div class="previewtrade__contentitem">
                            <div class="previewtrade__contentitemleft">Send</div>
                            <div class="previewtrade__contentitemright">
                                <div class="previewtrade__contentitemright--top">
                                    ${{ withdrawalamount }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="transactionstyle__container">
                        <div class="previewtrade__contentitem">
                            <div class="previewtrade__contentitemleft">To</div>
                            <div class="previewtrade__contentitemright">
                                <div class="previewtrade__contentitemright--top">
                                    {{ withdrawaladdress }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="transactionstyle__btn">
                        <button class="btn colored-btn padded-btn" @click="submitrequest" v-if="!loading">Confirm
                            withdrawal</button>

                        <button class="btn colored-btn padded-btn dim" v-if="loading">
                            <span class="loader-button"></span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="content">
                <HeaderBox />

                <div class="content__body">
                    <div class="container">
                        <SideNav />

                        <div class="layout-stretch">
                            <PageIndicator :page_name="`Withdraw from ${withdrawfrom}`" :transparent="true"
                                :nobtns="true" />

                            <div class="layout-padding">
                                <div class="walletdeposit__content">
                                    <div class="walletdeposit__contentarea">

                                        <div class="balancearea">
                                            <div class="balancearea__section">
                                                <div class="balancearea__primarylabel">
                                                    <h3 class="balancearea__primarylabel--h3">Estimated Balance</h3>
                                                    <span class="balancearea__primarylabel--eyesvg">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                            fill="none" class="eye css-16vuvx8">
                                                            <path d="M12 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                                                                fill="currentColor"></path>
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                d="M6.555 6.31L1 12l5.555 5.69a7.572 7.572 0 0010.89 0L23 12l-5.555-5.69a7.572 7.572 0 00-10.89 0zM17 12a5 5 0 11-10 0 5 5 0 0110 0z"
                                                                fill="currentColor"></path>
                                                        </svg>
                                                    </span>
                                                </div>

                                                <div class="balancearea__primarybalance" v-if="btcbalance">
                                                    <p class="balancearea__primarybalance--btcvalue">{{
                                                        btcbalance.balanceInBTC }}
                                                        BTC</p>
                                                    <span class="balancearea__primarybalance--equals">≈</span>
                                                    <p class="balancearea__primarybalance--usdvalue">${{
                                                        btcbalance.balanceInDollars }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="walletdeposit__select walletdeposit__selected">
                                            <div class="walletdeposit__selectarea selected">
                                                <figure class="selected-img">
                                                    <img src="@/assets/imgs/btc.png" />
                                                </figure>
                                                <label class="selected-symbol">BTC</label>

                                                <label class="selected-name">Bitcoin</label>
                                            </div>
                                        </div>

                                        <div class="walletdeposit__selectednetwork">
                                            <div class="walletdeposit__networklist">
                                                <div class="walletdeposit__networkarea">
                                                    <label class="label">BTC</label>
                                                    <label class="name">Bitcoin Network</label>
                                                </div>
                                            </div>
                                        </div>

                                        <h2 class="walletdeposit__content--h2">Withdrawal Address</h2>

                                        <div class="swap__box">


                                            <div class="swap__boxassetarea">
                                                <div class="swap__boxassetarea--inputarea">
                                                    <input placeholder="bitcoin address" v-model="withdrawaladdress"
                                                        :class="{ inputError }" />
                                                    <span class="withdraw"></span>
                                                </div>
                                            </div>
                                        </div>

                                        <h2 class="walletdeposit__content--h2">Amount ($)</h2>

                                        <div class="swap__box">


                                            <div class="swap__boxassetarea">
                                                <div class="swap__boxassetarea--inputarea">
                                                    <input placeholder="0" v-model="withdrawalamount"
                                                        @input="validateNumberInput" :class="{ inputError }" />
                                                    <span class="withdraw"></span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flex margin-up-down">
                                            <div></div>
                                            <button class="btn padded-btn colored-btn"
                                                @click="confirmrequest">Withdraw</button>
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

export default {
    data() {
        return {
            withdrawaladdress: '',
            withdrawalamount: '',
            inputError: false,
            loading: false,
            showconfirm: false
        }
    },
    mixins: [walletMixin],
    computed: {
        withdrawfrom() {
            const { currentpath } = this;

            if (currentpath === 'fiatandspot') {
                return 'Spot wallet'
            }

            if (currentpath === 'margin') {
                return 'Margin wallet'
            }
        },
        wallettype() {
            const { currentpath } = this;

            if (currentpath === 'margin') {
                return 'margin'
            }
            if (currentpath === 'fiatandspot') {
                return 'fiat/spot'
            }
        },
        currentpath() {
            return this.$route.params.withdrawal
        },
        btcbalance() {
            const { balances, wallettype } = this;

            if (balances.length) {
                const blc = balances.find(blc => blc.wallet === wallettype);
                const assetDetails = blc.assetDetails;
                const btc = assetDetails.find(assetdtl => assetdtl.detail.coin === 'BTC')

                if (btc) {
                    return btc
                } else {
                    return null
                }
            }

            return null
        }
    },
    watch: {
        withdrawalamount() {
            const { validamount } = this;
            validamount();
        },
        withdrawaladdress() {
            this.inputError = false;
        }
    },
    methods: {
        ...mapActions('wallet', ['withdraw']),
        confirmrequest() {
            const { withdrawalamount, withdrawaladdress, assetsOwned } = this;
            const amount = parseFloat(withdrawalamount.replace(/,/g, ''));
            const address = withdrawaladdress;

            if (amount && address) {
                this.inputError = false;
                this.showconfirmtog()

                return;
            }

            this.inputError = true;
        },
        showconfirmtog() {
            this.showconfirm ? this.showconfirm = false : this.showconfirm = true;
        },
        submitrequest() {
            const { withdrawalamount, withdrawaladdress, assetsOwned, withdraw } = this;
            const amount = parseFloat(withdrawalamount.replace(/,/g, ''));
            const address = withdrawaladdress;
            const btc = assetsOwned.find(assetOwned => assetOwned.coin === 'BTC');
            const assetId = btc._id;

            if (withdrawaladdress && amount) {
                const withdrawal = {
                    assetId,
                    amount,
                    address
                }

                this.loading = true;

                withdraw(withdrawal)
                    .then(() => {
                        this.loading = false;
                        alert('withdrawal request confirmed')
                        window.location.reload();
                    })
            } else {
                this.inputError = true;
            }
        },
        validamount() {
            const { btcbalance, withdrawalamount } = this;
            const amount = parseFloat(withdrawalamount.replace(/,/g, ''));

            if (amount) {
                console.log(amount, btcbalance.balanceInDollars)
                if (amount >= btcbalance.balanceInDollars) {
                    return this.inputError = true;
                }

                return this.inputError = false;
            }

            return;
        },
        validateNumberInput() {
            const { customSplitByDot, removePeriodAndCommas } = this;
            const formattedNumber = this.withdrawalamount.replace(/[^1234567890.]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            const characters = removePeriodAndCommas(customSplitByDot(formattedNumber));

            return this.withdrawalamount = characters;
        },
        customSplitByDot(inputString) {
            const dotIndex = inputString.indexOf('.');
            if (dotIndex !== -1) {
                const firstPart = inputString.slice(0, dotIndex + 1);
                const secondPart = inputString.slice(dotIndex + 1);
                return [firstPart, secondPart];
            } else {
                return [inputString, '']; // If there's no dot, return the whole string in the first part and an empty string in the second part.
            }
        },
        removePeriodAndCommas(array) {
            const withoutPeriodAndCommas = array.map((str, index) => {
                if (index === 1) {
                    return str.replace(/[.,]/g, '');
                }

                return str;
            });

            return withoutPeriodAndCommas.join('');
        }
    }
}
</script>