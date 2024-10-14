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
                    <button class="formSubmitbutton" @click="updateAsset">Update Asset</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import utilityMixin from '@/mixins/utility.js';
import assetMixin from '@/mixins/asset.js';

export default {
    mixins: [utilityMixin, assetMixin],
    data() {
        return {
            updates: {}
        }
    },
    watch: {
        asset() {
            const { asset } = this;
            if (asset) {
                this.setObjectValuesToData(asset);
            }
        },
        name(newValue, oldValue) {
            if (oldValue !== '') {
                this.updates.name = newValue;
            }
        },
        coin(newValue, oldValue) {
            if (oldValue !== '') {
                this.updates.coin = newValue;
            }
        },
        symbol(newValue, oldValue) {
            if (oldValue !== '') {
                this.updates.symbol = newValue;
            }
        },
        price(newValue, oldValue) {
            if (oldValue !== '') {
                this.updates.price = newValue;
            }
        },
        dailyChange(newValue, oldValue) {
            if (oldValue !== '') {
                this.updates.dailyChange = newValue;
            }
        },
        supportBorrow(newValue, oldValue) {
            if (oldValue !== '') {
                this.updates.supportBorrow = newValue;
            }
        },
        assetType(newValue, oldValue) {
            if (oldValue !== '') {
                this.updates.assetType = newValue;
            }
        },
        open(newValue, oldValue) {
            if (oldValue !== '') {
                this.updates.open = newValue;
            }
        },
        low(newValue, oldValue) {
            if (oldValue !== '') {
                this.updates.low = newValue;
            }
        },
        high(newValue, oldValue) {
            if (oldValue !== '') {
                this.updates.high = newValue;
            }
        },
        close(newValue, oldValue) {
            if (oldValue !== '') {
                this.updates.close = newValue;
            }
        },
        tickerSymbol(newValue, oldValue) {
            if (oldValue !== '') {
                this.updates.tickerSymbol = newValue;
            }
        },
        chain(newValue, oldValue) {
            if (oldValue !== '') {
                this.updates.chain = newValue;
            }
        },
        initialPrice(newValue, oldValue) {
            if (oldValue !== '') {
                this.updates.initialPrice = newValue;
            }
        },
        marketCap(newValue, oldValue) {
            if (oldValue !== '') {
                this.updates.marketCap = newValue;
            }
        },
        liquidity(newValue, oldValue) {
            if (oldValue !== '') {
                this.updates.liquidity = newValue;
            }
        },
        totalSupply(newValue, oldValue) {
            if (oldValue !== '') {
                this.updates.totalSupply = newValue;
            }
        },
        circulatingSupply(newValue, oldValue) {
            if (oldValue !== '') {
                this.updates.circulatingSupply = newValue;
            }
        },
        description(newValue, oldValue) {
            if (oldValue !== '') {
                this.updates.description = newValue;
            }
        }
    },
    methods: {
        handleFileUpload(event) {
            this.selectedImage = event.target.files[0];
        },
        setObjectValuesToData(obj) {
            this.name = obj.name || '';
            this.coin = obj.coin || '';
            this.symbol = obj.symbol || '';
            this.price = obj.price || '';
            this.dailyChange = obj.dailyChange || '';
            this.supportBorrow = obj.supportBorrow || false;
            this.assetType = obj.assetType || '';
            this.open = obj.open || '';
            this.low = obj.low || '';
            this.high = obj.high || '';
            this.close = obj.close || '';
            this.tickerSymbol = obj.tickerSymbol || '';
            this.chain = obj.chain || '';
            this.initialPrice = obj.initialPrice || '';
            this.marketCap = obj.marketCap || '';
            this.liquidity = obj.liquidity || '';
            this.totalSupply = obj.totalSupply || '';
            this.circulatingSupply = obj.circulatingSupply || '';
            this.description = obj.description || '';
        },
        async updateAsset() {
            const { base_url, admin, asset, updates } = this;
            const admin_token = localStorage.getItem('873__jh6bdjkadmtoken');
            const formData = new FormData();

            Object.keys(updates).forEach(key => {
                formData.append(key, updates[key])
            });

            if (this.selectedImage) {
                formData.append('selectedImage', this.selectedImage);
            }

            try {
                fetch(`${base_url}/inhouseasset?adminId=${admin._id}&assetId=${asset._id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${admin_token}`
                    },
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        //console.log(data);
                        this.$router.go();
                    })
            } catch (error) {
                console.log(error);
            }
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