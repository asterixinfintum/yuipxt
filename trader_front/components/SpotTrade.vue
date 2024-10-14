<template>
    <div class="spottradearea__inputsections">
        <div class="spottradearea__inputsection">
            <div class="spottradearea__balance">
                <span class="spottradearea__balance--label">Avbl</span>
                <span class="spottradearea__balance--value">0</span>
                <span class="spottradearea__balance--symbol">USDT</span>
                <span class="spottradearea__balance--svg" @click="fundaccount_popup_toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="" cursor="pointer"
                        class="css-12oo3on">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-10.25 1.25V18h2.5v-4.75H18v-2.5h-4.75V6h-2.5v4.75H6v2.5h4.75z"
                            fill=""></path>
                    </svg>
                </span>
            </div>

            <div class="spottradearea__inputsection--inputarea">
                <input class="spottradearea__inputsection--input" placeholder="Price" type="number" v-model="asset_price" />
                <span class="spottradearea__inputsection--placeholder">Price</span>
                <div class="spottradearea__inputsection--labels">
                    <span class="spottradearea__inputsection--symbol">USDT</span>
                </div>
            </div>

            <div class="spottradearea__inputsection--inputarea">
                <input class="spottradearea__inputsection--input" placeholder="Amount" type="number" v-model="buy_value" />
                <span class="spottradearea__inputsection--placeholder">Amount</span>
                <div class="spottradearea__inputsection--labels">
                    <span class="spottradearea__inputsection--symbol">{{ }}</span>
                </div>
            </div>

            <div class="spottradearea__sliderarea">

                <div class="spottradearea__sliderbody">
                    <div class="spottradearea__slidercontainer">
                        <div class="spottradearea__slider">
                            <div class="spottradearea__slidertrack buy" :style="{ width: buyTrackWidth + '%' }"></div>
                            <div class="spottradearea__sliderthumb" :style="{ left: buyThumbPosition + '%' }"></div>
                        </div>
                        <input type="range" min="0" max="100" v-model="sliderBuyValue" class="spottradearea__sliderinput">
                    </div>
                    <p class="spottradearea__slidervalue buy">{{ sliderBuyValue }}%</p>
                </div>

            </div>

            <div class="spottradearea__inputsection--inputarea">
                <input class="spottradearea__inputsection--input" placeholder="Amount" type="number"
                    v-model="buy_value_total" />
                <span class="spottradearea__inputsection--placeholder">Total</span>
                <div class="spottradearea__inputsection--labels">
                    <span class="spottradearea__inputsection--symbol">USDT</span>
                </div>
            </div>

            <div class="spottradearea__buybtn">
                <button class="btn">Buy {{ }}</button>
            </div>
        </div>

        <div class="spottradearea__inputsection">
            <div class="spottradearea__balance">
                <span class="spottradearea__balance--label">Avbl</span>
                <span class="spottradearea__balance--value">0</span>
                <span class="spottradearea__balance--symbol">{{  }}</span>
                <span class="spottradearea__balance--svg" @click="fundaccount_popup_toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="" cursor="pointer"
                        class="css-12oo3on">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-10.25 1.25V18h2.5v-4.75H18v-2.5h-4.75V6h-2.5v4.75H6v2.5h4.75z"
                            fill=""></path>
                    </svg>
                </span>
            </div>

            <div class="spottradearea__inputsection--inputarea">
                <input class="spottradearea__inputsection--input" placeholder="Price" type="number" v-model="asset_price" />
                <span class="spottradearea__inputsection--placeholder">Price</span>
                <div class="spottradearea__inputsection--labels">
                    <span class="spottradearea__inputsection--symbol">USDT</span>
                </div>
            </div>

            <div class="spottradearea__inputsection--inputarea">
                <input class="spottradearea__inputsection--input" placeholder="Amount" type="number" v-model="buy_value" />
                <span class="spottradearea__inputsection--placeholder">Amount</span>
                <div class="spottradearea__inputsection--labels">
                    <span class="spottradearea__inputsection--symbol">{{ asset.coin }}</span>
                </div>
            </div>

            <div class="spottradearea__sliderarea">

                <div class="spottradearea__sliderbody">
                    <div class="spottradearea__slidercontainer">
                        <div class="spottradearea__slider">
                            <div class="spottradearea__slidertrack sell" :style="{ width: sellTrackWidth + '%' }"></div>
                            <div class="spottradearea__sliderthumb" :style="{ left: sellThumbPosition + '%' }"></div>
                        </div>
                        <input type="range" min="0" max="100" v-model="sliderSellValue"
                            class="spottradearea__sliderinput sell">
                    </div>
                    <p class="spottradearea__slidervalue sell">{{ sliderSellValue }}%</p>
                </div>

            </div>

            <div class="spottradearea__inputsection--inputarea">
                <input class="spottradearea__inputsection--input" placeholder="Amount" type="number"
                    v-model="buy_value_total" />
                <span class="spottradearea__inputsection--placeholder">Total</span>
                <div class="spottradearea__inputsection--labels">
                    <span class="spottradearea__inputsection--symbol">USDT</span>
                </div>
            </div>

            <div class="spottradearea__buybtn">
                <button class="btn sell">Sell {{  }}</button>
            </div>
        </div>

    </div>
</template>

<script>
import tradeMixin from '@/mixins/trade';

export default {
    props: ['asset'],
    mixins: [tradeMixin]
}

</script>