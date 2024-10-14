<template>
  <div class="index">
    <div class="index__content">
      <div class="index__top">
        <HeaderBox />

        <div class="index__body" v-if="asset">
          <div class="index__rows">
            <div class="index__row left">
              <div class="index__header">
                <p class="color-primary">Order Book</p>
              </div>
              <div class="index__list">
                <div v-if="currentpair">
                  <List
                    :type="'order book sell'"
                    :headers="[
                      'Price(USDT)',
                      `Amount(${asset ? asset.coin : ''})`,
                      'Total(USDT)',
                    ]"
                    :color="'#FF3F34'"
                    :asset="asset"
                    :currentpair="currentpair"
                    :orders="pairsellorders"
                  />
                </div>
              </div>

              <div class="index__assetprice landing-green" v-if="asset && assets.length">
                <span class="index__assetprice--span1">{{
                  this.currentpair ? this.currentpair.price : ""
                }}</span>
                <span class="index__assetprice--span2"> ≈ </span>
                <span class="index__assetprice--span3">${{ asset.price }}</span>
              </div>

              <div class="index__list">
                <div v-if="currentpair">
                  <List
                    :type="'order book sell'"
                    :headers="[
                      'Price(USDT)',
                      `Amount(${asset ? asset.coin : ''})`,
                      'Total(USDT)',
                    ]"
                    :color="'#39FF14'"
                    :asset="asset"
                    :currentpair="currentpair"
                    :orders="pairbuyorders"
                  />
                </div>
              </div>
            </div>

            <div class="index__row middle" v-if="asset && assets.length">
              <div class="index__graphheader">
                <div class="index__graphheader--infos index__graphheader--section">
                  <div class="index__graphheader--info">
                    <label>{{ asset.price }}</label>
                    <span>${{ asset.price }}</span>
                  </div>
                  <div class="index__graphheader--info">
                    <label>24h Change</label>
                    <span>{{ twentyfourhourchanged }}%</span>
                  </div>
                  <div class="index__graphheader--info">
                    <label>24h High</label>
                    <span>{{ twentyfourhourhighd }}</span>
                  </div>
                  <div class="index__graphheader--info">
                    <label>24h Low</label>
                    <span>{{ twentyfourhourlowd }}</span>
                  </div>
                  <!--<div class="index__graphheader--info">
                    <label
                      >24h Volume <span class="uppercase">({{ basesymbol }})</span></label
                    >
                    <span>37,748.00</span>
                  </div>
                  <div class="index__graphheader--info">
                    <label
                      >24h Volume
                      <span class="uppercase">({{ quotesymbol }})</span></label
                    >
                    <span>37,748.00</span>
                  </div>-->
                </div>
                <div class="index__graphheader--btns index__graphheader--section">
                  <!--<span
                    class="index__graphheader--btn"
                    :class="{ currenttopic: graphdisplay === 'Candlestick Chart' }"
                    @click="setgraphdisplay('Candlestick Chart')"
                    >Candlestick Chart</span
                  >
                  <span
                    class="index__graphheader--btn"
                    :class="{ currenttopic: graphdisplay === 'Line Chart' }"
                    @click="setgraphdisplay('Line Chart')"
                    >Line Chart</span
                  >-->
                  <!-- <span
                    class="index__graphheader--btn"
                    :class="{ currenttopic: graphdisplay === 'Info' }"
                    @click="setgraphdisplay('Info')"
                    >Info</span
                  >
                  <span
                    class="index__graphheader--btn"
                    :class="{ currenttopic: graphdisplay === 'Trading Data' }"
                    @click="setgraphdisplay('Trading Data')"
                    >Trading Data</span
                  >-->
                </div>
                <div
                  class="index__graphheader--btns index__graphheader--section"
                  v-if="graphdisplay !== 'Candlestick Chart'"
                >
                  <span
                    class="index__graphheader--btn"
                    :class="{ currenttopic: currentgraphtimeline === '15M' }"
                    @click="setcurrentgraphtimeline('15M')"
                    >15M</span
                  >
                  <span
                    class="index__graphheader--btn"
                    :class="{ currenttopic: currentgraphtimeline === '1H' }"
                    @click="setcurrentgraphtimeline('1H')"
                    >1H</span
                  >
                  <span
                    class="index__graphheader--btn"
                    :class="{ currenttopic: currentgraphtimeline === '4H' }"
                    @click="setcurrentgraphtimeline('4H')"
                    >4H</span
                  >
                  <span
                    class="index__graphheader--btn"
                    :class="{ currenttopic: currentgraphtimeline === '1D' }"
                    @click="setcurrentgraphtimeline('1D')"
                    >1D</span
                  >
                  <!--<span
                    class="index__graphheader--btn"
                    :class="{ currenttopic: currentgraphtimeline === '1W' }"
                    @click="setcurrentgraphtimeline('1W')"
                    >1W</span
                  >-->
                </div>
              </div>
              <div class="index__grapharea">
                <TradingViewGraph :currentpair="currentpair" />
                <!--<div v-if="currentpairorders.length && graphdisplay === 'Line Chart'">
                  <PairGraph
                    :currentpair="currentpair"
                    :currentpairhourgraph="currentpairhourgraph"
                  />
                </div>
                <div
                  v-if="currentpairorders.length && graphdisplay === 'Candlestick Chart'"
                >
                  <CandleStickPairChart
                    :currentpair="currentpair"
                    :candlestickcurrentpairhourgraph="candlestickcurrentpairhourgraph"
                  />
                </div>-->
              </div>
              <!---->
              <SpotTradeArea
                :asset="asset"
                :currentpair="currentpair"
                :walletTradingFrom="walletTradingFrom"
              />
            </div>

            <div class="index__row right">
              <div class="index__list">
                <AssetTable
                  :pairs="assetpairs"
                  :setcurrentpair="setcurrentpair"
                  :setpairsview="setpairsview"
                  :pairview="pairview"
                  :currentpair="currentpair"
                />
              </div>
              <div class="index__header">
                <p class="color-primary">Market Trades</p>
              </div>
              <div class="index__list">
                <div v-if="currentpair">
                  <List
                    :type="'order book sell'"
                    :headers="[
                      'Price(USDT)',
                      `Amount(${asset ? asset.coin : ''})`,
                      'Total(USDT)',
                    ]"
                    :color="'#39FF14'"
                    :asset="asset"
                    :currentpair="currentpair"
                    :orders="pairbuyorders"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="index__body index__bottom">
        <div class="assetlistheader index__headertogglearea">
          <div
            class="assetlistheader__item index__headertogglearea--toggle"
            :class="{
              current: currentBottomView === 'openorders',
            }"
            @click="toggleBottomView('openorders')"
          >
            <label class="assetlistheader__item--label"
              >Open Orders ({{ openorders.length }})</label
            >
          </div>

          <div
            class="assetlistheader__item index__headertogglearea--toggle"
            :class="{
              current: currentBottomView === 'orderhistory',
            }"
            @click="toggleBottomView('orderhistory')"
          >
            <label class="assetlistheader__item--label"
              >Order History({{ orders.length }})</label
            >
          </div>

          <div
            class="assetlistheader__item index__headertogglearea--toggle"
            :class="{
              current: currentBottomView === 'tradehistory',
            }"
            @click="toggleBottomView('tradehistory')"
          >
            <label class="assetlistheader__item--label"
              >Trade History({{ tradehistory.length }})</label
            >
          </div>

          <div
            class="assetlistheader__item index__headertogglearea--toggle"
            :class="{
              current: currentBottomView === 'openpositions',
            }"
            @click="toggleBottomView('openpositions')"
          >
            <label class="assetlistheader__item--label"
              >Open Positions ({{ openpositions.length }})</label
            >
          </div>

          <div
            class="assetlistheader__item index__headertogglearea--toggle"
            :class="{
              current: currentBottomView === 'autotrades',
            }"
            @click="toggleBottomView('autotrades')"
          >
            <label class="assetlistheader__item--label"
              >Auto trades({{ autotrades.length }})</label
            >
          </div>
        </div>

        <div v-if="currentBottomView === 'openorders'">
          <OpenOrders :items="openorders" :cancelorder="cancelorder" />
        </div>

        <div v-if="currentBottomView === 'openpositions'">
          <OpenOrders :items="openpositions" :cancelorder="cancelorder" />
        </div>

        <div v-if="currentBottomView === 'orderhistory'">
          <OrderHistory :items="orderhistory" :cancelorder="cancelorder" />
        </div>

        <div v-if="currentBottomView === 'tradehistory'">
          <TradeHistory :items="tradehistory" />
        </div>

        <div v-if="currentBottomView === 'autotrades'">
          <AutoTrades :items="autotrades" :cancelautotrade="cancelautotrade" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import BASE_VARS from "@/store/base_vars";

