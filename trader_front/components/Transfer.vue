<template>
    <div class="popup">
        <div v-if="assetCategoriesOpen">
            <TransferAssetListMenu 
                :setCurrentAsset="setCurrentAsset"
                :toWallet="toWallet"
                :toggleAssetsMenu="toggleAssetsMenu"/>
        </div>  
        
        <div v-if="showPreview">
            <PreviewTrade 
                :contentObj="dataToSubmit" :toggleconfirmTrade="togglePreview"/>
        </div>
        
        <div class="transfer">
            <div class="popup__body transactionstyle__body" v-if="view === 'main'">
                <div class="transactionstyle__subject">
                    <!--<div class="transactionstyle__subject--backbtn">
                        <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-onkibi" aria-hidden="true"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
                    </div>-->
                    <div class="transactionstyle__subject--name">
                        <h3>Transfer Into {{ toWallet }}</h3>
                    </div>
                    <div class="transactionstyle__subject--closebtn" @click="closeTransferPanel">
                        <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-onkibi" aria-hidden="true"><path fill="currentColor" d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"></path></svg>
                    </div>
                </div>

                <div class="transactionstyle__container">
                    <div class="transactionstyle__info">
                        <div class="transactionstyle__info--header">
                            <span>Transfer Info</span>
                        </div>
                        <div class="transactionstyle__info--text">
                            <p>Enter the amount of  {{ assetToTransferData ? assetToTransferData.name : '' }} you would like to transfer.</p>
                        </div>
                    </div>

                    <h3 class="transactionstyle__amounttodep">
                        Amount to Transfer
                    </h3>

                    <div class="transactionstyle__inputbox">
                        <div class="transactionstyle__inputboxarea">
                            <div class="transactionstyle__inputboxarea--section center-align reserveasset-label-area" @click="toggleAssetsMenu">
                                <figure class="reserveassetlogo">
                                    <img :src="returnCryptoLogo(assetToTransferData.image)"/>
                                </figure>
                                <span class="reserveassetlabel">
                                    {{ assetToTransferData ? assetToTransferData.coin : '' }}
                                </span>
                            </div>

                            <div class="transactionstyle__inputboxarea--section flex-direction-column flex-end-column">
                                <div class="transactionstyle__inputboxarea--inputsection">
                                    <input placeholder="Enter Amount" 
                                            v-model="numberInput" 
                                            @input="validateNumberInput"
                                            :class="{ inputError }"/>
                                    <span></span>
                                </div>
                                <span class="amounttobuyinusd">≈ ${{ youPayUSD }}</span>
                            </div>
                        </div>

                        <div class="transactionstyle__inputboxarea center-align">

                            <div class="transactionstyle__inputboxarea--section flex-direction-column">
                                <span class="balance">Balance {{ assetToTransferData ? assetToTransferData.coin : '' }}</span>
                                
                                <span class="balance-figure">
                                    {{ 
                                        assetWalletBalance ?  
                                        assetWalletBalance.base.balanceinWallet : 0 
                                    }}
                                </span>

                                <!--<span class="balance-figure">
                                    ${{ 
                                        assetWalletBalance ?  
                                        assetWalletBalance.balanceInDollars : 0 
                                    }}
                                </span>-->
                            </div>
                            <div class="transactionstyle__inputboxarea--section">
                                <span class="percentpill">25%</span>
                                <span class="percentpill">50%</span>
                                <span class="percentpill">75%</span>
                                <span class="percentpill">Max</span>
                            </div>
                        </div>
                    </div>

                    <div class="transactionstyle__inputbox normal">
                        <div class="transactionstyle__transferoptions">
                            <div class="transactionstyle__inputboxarea flex-direction-column">

                                <div class="transactionstyle__inputboxarea--section center-align-default pointer" @click="toggleMenu('from')">
                                    <span class="category-section">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-199zucj"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 3.5a5.502 5.502 0 00-5.302 4.032 7.502 7.502 0 016.77 6.77A5.502 5.502 0 0015 3.5zM14.5 15a5.5 5.5 0 10-11 0 5.5 5.5 0 0011 0zm-8 0L9 17.5l2.5-2.5L9 12.5 6.5 15zM9 4H4v5l5-5zm11 16h-5l5-5v5z" fill="currentColor"></path></svg>
                                    </span>
                                    <span class="direction">From</span>
                                    <span class="category">{{ fromWallet }}</span>
                                    <span class="opencategoryoptions">></span>
                                </div>

                                <div class="transactionstyle__inputboxarea--section center-align-default toarrowparent">
                                    <span class="toarrow">--></span>
                                    <span class="switchbtn percentpill" @click="toggleSwitch">Switch</span>
                                </div>

                                <div class="transactionstyle__inputboxarea--section center-align-default pointer" @click="toggleMenu('to')">
                                    <span class="category-section">
                                        <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-onkibi" aria-hidden="true"><g clip-path="url(#clip0_25_654)"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.3467 13.8434C16.8135 13.6394 17.3574 13.8525 17.5614 14.3193C18.2584 15.9145 18.4299 17.69 18.0513 19.389C17.6726 21.0881 16.7633 22.6227 15.4549 23.7709C15.0894 24.0915 14.5379 24.0736 14.1941 23.7298L10.7254 20.2611C10.3651 19.9009 10.3651 19.3168 10.7254 18.9565C11.0857 18.5962 11.6698 18.5962 12.0301 18.9565L14.8461 21.7726C15.5352 20.9786 16.0198 20.0225 16.2504 18.9877C16.5439 17.6707 16.4109 16.2945 15.8707 15.0581C15.6667 14.5912 15.8798 14.0474 16.3467 13.8434Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M4.61097 5.94874C6.31005 5.57006 8.08553 5.74162 9.68066 6.43862C10.1475 6.64262 10.3606 7.18647 10.1566 7.65334C9.95263 8.1202 9.40878 8.3333 8.94192 8.1293C7.70551 7.58905 6.32931 7.45607 5.01234 7.74959C3.9775 7.98023 3.02138 8.46481 2.22744 9.15388L5.04351 11.9699C5.40378 12.3302 5.40378 12.9143 5.04351 13.2746C4.68324 13.6349 4.09914 13.6349 3.73887 13.2746L0.270202 9.80592C-0.0735815 9.46214 -0.0915507 8.91055 0.229129 8.54512C1.37731 7.23671 2.9119 6.32742 4.61097 5.94874Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M21.5071 0.0254028C21.8432 -0.0266898 22.1868 0.00158717 22.5099 0.107917C22.8329 0.214248 23.1261 0.395606 23.3656 0.637127C23.605 0.878648 23.7838 1.17346 23.8873 1.49741C23.9906 1.82071 24.016 2.16385 23.9614 2.49881C23.4101 5.96028 20.9815 13.801 10.9235 21.1056C10.5564 21.3722 10.0499 21.3323 9.72909 21.0114L9.64339 20.9257L8.57368 21.9955C8.50842 22.0607 8.43438 22.1152 8.35435 22.1577C7.97578 22.4578 7.50504 22.6233 7.01729 22.6233C6.44862 22.6233 5.90306 22.3983 5.49975 21.9974L5.49781 21.9955L2.00454 18.5022L2.0026 18.5003C1.60169 18.0969 1.37666 17.5514 1.37666 16.9827C1.37666 16.414 1.60169 15.8685 2.0026 15.4652L2.00454 15.4632L3.0927 14.3751L2.98856 14.2709C2.66872 13.9511 2.62795 13.4465 2.89227 13.0795C10.1777 2.96288 18.0853 0.589109 21.4985 0.0267867L21.5071 0.0254028ZM10.4722 19.1445C10.4308 19.0708 10.3791 19.0025 10.318 18.9419L5.05351 13.7143C5.02369 13.6847 4.99235 13.6575 4.95974 13.6328L4.85296 13.526C11.6712 4.40676 18.8482 2.33447 21.7927 1.84822C21.8398 1.84139 21.8878 1.84557 21.933 1.86045C21.9791 1.87564 22.021 1.90155 22.0552 1.93606C22.0894 1.97056 22.115 2.01268 22.1298 2.05895C22.1446 2.10523 22.1482 2.15436 22.1403 2.2023L22.1396 2.20662C21.6677 5.17316 19.5567 12.2986 10.4722 19.1445ZM4.39734 15.6797L3.31111 16.7659C3.31093 16.7661 3.3113 16.7657 3.31111 16.7659C3.25419 16.8235 3.22169 16.9017 3.22169 16.9827C3.22169 17.0637 3.25363 17.1414 3.31056 17.1989C3.31074 17.1991 3.31038 17.1988 3.31056 17.1989L6.8005 20.6889C6.80071 20.6891 6.80029 20.6887 6.8005 20.6889C6.85805 20.7458 6.93635 20.7783 7.01729 20.7783C7.09853 20.7783 7.17647 20.7462 7.23408 20.6889C7.28592 20.6374 7.34323 20.5926 7.40465 20.5552L8.33876 19.6211L4.39734 15.6797Z" fill="currentColor"></path></g></svg>
                                    </span>
                                    <span class="direction">To</span>
                                    <span class="category">{{ toWallet }}</span>
                                    <span class="opencategoryoptions">></span>
                                </div>

                            </div>
                        </div>


                    </div>

                    <div class="transactionstyle__btn">
                        <button class="btn colored-btn padded-btn" :class="{
                            opacity
                        }" v-if="!enablePreviewBtn">Transfer</button>
                        <button class="btn colored-btn padded-btn" v-if="enablePreviewBtn" @click="togglePreview">Transfer</button>
                    </div>
                </div>
            </div>

            <div class="popup__body transactionstyle__body" v-if="view === 'category options'">
                <div class="transactionstyle__subject">
                    <div class="transactionstyle__subject--backbtn" @click="toggleMenu">
                        <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-onkibi" aria-hidden="true"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
                    </div>
                    <div class="transactionstyle__subject--name">
                        <h3>Select a wallet</h3>
                    </div>
                    <div class="transactionstyle__subject--closebtn">
                        <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-onkibi" aria-hidden="true"><path fill="currentColor" d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"></path></svg>
                    </div>
                </div>

                <div class="transactionstyle__categoryoptions">
                    <div class="transactionstyle__categoryoption" @click="selectWallet('fiat/spot')">
                        <div class="transactionstyle__categoryoption--area">
                            <span class="transactionstyle__categoryoption--svg">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-199zucj"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 3.5a5.502 5.502 0 00-5.302 4.032 7.502 7.502 0 016.77 6.77A5.502 5.502 0 0015 3.5zM14.5 15a5.5 5.5 0 10-11 0 5.5 5.5 0 0011 0zm-8 0L9 17.5l2.5-2.5L9 12.5 6.5 15zM9 4H4v5l5-5zm11 16h-5l5-5v5z" fill="currentColor"></path></svg>
                            </span>
                            <span class="transactionstyle__categoryoption--label">Fiat/Spot</span>
                        </div>
                    </div>

                    <div class="transactionstyle__categoryoption" @click="selectWallet('margin')">
                        <div class="transactionstyle__categoryoption--area">
                            <span class="transactionstyle__categoryoption--svg">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-199zucj"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 3.5a5.502 5.502 0 00-5.302 4.032 7.502 7.502 0 016.77 6.77A5.502 5.502 0 0015 3.5zM14.5 15a5.5 5.5 0 10-11 0 5.5 5.5 0 0011 0zm-8 0L9 17.5l2.5-2.5L9 12.5 6.5 15zM9 4H4v5l5-5zm11 16h-5l5-5v5z" fill="currentColor"></path></svg>
                            </span>
                            <span class="transactionstyle__categoryoption--label">Margin</span>
                        </div>
                    </div>

                    <!--<div class="transactionstyle__categoryoption" @click="selectWallet('defi')">
                        <div class="transactionstyle__categoryoption--area">
                            <span class="transactionstyle__categoryoption--svg">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-199zucj"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 3.5a5.502 5.502 0 00-5.302 4.032 7.502 7.502 0 016.77 6.77A5.502 5.502 0 0015 3.5zM14.5 15a5.5 5.5 0 10-11 0 5.5 5.5 0 0011 0zm-8 0L9 17.5l2.5-2.5L9 12.5 6.5 15zM9 4H4v5l5-5zm11 16h-5l5-5v5z" fill="currentColor"></path></svg>
                            </span>
                            <span class="transactionstyle__categoryoption--label">Defi</span>
                        </div>
                    </div>

                    <div class="transactionstyle__categoryoption" @click="selectWallet('bonus')">
                        <div class="transactionstyle__categoryoption--area">
                            <span class="transactionstyle__categoryoption--svg">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-199zucj"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 3.5a5.502 5.502 0 00-5.302 4.032 7.502 7.502 0 016.77 6.77A5.502 5.502 0 0015 3.5zM14.5 15a5.5 5.5 0 10-11 0 5.5 5.5 0 0011 0zm-8 0L9 17.5l2.5-2.5L9 12.5 6.5 15zM9 4H4v5l5-5zm11 16h-5l5-5v5z" fill="currentColor"></path></svg>
                            </span>
                            <span class="transactionstyle__categoryoption--label">Earning</span>
                        </div>
                    </div>

                    <div class="transactionstyle__categoryoption" @click="selectWallet('tokenized stocks')">
                        <div class="transactionstyle__categoryoption--area">
                            <span class="transactionstyle__categoryoption--svg">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-199zucj"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 3.5a5.502 5.502 0 00-5.302 4.032 7.502 7.502 0 016.77 6.77A5.502 5.502 0 0015 3.5zM14.5 15a5.5 5.5 0 10-11 0 5.5 5.5 0 0011 0zm-8 0L9 17.5l2.5-2.5L9 12.5 6.5 15zM9 4H4v5l5-5zm11 16h-5l5-5v5z" fill="currentColor"></path></svg>
                            </span>
                            <span class="transactionstyle__categoryoption--label">Tokenized Stocks</span>
                        </div>
                    </div>

                    <div class="transactionstyle__categoryoption" @click="selectWallet('bot trading')">
                        <div class="transactionstyle__categoryoption--area">
                            <span class="transactionstyle__categoryoption--svg">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-199zucj"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 3.5a5.502 5.502 0 00-5.302 4.032 7.502 7.502 0 016.77 6.77A5.502 5.502 0 0015 3.5zM14.5 15a5.5 5.5 0 10-11 0 5.5 5.5 0 0011 0zm-8 0L9 17.5l2.5-2.5L9 12.5 6.5 15zM9 4H4v5l5-5zm11 16h-5l5-5v5z" fill="currentColor"></path></svg>
                            </span>
                            <span class="transactionstyle__categoryoption--label">Bot Trading</span>
                        </div>
                        <div class="transactionstyle__categoryoption--area right">
                            <span class="red">Inactive</span>
                        </div>
                    </div>-->
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import transactionpopup from '@/mixins/transactionpopup';
import transferMixin from '@/mixins/transfer';
import cryptologosMixin from '@/mixins/cryptologos';

import TransferEventBus from '~/plugins/event-transfer';

export default {
    mixins: [transactionpopup, transferMixin, cryptologosMixin],
    methods: {
        closeTransferPanel() {
            TransferEventBus.$emit('toggle-transfer-panel');
        }
    }
}
</script>
