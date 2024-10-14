<template>
  <div>
    <div class="assetlistheader index__headerarea">
      <div class="assetlistheader__item index__headerarea--menuitem smaller">
        <label class="assetlistheader__item--label green-usdt fontWeight600"
          >Trading Pair</label
        >
      </div>

      <div class="assetlistheader__item index__headerarea--menuitem smaller">
        <label class="assetlistheader__item--label green-usdt fontWeight600">Date</label>
      </div>

      <div class="assetlistheader__item index__headerarea--menuitem smaller">
        <label class="assetlistheader__item--label green-usdt fontWeight600">Type</label>
      </div>

      <div class="assetlistheader__item index__headerarea--menuitem smaller">
        <label class="assetlistheader__item--label green-usdt fontWeight600">Side</label>
      </div>

      <div class="assetlistheader__item index__headerarea--menuitem">
        <label class="assetlistheader__item--label green-usdt fontWeight600">Price</label>
      </div>

      <div class="assetlistheader__item index__headerarea--menuitem bignum">
        <label class="assetlistheader__item--label green-usdt fontWeight600"
          >Quantity</label
        >
      </div>

      <div class="assetlistheader__item index__headerarea--menuitem bignum">
        <label class="assetlistheader__item--label green-usdt fontWeight600"
          >Order Amount</label
        >
      </div>

      <div class="assetlistheader__item index__headerarea--menuitem">
        <label class="assetlistheader__item--label green-usdt fontWeight600"
          >Filled</label
        >
      </div>

      <div class="assetlistheader__item index__headerarea--menuitem">
        <label class="assetlistheader__item--label green-usdt fontWeight600"
          >Cancel all</label
        >
      </div>
    </div>

    <div
      class="assetlistheader index__headerarea lightblue-background"
      v-for="item in items"
    >
      <div class="assetlistheader__item index__headerarea--menuitem smaller">
        <label class="assetlistheader__item--label neon-yellow">{{
          item.tradingPair
        }}</label>
      </div>

      <div class="assetlistheader__item index__headerarea--menuitem smaller">
        <label class="assetlistheader__item--label">{{ formatDate(item.date) }}</label>
      </div>

      <div class="assetlistheader__item index__headerarea--menuitem smaller">
        <label class="assetlistheader__item--label capitalize neon-blue fontWeight600">{{
          item.type
        }}</label>
      </div>

      <div class="assetlistheader__item index__headerarea--menuitem smaller">
        <label
          class="assetlistheader__item--label capitalize fontWeight600"
          :class="{
            'landing-green': item.side === 'buy',
            'neon-orange': item.side === 'sell',
          }"
          >{{ item.side }}</label
        >
      </div>

      <div class="assetlistheader__item index__headerarea--menuitem">
        <label class="assetlistheader__item--label neon-blue">${{ item.price }}</label>
      </div>

      <div
        class="assetlistheader__item index__headerarea--menuitem bignum"
        v-if="item.side === 'buy'"
      >
        <label class="assetlistheader__item--label gold-colored">{{
          item.quantity
        }}</label>
      </div>

      <div
        class="assetlistheader__item index__headerarea--menuitem bignum"
        v-if="item.side === 'sell'"
      >
        <label class="assetlistheader__item--label gold-colored">{{ item.total }}</label>
      </div>

      <div
        class="assetlistheader__item index__headerarea--menuitem bignum"
        v-if="item.side === 'buy'"
      >
        <label class="assetlistheader__item--label neon-green"
          >${{ item.quantity * item.price }}</label
        >
      </div>

      <div
        class="assetlistheader__item index__headerarea--menuitem bignum"
        v-if="item.side === 'sell'"
      >
        <label class="assetlistheader__item--label neon-green"
          >${{ item.total * item.price }}</label
        >
      </div>

      <div class="assetlistheader__item index__headerarea--menuitem">
        <label class="assetlistheader__item--label">{{ item.filled }}%</label>
      </div>

      <div class="assetlistheader__item index__headerarea--menuitem">
        <div v-if="item.status !== 'canceled'">
          <label
            class="assetlistheader__item--label warning-red"
            v-if="item.type !== 'market' || item.filled !== 100"
            @click="cancelorder(item._id)"
            >Cancel</label
          >
        </div>
        <div v-if="item.status === 'canceled'">
          <label
            class="assetlistheader__item--label dull-text"
            @click="cancelorder(item._id)"
            >Cancelled</label
          >
        </div>
        <div v-if="item.filled === 100">
          <label
            class="assetlistheader__item--label green-usdt"
            >Executed</label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import generalutilities from "@/mixins/generalutilities";
import globalutilities from "@/mixins/global";

export default {
  props: ["items", "cancelorder"],
  mixins: [generalutilities, globalutilities],
};
</script>
