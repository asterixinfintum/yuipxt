<template>
    <div class="asset container">
        <DashboardHeader />

        <div class="asset__content" v-if="asset">
            <div class="formButtonArea">
                <button class="formSubmitbutton" @click="openItemPage('editasset', asset._id)">Edit Asset</button>
            </div>

            <div class="formButtonArea"></div>

            <label class="asset__content__label" for="name">Asset Name:</label>
            <div id="name" class="asset__content__value">{{ asset.name }}</div>

            <label class="asset__content__label" for="coin">Coin:</label>
            <div id="coin" class="asset__content__value">{{ asset.coin }}</div>

            <label class="asset__content__label" for="symbol">Symbol:</label>
            <div id="symbol" class="asset__content__value">{{ asset.symbol }}</div>

            <label class="asset__content__label" for="price">Asset Type:</label>
            <div id="price" class="asset__content__value">{{ asset.assetType }}</div>

            <label class="asset__content__label" for="symbolImg">Symbol Image:</label>
            <div id="symbolImg" class="asset__content__value img">
                <img :src="`${base_url}/${asset.symbolImg}`"/>
            </div>
            
            <label class="asset__content__label" for="price">Price:</label>
            <div id="price" class="asset__content__value">{{ asset.price }}</div>

            <label class="asset__content__label" for="dailyChange">Daily Change:</label>
            <div id="dailyChange" class="asset__content__value">{{ asset.dailyChange }}</div>

            <label class="asset__content__label" for="time">Time:</label>
            <div id="time" class="asset__content__value">{{ asset.time }}</div>

            <label class="asset__content__label" for="ts">Timestamp:</label>
            <div id="ts" class="asset__content__value">{{ asset.ts }}</div>

            <label class="asset__content__label" for="createdBy">Created By:</label>
            <div id="createdBy" class="asset__content__value">{{ asset.createdBy }}</div>

            <label class="asset__content__label" for="initialPrice">Initial Price:</label>
            <div id="initialPrice" class="asset__content__value">{{ asset.initialPrice }}</div>

            <label class="asset__content__label" for="marketCap">Market Cap:</label>
            <div id="marketCap" class="asset__content__value">{{ asset.marketCap }}</div>

            <label class="asset__content__label" for="liquidity">Liquidity:</label>
            <div id="liquidity" class="asset__content__value">{{ asset.liquidity }}</div>

            <label class="asset__content__label" for="totalSupply">Total Supply:</label>
            <div id="totalSupply" class="asset__content__value">{{ asset.totalSupply }}</div>

            <label class="asset__content__label" for="description">Description:</label>
            <div id="description" class="asset__content__value">{{ asset.description }}</div>
        </div>
    </div>
</template>

<script>
import utilityMixin from '@/mixins/utility.js';
import assetMixin from '@/mixins/asset.js';

export default {
    mixins: [utilityMixin, assetMixin],
}
</script>

<style lang="scss" scoped>
.asset {
    @include container;

    &__content {
        @include content;
        padding: #{scaleValue(30)};

        &__label {
            display: block;
            font-size: 1rem;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: $primary-color;
        }

        &__value {
            font-size: 1.1rem;
            color: #555;
            background: #fff;
            padding: #{scaleValue(10)} 0;
            border-bottom: 1px solid $primary-color;
            margin-bottom: 20px; // spacing between each item

            &.img {
                & img {
                    height: #{scaleValue(20)};
                    width: #{scaleValue(20)};
                }
            }
        }
    }
}
</style>