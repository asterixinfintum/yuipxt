<template>
    <div>
        <div class="popup">
            <div class="popup__body transactionstyle__body">
                <div class="transactionstyle__subject">
                    <div class="transactionstyle__subject--backbtn" @click="toggleAssetsMenu">
                        <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-onkibi" aria-hidden="true">
                            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z">
                            </path>
                        </svg>
                    </div>
                    <div class="transactionstyle__subject--name">
                        <h3>
                            <span>Select asset to transfer to {{ toWallet }} wallet</span>
                        </h3>
                    </div>
                    <div class="transactionstyle__subject--closebtn" @click="closeTransferPanel">
                        <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-onkibi" aria-hidden="true">
                            <path fill="currentColor"
                                d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z">
                            </path>
                        </svg>
                    </div>
                </div>

                <div class="transactionstyle__selectassetcat">

                    <div class="transactionstyle__selectassetcat--area" @click="setCurrentCategory('crypto')">
                        <figure>
                            <img src="https://assets.coincap.io/assets/icons/256/btc.png" />
                        </figure>
                        <span class="btn">
                            <button class="btn">Crypto</button>
                        </span>
                    </div>

                    <div class="transactionstyle__selectassetcat--area" @click="setCurrentCategory('stock')">
                        <figure>
                            <img src="https://assets.coincap.io/assets/icons/rune@2x.png" />
                        </figure>
                        <span class="btn">
                            <button class="btn">Stock</button>
                        </span>
                    </div>

                    <div class="transactionstyle__selectassetcat--area" @click="setCurrentCategory('commodity')">
                        <figure>
                            <img src="https://assets.coincap.io/assets/icons/rune@2x.png" />
                        </figure>
                        <span class="btn">
                            <button class="btn">Commodity</button>
                        </span>
                    </div>

                    <!--<div class="transactionstyle__selectassetcat--area" @click="setCurrentCategory('fiat')">
                        <figure>
                            <img src="https://clipart-library.com/new_gallery/111-1111898_transparent-american-flag-icon.png" />
                        </figure>
                        <span class="btn">
                            <button class="btn">Fiat</button>
                        </span>
                    </div>-->

                </div>

                <div class="transactionstyle__search">
                    <div class="transactionstyle__search--body">
                        <span>
                            <svg focusable="false" width="1em" height="1em" fill="currentColor" aria-hidden="true"
                                viewBox="0 0 16 16" data-icon="SearchOutlined"
                                class="sc-aXZVg ktFCMi mx-icon iconfont iconsearch">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M9.93186 10.8786C9.02879 11.5806 7.89393 11.9987 6.66146 11.9987C3.71594 11.9987 1.32812 9.6109 1.32812 6.66536C1.32812 3.71984 3.71594 1.33203 6.66146 1.33203C9.60699 1.33203 11.9948 3.71984 11.9948 6.66536C11.9948 7.89783 11.5767 9.0327 10.8747 9.93576L14.4662 13.5273C14.7265 13.7876 14.7265 14.2098 14.4662 14.4701C14.2059 14.7304 13.7837 14.7304 13.5234 14.4701L9.93186 10.8786ZM10.6615 6.66536C10.6615 8.8745 8.87059 10.6654 6.66146 10.6654C4.45232 10.6654 2.66146 8.8745 2.66146 6.66536C2.66146 4.45622 4.45232 2.66536 6.66146 2.66536C8.87059 2.66536 10.6615 4.45622 10.6615 6.66536Z">
                                </path>
                            </svg>
                        </span>
                        <span>
                            <input type="text" placeholder="Search for asset" v-model="searchInput" />
                        </span>
                    </div>
                </div>

                <div class="transactionstyle__listitemsassets">

                    <div class="transactionstyle__listitemsasset" v-for="(asset, caindex) in paginatedList"
                        @click="setCurrentAsset(asset)">
                        <figure class="transactionstyle__listitemsasset--logo">
                            <img :src="returnCryptoLogo(asset.image)" />
                        </figure>
                        <div class="transactionstyle__listitemsasset--labels">
                            <label class="name" v-if="asset.coin">{{ asset.name }}</label>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </div>
</template>

<script>
import listMixin from '@/mixins/list';
import walletMixin from '@/mixins/wallet';
import cryptologosMixin from '@/mixins/cryptologos';

import TransferEventBus from '~/plugins/event-transfer';

export default {
    props: [
        'setCurrentAsset',
        'toWallet',
        'toggleAssetsMenu'
    ],
    mixins: [walletMixin, listMixin, cryptologosMixin],
    methods: {
        closeTransferPanel() {
            TransferEventBus.$emit('toggle-transfer-panel');
        }
    }
}
</script>