const { BASE_URL } = BASE_VARS;

import cryptoassetsMixin from "@/mixins/cryptoassets";
import generalutilities from "@/mixins/generalutilities";

import pairsMixin from "@/mixins/pairs";

import socket from "~/plugins/socket";

export default {
  mixins: [cryptoassetsMixin, generalutilities, pairsMixin],
  data() {
    return {
      currentBottomView: "openorders", //orderhistory, tradehistory, openpositions
      currentpair: null,
      untradableasset: false,
      assetpairs: [],
      currentpairorders: [],
      asset: null,
      pairview: "all",
      currentpairhourgraph: [],
      candlestickcurrentpairhourgraph: [],
      candlestickdatalength: 100,
      currentgraphtimeline: "1D",
      graphdisplay: "Candlestick Chart",
      twentyfourhourchanged: "",
      twentyfourhourhighd: "",
      twentyfourhourlowd: "",

      //"MEXC:UNIUSDT.P"
      //MEXC:UNIETH
      //"MEXC:UNIUSDC"
    };
  },
  watch: {
    pairview() {
      //this.assetpairs = [];
    },
    graphdisplay(newval, oldval) {
      if (newval === "Candlestick Chart") {
        this.getcandlestickdatamins();
      } else {
        this.currentgraphtimeline = "1D";

        this.getpairpricehistorytwentyfourhours();
      }
    },
    currentpairorders(newval, oldval) {},
    assetpairs(newvalue, oldvalue) {
      const pairsymbol = this.$route.query.pairsymbol;

      if (!pairsymbol) {
        const pair = newvalue[0];

        this.setcurrentpair(pair);
      } else {
        const pair = this.assetpairs.find((assetpair) => assetpair.pair === pairsymbol);

        if (pair) {
          this.setcurrentpair(pair);
        } else {
          const pair = newvalue[0];

          this.setcurrentpair(pair);
        }
      }
    },
    currentpair(newvalue, oldvalue) {
      //this.getpairorders();
      this.getpairpricehistorytwentyfourhours();
      this.twentyfourhourchange();
      this.twentyfourhourhigh();
      this.twentyfourhourlow();

      //this.getcandlestickdatamins();

      if (oldvalue) {
        if (oldvalue._id !== newvalue._id) {
          socket.emit("pairoutofview", { pairid: oldvalue._id });
        }
      }

      socket.emit("pairinview", { pairid: this.currentpair._id });
    },
  },
  methods: {
    async cancelorder(orderid) {
      const token = localStorage.getItem("873__jh6bdjktoken");

      const response = await fetch(`${BASE_URL}/order/cancel?orderid=${orderid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const { message } = await response.json();

      this.getorders();
      this.gettrades();
      this.getautotrades();

      this.getwallets();
    },
    async cancelautotrade(autotradeid) {
      const token = localStorage.getItem("873__jh6bdjktoken");

      const response = await fetch(
        `${BASE_URL}/autotrade/cancel?autotradeid=${autotradeid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const { message } = await response.json();

      this.getorders();
      this.gettrades();
      this.getautotrades();

      this.getwallets();
    },
    getCharactersBeforeSlash(str) {
      const parts = str.split("/");
      return parts[0];
    },
    setcurrentgraphtimeline(timeline) {
      this.currentgraphtimeline = timeline;

      if (this.currentgraphtimeline === "4H") {
        this.getpairhistoryfourhours();
      }

      if (this.currentgraphtimeline === "1D") {
        this.getpairpricehistorytwentyfourhours();
      }

      if (this.currentgraphtimeline === "1H") {
        this.getpairhistoryonehour();
      }

      if (this.currentgraphtimeline === "15M") {
        this.getpairpricehistoryfifteenmin();
      }
    },
    setgraphdisplay(display) {
      this.graphdisplay = display;
    },
    ...mapActions("trade", []),
    ...mapActions("order", ["getorders", "getautotrades", "gettrades"]),
    ...mapActions("wallet", ["getwallets"]),
    setpairsview(pairview) {
      //this.assetpairs = [];
      this.pairview = pairview;

      //this.getassetpairs();
      //this.getassetpairsvtwo();
    },
    setcurrentpair(pair) {
      this.currentpair = pair;

      const { assets } = this;

      //console.log(assets);

      const asset = assets.find(
        (asset) => asset.coin === this.getCharactersBeforeSlash(this.currentpair.pair)
      );

      //console.log(asset);
      this.asset = asset;

      this.$router.push({
        query: {
          ...this.$route.query,
          ...{
            pairsymbol: this.currentpair.pair,
            baseAsset: this.asset.coin,
            assettype: this.asset.assetType,
            asset: this.asset._id,
          },
        },
      });
    },
    async getpairpricehistoryfifteenmin() {
      const pairid = this.currentpair._id;
      const token = localStorage.getItem("873__jh6bdjktoken");

      const response = await fetch(
        `${BASE_URL}/pair/pricehistory/fifteenmin?pairid=${pairid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const { mins } = await response.json();

      this.currentpairhourgraph = mins;
    },
    async getpairhistoryonehour() {
      const pairid = this.currentpair._id;
      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${BASE_URL}/pair/pricehistory/onehour?pairid=${pairid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { mins } = await response.json();

        this.currentpairhourgraph = mins;
      } catch (error) {
        console.log(error);
      }
    },
    async twentyfourhourchange() {
      const assetid = this.asset._id;
      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${BASE_URL}/asset/twentyfourhourchange?assetid=${assetid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { data } = await response.json();

        this.twentyfourhourchanged = data;
      } catch (error) {
        console.log(error);
      }
    },
    async twentyfourhourhigh() {
      const assetid = this.asset._id;
      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${BASE_URL}/asset/twentyfourhourhigh?assetid=${assetid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { data } = await response.json();

        this.twentyfourhourhighd = data;
      } catch (error) {
        console.log(error);
      }
    },
    async twentyfourhourlow() {
      const assetid = this.asset._id;
      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${BASE_URL}/asset/twentyfourhourlow?assetid=${assetid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { data } = await response.json();

        this.twentyfourhourlowd = data;
      } catch (error) {
        console.log(error);
      }
    },
    async getpairhistoryfourhours() {
      const pairid = this.currentpair._id;
      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${BASE_URL}/pair/pricehistory/fourhours?pairid=${pairid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { hours } = await response.json();

        this.currentpairhourgraph = hours;
      } catch (error) {
        console.log(error);
      }
    },
    async getcandlestickdata() {
      const pairid = this.currentpair._id;
      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${BASE_URL}/pair/pricehistory/hours/candlestick?pairid=${pairid}&candlestickdatalength=${this.candlestickdatalength}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { candlestickdata } = await response.json();

        this.candlestickcurrentpairhourgraph = candlestickdata;

        //console.log(this.candlestickcurrentpairhourgraph, "check");
      } catch (error) {
        console.log(error);
      }
    },
    async getcandlestickdatamins() {
      const pairid = this.currentpair._id;
      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${BASE_URL}/pair/pricehistory/mins/candlestick?pairid=${pairid}&candlestickdatalength=${this.candlestickdatalength}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        //https://api.binance.com/api/v3/klines?symbol=ETHBTC&interval=1m&limit=1000

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { candlestickdata } = await response.json();

        //console.log(candlestickdata);

        this.candlestickcurrentpairhourgraph = candlestickdata;

        //console.log(this.candlestickcurrentpairhourgraph, "check");
      } catch (error) {
        console.log(error);
      }
    },
    async getpairpricehistorytwentyfourhours() {
      const pairid = this.currentpair._id;
      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${BASE_URL}/pair/pricehistory/hours?pairid=${pairid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { hours } = await response.json();

        this.currentpairhourgraph = hours;
      } catch (error) {
        console.log(error);
      }
    },
    async getpairhistoryoneweek() {},
    async getpairorders() {
      const pairid = this.currentpair._id;
      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(`${BASE_URL}/pair/orders?pairid=${pairid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { orders } = await response.json();
        //console.log(orders);

        this.currentpairorders = orders;
      } catch (error) {
        console.log(error);
      }
    },
    toggleBottomView(toggle) {
      this.currentBottomView = toggle;
    },
    async getasset() {
      const assetid = this.$route.query.asset;
      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(`${BASE_URL}/asset?assetid=${assetid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { asset } = await response.json();

        this.asset = asset;
      } catch (error) {
        console.log(error);
      }
    },
    async getassetpairsvtwo() {
      const asset = this.$route.query.baseAsset;
      const token = localStorage.getItem("873__jh6bdjktoken");
      const url = `${BASE_URL}/pairs/by-base-vtwo?baseAsset=${asset}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { pairs } = await response.json();

        pairs.forEach((pair) => {
          if (this.includedpairs.includes(pair.pair)) {
            const label = this.pairslist.filter(
              (pairlistitem) => pairlistitem.pair === pair.pair
            );

            pair.pairlabel = label[0].pairlabel;
          }
        });

        this.assetpairs = pairs;
      } catch (error) {
        console.log(error);
      }
    },
    async getassetpairs(pairid) {
      const asset = this.$route.query.baseAsset;
      const token = localStorage.getItem("873__jh6bdjktoken");
      let url;

      if (this.pairview === "all") {
        url = `${BASE_URL}/pairs/by-base?baseAsset=${asset}`;
      } else if (this.pairview === "favorites") {
      } else {
        url = `${BASE_URL}/pairs/by-base?baseAsset=${asset}&assetType=${this.pairview}`;
      }

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { pairs } = await response.json();

        const filtpr = [];

        pairs.forEach((pair) => {
          if (this.includedpairs.includes(pair.pair)) {
            const label = this.pairslist.filter(
              (pairlistitem) => pairlistitem.pair === pair.pair
            );

            pair.pairlabel = label[0].pairlabel;

            filtpr.push(pair);
          }
        });

        this.assetpairs = filtpr;
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    ...mapState({
      orders: (state) => state.order.orders,
      autotrades: (state) => state.order.autotrades,
      trades: (state) => state.order.trades,
    }),
    pairsellorders() {
      let pairsellorders = this.currentpairorders.filter(
        (order) => order.side === "sell"
      );

      let maxAmount = Math.max(...pairsellorders.map((item) => item.amount));
      let minAmount = Math.min(...pairsellorders.map((item) => item.amount));

      pairsellorders = pairsellorders.map((item) => {
        let hierarchyPercentage =
          ((item.amount - minAmount) / (maxAmount - minAmount)) * 100;

        return {
          ...item,
          hierarchyPercentage: hierarchyPercentage.toFixed(2),
        };
      });

      return pairsellorders;
    },
    pairbuyorders() {
      let pairbuyorders = this.currentpairorders.filter((order) => order.side === "buy");

      let maxAmount = Math.max(...pairbuyorders.map((item) => item.amount));
      let minAmount = Math.min(...pairbuyorders.map((item) => item.amount));

      pairbuyorders = pairbuyorders.map((item) => {
        let hierarchyPercentage =
          ((item.amount - minAmount) / (maxAmount - minAmount)) * 100;

        return {
          ...item,
          hierarchyPercentage: hierarchyPercentage.toFixed(2),
        };
      });

      return pairbuyorders;
    },
    openorders() {
      const { orders } = this;
      const openorders = orders.filter((order) => order.filled === 0);
      return openorders;
    },
    orderhistory() {
      const { orders } = this;
      return orders;
    },
    tradehistory() {
      const { orders } = this;
      const openorders = orders.filter((order) => order.filled === 100);
      return openorders;
    },
    openpositions() {
      const { orders } = this;
      const openorders = orders.filter(
        (order) => order.filled !== 100 && order.filled > 0
      );
      return openorders;
    },
    autotrader() {
      const autotraderon = this.$route.query.autotrader === "true" ? true : false;
      return autotraderon;
    },
    walletTradingFrom() {
      return this.$route.query.wallet;
    },
    basesymbol() {
      if (this.currentpair) {
        const basesymbol = this.currentpair.pair.split("/")[0].toLowerCase();

        return basesymbol;
      } else {
        return "";
      }
    },
    quotesymbol() {
      if (this.currentpair) {
        const quotesymbol = this.currentpair.pair.split("/")[1].toLowerCase();

        return quotesymbol;
      } else {
        return "";
      }
    },
  },
  mounted() {
    this.getorders();
    this.gettrades();
    this.getautotrades();

    this.getwallets();

    this.getasset();
    //this.getassetpairs();
    this.getassetpairsvtwo();

    socket.on("getorders", () => {
      if (this.currentpair) {
        if (this.currentpair._id) {
          this.getpairorders();
        }
      }
    });

    socket.on("assetupdate", () => {
      this.getasset();
      this.twentyfourhourchange();
      this.twentyfourhourhigh();
      this.twentyfourhourlow();
    });
  },
  beforeDestroy() {
    socket.emit("pairoutofview", { pairid: this.currentpair._id });
    socket.off("getorders");
    socket.off("assetupdate");
  },
  beforeRouteLeave(to, from, next) {
    socket.emit("pairoutofview", { pairid: this.currentpair._id });
    socket.off("getorders");
    socket.off("assetupdate");
    next();
  },
};
</script>
