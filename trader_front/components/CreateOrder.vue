<template>
  <div class="spottradearea__inputsections" :class="{ autotrade: autoTrade === 'true' }">
    <div class="popup" v-if="orderdetailspreview.length && !successMessage">
      <div class="popup__body transactionstyle__body">
        <div class="transactionstyle__subject">
          <div class="transactionstyle__subject--name">
            <h3>Confirm Order/Trade Details</h3>
          </div>
          <div class="transactionstyle__subject--closebtn" @click="hideorderdetails">
            <svg
              viewBox="0 0 24 24"
              focusable="false"
              class="chakra-icon css-onkibi"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"
              ></path>
            </svg>
          </div>
        </div>

        <div class="transactionstyle__container">
          <div class="previewtrade__content">
            <div class="previewtrade__contentarea">
              <div
                class="previewtrade__contentitem"
                v-for="preview in orderdetailspreview"
              >
                <div class="previewtrade__contentitemleft">{{ preview }}</div>
                <div class="previewtrade__contentitemright">
                  {{ orderdetails[`${preview}`] }}
                </div>
              </div>
            </div>
          </div>

          <div class="transactionstyle__btn">
            <button
              class="btn colored-btn padded-btn"
              @click="calltradecreation"
              v-if="!loading"
            >
              Confirm and Trade
            </button>

            <button class="btn colored-btn padded-btn dim" v-if="loading">
              <span class="loader-button"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="strategiesOpen && !orderdetails">
      <AutoTradeSettings
        :togglestrategiesState="togglestrategiesState"
        :autoTradeDetails="autoTradeDetails"
        :loading="loading"
        :automatictrade="createautotradeorder"
      />
    </div>

    <div v-if="successMessage">
      <Done :successMessage="successMessage" :closeSuccess="closeSuccess" />
    </div>

    <span v-if="errorMessage">
      <ErrorPopup :error="errorMessage" :close="closeError" />
    </span>

    <div
      class="spottradearea__inputsection"
      :class="{ autotrade: autoTrade === 'true' }"
      v-if="currentpair"
    >
      <div class="spottradearea__balance">
        <div v-if="autoTrade !== 'true'">
          <span class="spottradearea__balance--label color-primary">Avblc</span>
          <span class="spottradearea__balance--value"
            ><span class="neon-green">{{
              addEllipsis(`${assetblc(assetOnRightSideOfOrderPair).blc}`, 13)
            }}</span>
            <span class="gold-colored">{{ assetOnRightSideOfOrderPair.coin }}</span></span
          >
          <span class="spottradearea__balance--value opacity-dim"
            >${{
              addEllipsis(`${assetblc(assetOnRightSideOfOrderPair).usdblc}`, 13)
            }}</span
          >
        </div>

        <div class="index__flexbalance" v-if="autoTrade === 'true'">
          <div>
            <span class="spottradearea__balance--label color-primary">Avblcg</span>
            <span class="spottradearea__balance--value"
              ><span class="neon-green">{{
                addEllipsis(`${assetblc(asset).blc}`, 13)
              }}</span>
              <span class="gold-colored">{{ asset.coin }}</span></span
            >
            <span class="spottradearea__balance--value opacity-dim"
              >${{ addEllipsis(`${assetblc(asset).usdblc}`, 13) }}</span
            >
          </div>

          <div>
            <span class="spottradearea__balance--label color-primary">Avblc</span>
            <span class="spottradearea__balance--value"
              ><span class="neon-green">{{
                addEllipsis(`${assetblc(assetOnRightSideOfOrderPair).blc}`, 13)
              }}</span>
              <span class="gold-colored">{{
                assetOnRightSideOfOrderPair.coin
              }}</span></span
            >
            <span class="spottradearea__balance--value opacity-dim"
              >${{
                addEllipsis(`${assetblc(assetOnRightSideOfOrderPair).usdblc}`, 13)
              }}</span
            >
          </div>
        </div>

        <span class="spottradearea__balance--svg" @click="fundaccount_popup_toggle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill=""
            cursor="pointer"
            class="css-12oo3on"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-10.25 1.25V18h2.5v-4.75H18v-2.5h-4.75V6h-2.5v4.75H6v2.5h4.75z"
              fill=""
            ></path>
          </svg>
        </span>
      </div>

      <div
        class="spottradearea__inputsection--inputarea"
        v-if="orderType === 'stop limit' && autoTrade !== 'true'"
        :class="{ autotrade: autoTrade === 'true' }"
      >
        <input
          class="spottradearea__inputsection--input"
          placeholder="Trigger price"
          type="number"
          v-model="stopbuy"
        />
        <span class="spottradearea__inputsection--placeholder">Stop</span>
        <div class="spottradearea__inputsection--labels">
          <span class="spottradearea__inputsection--symbol">{{
            assetOnRightSideOfOrderPair.coin
          }}</span>
        </div>
      </div>

      <div
        class="spottradearea__inputsection--inputarea"
        v-if="orderType !== 'market' && autoTrade !== 'true'"
        :class="{ autotrade: autoTrade === 'true' }"
      >
        <input
          class="spottradearea__inputsection--input"
          placeholder="Price"
          type="number"
          v-model="buyprice"
        />
        <span class="spottradearea__inputsection--placeholder">Price</span>
        <div class="spottradearea__inputsection--labels">
          <span class="spottradearea__inputsection--symbol">{{
            assetOnRightSideOfOrderPair.coin
          }}</span>
        </div>
      </div>

      <div
        class="spottradearea__inputsection--inputarea market-optimal"
        v-if="orderType === 'market' && autoTrade !== 'true'"
        :class="{ autotrade: autoTrade === 'true' }"
      >
        <input
          class="spottradearea__inputsection--input"
          placeholder="Price"
          type="text"
          v-model="optimalPrice"
        />
        <span class="spottradearea__inputsection--placeholder">Price</span>
        <div class="spottradearea__inputsection--labels">
          <span class="spottradearea__inputsection--symbol">{{
            assetOnRightSideOfOrderPair.coin
          }}</span>
        </div>
      </div>

      <div
        class="spottradearea__inputsection--inputarea market-optimal"
        v-if="autoTrade === 'true'"
        :class="{ autotrade: autoTrade === 'true' }"
      >
        <input
          class="spottradearea__inputsection--input"
          placeholder="Price"
          type="text"
          v-model="optimalPrice"
        />
        <span class="spottradearea__inputsection--placeholder">Price</span>
        <div class="spottradearea__inputsection--labels">
          <span class="spottradearea__inputsection--symbol">{{
            assetOnRightSideOfOrderPair.coin
          }}</span>
        </div>
      </div>

      <div
        class="spottradearea__inputsection--inputarea"
        :class="{
          error: buyError,
          autotrade: autoTrade === 'true',
        }"
        v-if="autoTrade !== 'true' && orderType !== 'market'"
      >
        <input
          class="spottradearea__inputsection--input"
          placeholder="Amount"
          type="number"
          v-model="buyquantity"
        />
        <span class="spottradearea__inputsection--placeholder">Quantity</span>
        <div class="spottradearea__inputsection--labels">
          <span class="spottradearea__inputsection--symbol">{{ asset.coin }}</span>
        </div>
      </div>

      <div class="spottradearea__sliderarea">
        <div class="spottradearea__sliderbody">
          <div class="spottradearea__slidercontainer">
            <div class="spottradearea__slider">
              <div
                class="spottradearea__slidertrack buy"
                :style="{ width: buyquantitypercentage + '%' }"
              ></div>
              <div
                class="spottradearea__sliderthumb"
                :style="{ left: buyquantitypercentage + '%' }"
              ></div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              v-model="buyquantitypercentage"
              class="spottradearea__sliderinput"
              :class="{ autotrade: autoTrade === 'true' }"
            />
          </div>
          <p class="spottradearea__slidervalue buy">{{ buyquantitypercentage }}%</p>
        </div>
      </div>

      <div
        class="spottradearea__inputsection--inputarea"
        :class="{ autotrade: autoTrade === 'true' }"
        v-if="autoTrade !== 'true'"
      >
        <input
          class="spottradearea__inputsection--input"
          placeholder="Amount"
          type="number"
          v-model="totalbuycost"
        />
        <span class="spottradearea__inputsection--placeholder">Total</span>
        <div class="spottradearea__inputsection--labels">
          <span class="spottradearea__inputsection--symbol">{{
            assetOnRightSideOfOrderPair.coin
          }}</span>
        </div>
      </div>

      <div
        class="spottradearea__inputsection--inputarea"
        :class="{ autotrade: autoTrade === 'true' }"
        v-if="autoTrade === 'true'"
      >
        <input
          class="spottradearea__inputsection--input"
          placeholder="Amount"
          type="number"
          v-model="totalbuycost"
        />
        <span class="spottradearea__inputsection--placeholder">Total</span>
        <div class="spottradearea__inputsection--labels">
          <span class="spottradearea__inputsection--symbol">{{
            assetOnRightSideOfOrderPair.coin
          }}</span>
        </div>
      </div>

      <div
        class="spottradearea__buybtn"
        v-if="autoTrade === 'true'"
        :class="{ autotrade: autoTrade === 'true' }"
      >
        <button class="btn opacity-dim" v-if="!allowbuy">
          Buy {{ asset.coin }} and Create Automatic Trade for {{ asset.coin }}/{{ assetOnRightSideOfOrderPair.coin }} pair
        </button>

        <button class="btn gold-colored" @click="togglestrategiesState" v-if="allowbuy">
          Buy {{ asset.coin }} and Create Automatic Trade for {{ asset.coin }}/{{ assetOnRightSideOfOrderPair.coin }} pair
        </button>
      </div>

      <div
        class="spottradearea__buybtn"
        v-if="orderType === 'market' && autoTrade !== 'true'"
      >
        <button class="btn opacity-dim" v-if="!allowbuy">Buy {{ asset.coin }}</button>

        <button class="btn gold-colored" v-if="allowbuy" @click="createbuymarketorder">
          Buy {{ asset.coin }}
        </button>
      </div>

      <div
        class="spottradearea__buybtn"
        v-if="orderType === 'limit' && autoTrade !== 'true'"
      >
        <button class="btn opacity-dim" v-if="!allowbuy">Buy {{ asset.coin }}</button>

        <button class="btn gold-colored" v-if="allowbuy" @click="createlimitbuyorder">
          Buy {{ asset.coin }}
        </button>
      </div>

      <div
        class="spottradearea__buybtn"
        v-if="orderType === 'stop limit' && autoTrade !== 'true'"
      >
        <button class="btn opacity-dim" v-if="!allowbuy">Buy {{ asset.coin }}</button>

        <button class="btn gold-colored" v-if="allowbuy" @click="createstopbuyorder">
          Buy {{ asset.coin }}
        </button>
      </div>
    </div>

    <div class="spottradearea__inputsection" v-if="currentpair && autoTrade === 'false'">
      <div class="spottradearea__balance">
        <span class="spottradearea__balance--label color-primary">Avblc</span>
        <span class="spottradearea__balance--value"
          ><span class="neon-green">{{ addEllipsis(`${assetblc(asset).blc}`, 13) }}</span>
          <span class="gold-colored">{{ asset.coin }}</span></span
        >
        <span class="spottradearea__balance--value opacity-dim"
          >${{ addEllipsis(`${assetblc(asset).usdblc}`, 13) }}</span
        >
        <span class="spottradearea__balance--svg" @click="fundaccount_popup_toggle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill=""
            cursor="pointer"
            class="css-12oo3on"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-10.25 1.25V18h2.5v-4.75H18v-2.5h-4.75V6h-2.5v4.75H6v2.5h4.75z"
              fill=""
            ></path>
          </svg>
        </span>
      </div>

      <div
        class="spottradearea__inputsection--inputarea"
        v-if="orderType === 'stop limit'"
      >
        <input
          class="spottradearea__inputsection--input"
          placeholder="Trigger price"
          type="number"
          v-model="stopsell"
        />
        <span class="spottradearea__inputsection--placeholder">Stop</span>
        <div class="spottradearea__inputsection--labels">
          <span class="spottradearea__inputsection--symbol">{{
            assetOnRightSideOfOrderPair.coin
          }}</span>
        </div>
      </div>

      <div class="spottradearea__inputsection--inputarea" v-if="orderType !== 'market'">
        <input
          class="spottradearea__inputsection--input"
          placeholder="Price"
          type="number"
          v-model="sellprice"
        />
        <span class="spottradearea__inputsection--placeholder">Price</span>
        <div class="spottradearea__inputsection--labels">
          <span class="spottradearea__inputsection--symbol">{{
            assetOnRightSideOfOrderPair.coin
          }}</span>
        </div>
      </div>

      <div
        class="spottradearea__inputsection--inputarea market-optimal"
        v-if="orderType === 'market'"
      >
        <input
          class="spottradearea__inputsection--input"
          placeholder="Price"
          type="text"
          v-model="optimalPrice"
        />
        <span class="spottradearea__inputsection--placeholder">Price</span>
        <div class="spottradearea__inputsection--labels">
          <span class="spottradearea__inputsection--symbol">{{
            assetOnRightSideOfOrderPair.coin
          }}</span>
        </div>
      </div>

      <div
        class="spottradearea__inputsection--inputarea"
        :class="{
          error: sellError,
        }"
        v-if="orderType !== 'market'"
      >
        <input
          class="spottradearea__inputsection--input"
          placeholder="Amount"
          type="number"
          v-model="sellquantity"
        />
        <span class="spottradearea__inputsection--placeholder">Quantity</span>
        <div class="spottradearea__inputsection--labels">
          <span class="spottradearea__inputsection--symbol">{{ asset.coin }}</span>
        </div>
      </div>

      <div class="spottradearea__sliderarea">
        <div class="spottradearea__sliderbody">
          <div class="spottradearea__slidercontainer">
            <div class="spottradearea__slider">
              <div
                class="spottradearea__slidertrack sell"
                :style="{ width: sellquantitypercentage + '%' }"
              ></div>
              <div
                class="spottradearea__sliderthumb"
                :style="{ left: sellquantitypercentage + '%' }"
              ></div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              v-model="sellquantitypercentage"
              class="spottradearea__sliderinput sell"
            />
          </div>
          <p class="spottradearea__slidervalue sell">{{ sellquantitypercentage }}%</p>
        </div>
      </div>

      <div class="spottradearea__inputsection--inputarea" v-if="orderType === 'market'">
        <input
          class="spottradearea__inputsection--input"
          placeholder="Amount"
          type="number"
          v-model="totalsellcost"
        />
        <span class="spottradearea__inputsection--placeholder">Total</span>
        <div class="spottradearea__inputsection--labels">
          <span class="spottradearea__inputsection--symbol">{{ asset.coin }}</span>
        </div>
      </div>

      <div class="spottradearea__inputsection--inputarea" v-if="orderType !== 'market'">
        <input
          class="spottradearea__inputsection--input"
          placeholder="Amount"
          type="number"
          v-model="totalsellcost"
        />
        <span class="spottradearea__inputsection--placeholder">Total</span>
        <div class="spottradearea__inputsection--labels">
          <span class="spottradearea__inputsection--symbol">{{
            assetOnRightSideOfOrderPair.coin
          }}</span>
        </div>
      </div>

      <div>
        <div
          class="spottradearea__buybtn"
          v-if="orderType === 'market' && autoTrade !== 'true'"
        >
          <button class="btn sell opacity-dim" v-if="!allowsell">
            Sell {{ asset.coin }}
          </button>

          <button
            class="btn sell gold-colored"
            @click="createsellmarketorder"
            v-if="allowsell"
          >
            Sell {{ asset.coin }}
          </button>
        </div>

        <div
          class="spottradearea__buybtn"
          v-if="orderType === 'limit' && autoTrade !== 'true'"
        >
          <button class="btn sell opacity-dim" v-if="!allowsell">
            Sell {{ asset.coin }}
          </button>

          <button
            class="btn sell gold-colored"
            v-if="allowsell"
            @click="createlimitsellorder"
          >
            Sell {{ asset.coin }}
          </button>
        </div>

        <div
          class="spottradearea__buybtn"
          v-if="orderType === 'stop limit' && autoTrade !== 'true'"
        >
          <button class="btn sell opacity-dim" v-if="!allowsell">
            Sell {{ asset.coin }}
          </button>

          <button
            class="btn sell gold-colored"
            @click="createstopsellorder"
            v-if="allowsell"
          >
            Sell {{ asset.coin }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orderMixin from "@/mixins/order";
import globalMixin from "@/mixins/global";

export default {
  mixins: [orderMixin, globalMixin],
};
</script>
