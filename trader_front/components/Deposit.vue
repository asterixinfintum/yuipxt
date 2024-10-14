<template>
    <div class="popup">
        <div class="transactionstyle">
            <div class="popup__body transactionstyle__body">

                <div class="transactionstyle__subject">
                    <div class="transactionstyle__subject--backbtn" @click="toggleOfferCard">
                        <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-onkibi" aria-hidden="true"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
                    </div>
                    <div class="transactionstyle__subject--name">
                        <h3>Deposit Into USDC Vault</h3>
                    </div>
                    <div class="transactionstyle__subject--closebtn" @click="toggledepositor">
                        <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-onkibi" aria-hidden="true"><path fill="currentColor" d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"></path></svg>
                    </div>
                </div>

                <div class="transactionstyle__container">

                    <div class="transactionstyle__info">
                        <div class="transactionstyle__info--header">
                            <span>Deposit Info</span>
                        </div>
                        <div class="transactionstyle__info--text">
                            <p>Enter the amount of USDC you would like to deposit.</p>
                        </div>
                    </div>

                    <h3 class="transactionstyle__amounttodep">
                        Amount to Deposit
                    </h3>


                    <div class="transactionstyle__inputbox">
                        <div class="transactionstyle__inputboxarea">
                            <div class="transactionstyle__inputboxarea--section center-align reserveasset-label-area">
                                <figure class="reserveassetlogo">
                                    <img src="https://rawcdn.githack.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"/>
                                </figure>
                                <span class="reserveassetlabel">USDT</span>
                            </div>

                            <div class="transactionstyle__inputboxarea--section flex-direction-column flex-end-column">
                                <div class="transactionstyle__inputboxarea--inputsection">
                                    <input placeholder="Enter Amount" 
                                            v-model="numberInput" 
                                            @input="validateNumberInput"/>
                                    <span></span>
                                </div>
                                <span class="amounttobuyinusd">≈ $0.00</span>
                            </div>
                        </div>

                        <div class="transactionstyle__inputboxarea center-align">

                            <div class="transactionstyle__inputboxarea--section flex-direction-column">
                                <span class="balance">Balance USDT</span>
                                <span class="balance-figure">$0</span>
                            </div>
                            <div class="transactionstyle__inputboxarea--section">
                                <span class="percentpill">25%</span>
                                <span class="percentpill">50%</span>
                                <span class="percentpill">75%</span>
                                <span class="percentpill">Max</span>
                            </div>
                        </div>
                    </div>

                    <div class="transactionstyle__returns">
                        <div class="transactionstyle__returns--area">
                            <span>Estimated Yearly Returns*</span>
                            <span class="green">@ 18.16% APY</span>
                        </div>
                        <div class="transactionstyle__returns--area">
                            <span>$0.00</span>
                            <figure class="reserveassetlogo">
                                <img src="https://rawcdn.githack.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"/>
                            </figure>
                        </div>
                    </div>

                    <div class="transactionstyle__btn">
                        <button class="btn colored-btn padded-btn" :class="{
                            opacity
                        }">Withdraw</button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import transactionpopup from '@/mixins/transactionpopup';

export default {
    props: ['toggleOfferCard', 'toggledepositor'],
    mixins: [transactionpopup]
}
</script>
