<template>
    <div class="createasset container">
        <DashboardHeader />

        <div class="createasset__contents">
            <div class="createasset__inputs">
                <!-- Name -->
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Name</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="Name" v-model="name" />
                    </span>
                </div>

                <!-- Coin -->
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Coin</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="Coin" v-model="coin" />
                    </span>
                </div>

                <!-- Symbol -->
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Symbol</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="Symbol" v-model="symbol" />
                    </span>
                </div>

                <!-- Price -->
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Price</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="Price" v-model="price" />
                    </span>
                </div>

                <!-- Daily Change -->
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Daily Change</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="Daily Change" v-model="dailyChange" />
                    </span>
                </div>

                <!-- Support Borrow -->
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Support Borrow eg True, False</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="Support Borrow" v-model="supportBorrow" />
                    </span>
                </div>

                <!-- Asset Type -->
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Asset Type eg Crypto, Fiat, Stocks, Tokenized Stock</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="Asset Type" v-model="assetType" />
                    </span>
                </div>

                <!-- Open -->
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Open</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="Open" v-model="open" />
                    </span>
                </div>

                <!-- Low -->
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Low</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="Low" v-model="low" />
                    </span>
                </div>

                <!-- High -->
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">High</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="High" v-model="high" />
                    </span>
                </div>

                <!-- Close -->
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Close</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="Close" v-model="close" />
                    </span>
                </div>

                <!-- Ticker Symbol -->
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Ticker Symbol</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="Ticker Symbol" v-model="tickerSymbol" />
                    </span>
                </div>

                <!-- Chain -->
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Chain</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="Chain" v-model="chain" />
                    </span>
                </div>

                <!-- Initial Price -->
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Initial Price</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="Initial Price" v-model="initialPrice" />
                    </span>
                </div>

                <!-- Market Cap -->
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Market Cap</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="Market Cap" v-model="marketCap" />
                    </span>
                </div>

                <!-- Liquidity -->
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Liquidity</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="Liquidity" v-model="liquidity" />
                    </span>
                </div>

                <!-- Total Supply -->
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Total Supply</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="Total Supply" v-model="totalSupply" />
                    </span>
                </div>

                <!-- Circulating Supply -->
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Circulating Supply</label>
                    </span>
                    <span class="formInputField">
                        <input placeholder="Circulating Supply" v-model="circulatingSupply" />
                    </span>
                </div>

                <!-- Description -->
                <div class="createasset__inputarea">
                    <span>
                        <label class="formInputLabel">Description</label>
                    </span>
                    <span class="formInputField textarea">
                        <textarea placeholder="Description" v-model="description"></textarea>
                    </span>
                </div>

                <div class="createasset__inputarea">
                    <span>
                        <label for="imageUpload">Choose an image for the asset logo:</label>
                    </span>
                    <span class="formInputField">
                        <input type="file" id="imageUpload" name="symbolImg" accept="image/*" @change="handleFileUpload">
                    </span>
                </div>

            </div>

            <div class="createasset__btns">
                <div class="formButtonArea">
                    <button class="formSubmitbutton" @click="createAsset">Create Asset</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import utilityMixin from '@/mixins/utility.js';

export default {
    mixins: [utilityMixin],
    data() {
        return {
            name: '',
            coin: '',
            symbol: '',
            price: '',
            dailyChange: '',
            supportBorrow: '',
            assetType: '',
            open: '',
            low: '',
            high: '',
            close: '',
            tickerSymbol: '',
            chain: '',
            initialPrice: '',
            marketCap: '',
            liquidity: '',
            totalSupply: '',
            circulatingSupply: '',
            description: '',
            selectedImage: ''
        };
    },
    methods: {
        async createAsset() {
            const { base_url, admin } = this;

            const {
                name,
                coin,
                symbol,
                price,
                dailyChange,
                supportBorrow,
                assetType,
                open,
                low,
                high,
                close,
                tickerSymbol,
                chain,
                initialPrice,
                marketCap,
                liquidity,
                totalSupply,
                circulatingSupply,
                description,
                selectedImage
            } = this;

            const data = {
                name,
                coin,
                symbol,
                price,
                dailyChange,
                supportBorrow,
                assetType,
                open,
                low,
                high,
                close,
                tickerSymbol,
                chain,
                initialPrice,
                marketCap,
                liquidity,
                totalSupply,
                circulatingSupply,
                description,
                selectedImage
            };

            try {
                const admin_token = localStorage.getItem('873__jh6bdjkadmtoken');
                const formData = new FormData();

                Object.keys(data).forEach(key => formData.append(key, data[key]));

                fetch(`${base_url}/createinhouseasset?admin=${admin._id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${admin_token}`
                    },
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        //console.log(data);
                        this.openPage('assets');
                    })
            } catch (error) {
                console.log(error);
            }
        },
        handleFileUpload(event) {
            this.selectedImage = event.target.files[0];
        }
    }
}
</script>

<style lang="scss" scoped>
.createasset {
    @include base-container-style;

    &__contents {
        @include content;
        padding: #{scaleValue(30)};
    }
}
</style>