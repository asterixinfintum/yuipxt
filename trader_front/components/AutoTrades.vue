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

      <div class="assetlistheader__item index__headerarea--menuitem smaller">
        <label class="assetlistheader__item--label green-usdt fontWeight600"
          >Cancel all</label
        >
      </div>
    </div>

    <div class="assetlistheader index__headerarea lightblue-background" v-for="item in items">
      <div class="assetlistheader__item index__headerarea--menuitem smaller">
        <label class="assetlistheader__item--label neon-yellow">{{
          item.tradingPair
        }}</label>
      </div>

      <div class="assetlistheader__item index__headerarea--menuitem smaller">
        <label class="assetlistheader__item--label">{{ formatDate(item.date) }}</label>
      </div>

      <div class="assetlistheader__item index__headerarea--menuitem bignum">
        <label class="assetlistheader__item--label">{{ item.quantity }}</label>
      </div>

      <div class="assetlistheader__item index__headerarea--menuitem bignum">
        <label class="assetlistheader__item--label">{{ item.total }}</label>
      </div>

      <div class="assetlistheader__item index__headerarea--menuitem smaller" v-if="item.status === 'running'">
        <label class="assetlistheader__item--label warning-red" @click="cancelautotrade(item._id)">Cancel</label>
      </div>

      <div class="assetlistheader__item index__headerarea--menuitem smaller" v-if="item.status !== 'running'">
        <label class="assetlistheader__item--label dull-text" @click="cancelautotrade(item._id)">Cancelled</label>
      </div>
      
    </div>
  </div>
</template>

<script>
import generalutilities from "@/mixins/generalutilities";
import globalutilities from "@/mixins/global";

export default {
  props: ["items", "cancelautotrade"],
  mixins: [generalutilities, globalutilities],
};
</script>
