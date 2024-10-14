<template>
    <div class="popup">
        <div class="transactionstyle">
            <div class="popup__body transactionstyle__body">

                <div class="transactionstyle__subject">
                    <div class="transactionstyle__subject--name">
                        <h3>Overview</h3>
                    </div>
                    
                    <div class="transactionstyle__subject--closebtn" @click="toggleOfferCard">
                        <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-onkibi" aria-hidden="true"><path fill="currentColor" d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"></path></svg>
                    </div>
                </div>

                <div class="transactionstyle__overviewtop">

                    <div class="transactionstyle__overviewarea">
                        <div class="transactionstyle__overviewarea--labelarea">
                            <figure>
                                <img src="https://raw.githubusercontent.com/Idle-Labs/idle-dashboard/master/public/images/tokens/USDT.svg"/>
                            </figure>
                            <div class="transactionstyle__overviewarea--label">
                                <span>USDT Vault</span>
                                <span>Idle Finance</span>
                            </div>
                        </div>
                        <div class="transactionstyle__overviewarea--number">$0.00</div>
                    </div>

                    <div class="transactionstyle__overviewarea btn-area">
                        <button class="transactionstyle__overviewarea--btn btn" @click="toggledepositor">
                            <span>
                                <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-onkibi" aria-hidden="true"><path fill="currentColor" d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path></svg>
                            </span>
                                Deposit
                        </button>
                        <button class="transactionstyle__overviewarea--btn btn" @click="togglewithdrawer">
                            <span>
                                <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-onkibi" aria-hidden="true"><path fill="currentColor" d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"></path></svg>
                            </span>
                            Withdraw
                        </button>
                        <button class="transactionstyle__overviewarea--btn btn claim">
                            <span>
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" aria-hidden="true" focusable="false" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M32 448c0 17.7 14.3 32 32 32h160V320H32v128zm256 32h160c17.7 0 32-14.3 32-32V320H288v160zm192-320h-42.1c6.2-12.1 10.1-25.5 10.1-40 0-48.5-39.5-88-88-88-41.6 0-68.5 21.3-103 68.3-34.5-47-61.4-68.3-103-68.3-48.5 0-88 39.5-88 88 0 14.5 3.8 27.9 10.1 40H32c-17.7 0-32 14.3-32 32v80c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-80c0-17.7-14.3-32-32-32zm-326.1 0c-22.1 0-40-17.9-40-40s17.9-40 40-40c19.9 0 34.6 3.3 86.1 80h-86.1zm206.1 0h-86.1c51.4-76.5 65.7-80 86.1-80 22.1 0 40 17.9 40 40s-17.9 40-40 40z"></path></svg>
                            </span>
                            Claim
                        </button>
                    </div>

                    <div class="transactionstyle__overviewarea underlying-assets">
                        <div class="transactionstyle__overviewarea--area">
                            <div class="transactionstyle__overviewarea--arealabel">Underlying Tokens</div>

                            <div class="transactionstyle__overviewarea--underlyingasset">
                                <figure>
                                    <img src="https://raw.githubusercontent.com/Idle-Labs/idle-dashboard/master/public/images/tokens/USDT.svg"/>
                                </figure>
                                <span>0 USDT</span>
                            </div>

                        </div>
                        <div class="transactionstyle__overviewarea--area">
                            <!--<div class="transactionstyle__overviewarea--arealabel">Available Rewards</div>-->

                            <span></span>
                        </div>
                    </div>

                </div>


                <div class="transactionstyle__about">
                    <h3 class="transactionstyle__about--h3">What is a Junior Tranche?</h3>

                    <div class="transactionstyle__about--paragraph">
                        <p>
                            Enjoy boosted DeFi yields. Junior Tranches provide leveraged returns as they are compensated by their Senior counterparty for dragging more risk.
                        </p>
                    </div>
                </div>

                <div class="transactionstyle__about">
                    <h3 class="transactionstyle__about--h3">About</h3>

                    <div class="transactionstyle__about--paragraph">
                        <p>
                            Tether (USDT) is a cryptocurrency with a value meant to mirror the value of the U.S. dollar. The idea was to create a stable cryptocurrency that can be used like digital
                        </p>
                    </div>

                    <button class="transactionstyle__about--btn btn greyed-btn padded-btn">Show More</button>
                </div>

                <div class="transactionstyle__sect flex">
                    <div class="transactionstyle__sect--area column">
                        <span>$1.97M</span>
                        <span>TVL</span>
                    </div>

                    <div class="transactionstyle__sect--area column">
                        <span class="green">17.01%</span>
                        <span>APY</span>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['toggleOfferCard', 'toggledepositor', 'togglewithdrawer']
}
</script>