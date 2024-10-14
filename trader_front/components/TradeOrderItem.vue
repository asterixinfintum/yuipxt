<template>
  <div>
    <div v-if="order.orderdetails">
      <div>
        <div
          class="tradeorderitem"
          v-if="!order.orderdetails.automatic && order.ordertype !== 'Market'"
          :class="{ optionsopen }"
        >
          <span>12/01/2023</span>
          <span class="pair">{{ order.tradepair }}</span>
          <span class="ordertype">{{ order.ordertype }}</span>
          <span
            class="side"
            :class="{
              buy: order.orderdetails.side === 'buy',
              sell: order.orderdetails.side === 'sell',
            }"
            >{{ order.orderdetails.side }}</span
          >
          <span>${{ order.orderdetails.limit }}</span>
          <span>{{ order.orderdetails.amount }}</span>
          <span>{{ order.filled }}%</span>
          <span>${{ order.orderdetails.total }}</span>
          <span class="conditions">{{
            order.orderdetails.limit
              ? `At or below ${order.orderdetails.limit}`
              : "Market price"
          }}</span>
          <span
            class="cancelbtn fontSize11 hoveropacitytoggle"
            @click="toggleoptionsopen"
            v-if="!optionsopen && order.active"
            >Cancel</span
          >
          <span class="dull-text fontWeight600" v-if="!order.active">Cancelled</span>
        </div>

        <div class="tradeorderitem automatic-eight" v-if="order.orderdetails.automatic">
          <span>12/01/2023</span>
          <span class="pair">{{ order.tradepair }}</span>
          <span>{{ order.orderdetails.total }}</span>
          <span>${{ order.orderdetails.totalinvestment }}</span>
          <span class="green-usdt">+${{ order.profit }}</span>
          <span class="warning-red" :class="{ dim: order.loss === 0 }"
            >-${{ order.loss }}</span
          >
          <span>{{ ordertimeduration(order) }}</span>
          <div class="tradeorderitem__automaticactions">
            <span
              class="neon-blue fontSize11 pointer-cursor hoveropacitytoggle"
              @click="toggleviewautotrades"
              v-if="!autotradesvisible"
              >View Trades</span
            >

            <span
              class="neon-blue fontSize11 pointer-cursor hoveropacitytoggle"
              @click="toggleviewautotrades"
              v-if="autotradesvisible"
              >Close Trades</span
            >
            <span
              class="cancelbtn fontSize11 hoveropacitytoggle"
              @click="toggleoptionsopen"
              v-if="!optionsopen && order.active"
              >Cancel</span
            >
            <span class="dull-text fontWeight600 fontSize11" v-if="!order.active"
              >Cancelled</span
            >
          </div>
        </div>

        <div class="tradeorderitem automatic" v-if="order.ordertype === 'Market'">
          <span>12/01/2023</span>
          <span class="pair">{{ order.tradepair }}</span>
          <span class="ordertype">{{ order.ordertype }}</span>
          <span
            class="side"
            :class="{
              buy: order.orderdetails.side === 'buy',
              sell: order.orderdetails.side === 'sell',
            }"
            >{{ order.orderdetails.side }}</span
          >
          <span class="ordertype">${{ order.orderdetails.price }}</span>
          <span class="ordertype">{{
            order.orderdetails.side === "buy"
              ? order.orderdetails.amountfrom
              : order.orderdetails.amountto
          }}</span>
          <span class="ordertype">{{
            order.orderdetails.side === "buy"
              ? order.orderdetails.amountto
              : order.orderdetails.amountfrom
          }}</span>
        </div>
      </div>

      <div
        v-if="autotradesvisible && order.orderdetails.automatic"
        class="tradeorderitem__autotraderarea"
      >
        <div class="tradeorderitem__autotraderarea--header">
          <div>Date/Time</div>
          <div>Amount</div>
          <div>Price</div>
          <div>Side</div>
        </div>

        <div
          class="tradeorderitem__autotraderarea--header content"
          v-for="autotrade in autotrades"
        >
          <div class="neon-yellow">{{ autotrade.date }}</div>
          <div class="neon-blue">{{ autotrade.amount }}</div>
          <div class="neon-pink">${{ autotrade.price }}</div>
          <div
            class="buy"
            :class="{
              'neon-pink': autotrade.side === 'sell',
              'neon-green': autotrade.side === 'buy',
            }"
          >
            {{ autotrade.side }}
          </div>
        </div>
      </div>

      <div v-if="optionsopen" class="flex layout-padding-2 tradeorderitem__optionsopen">
        <div></div>
        <div>
          <p class="tradeorderitem__optionsopen--question warning-red">
            Would you like to cancel this trade?
          </p>
          <span
            class="tradeorderitem__optionsopen--answer yes neon-pink"
            @click="canceltrade(order._id)"
            >Yes</span
          >
          <span
            class="tradeorderitem__optionsopen--answer no neon-blue"
            @click="() => (optionsopen = false)"
            >No</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

import BASE_VARS from "@/store/base_vars";

const { BASE_URL } = BASE_VARS;

export default {
  data() {
    return {
      optionsopen: false,
      autotradesvisible: false,
      autotrades: [],
    };
  },
  props: ["ordertypemenu", "order", "gettradeorders"],
  watch: {
    autotradesvisible(newval, oldval) {
      if (newval) {
        this.getautotrades();

        setInterval(() => {
          this.getautotrades();
        }, 3000);
      }
    },
  },
  methods: {
    async getautotrades() {
      try {
        const token = localStorage.getItem("873__jh6bdjktoken");

        if (token) {
          const response = await fetch(
            `${BASE_URL}/trader/getautotrades?orderid=${this.order._id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
          }

          const result = await response.json();

          this.autotrades = result.orders;
        }
      } catch (error) {
        throw error;
      }
    },
    toggleoptionsopen() {
      this.optionsopen ? (this.optionsopen = false) : (this.optionsopen = true);
    },
    toggleviewautotrades() {
      this.autotradesvisible === true
        ? (this.autotradesvisible = false)
        : (this.autotradesvisible = true);
    },
    async canceltrade(orderid) {
      try {
        const token = localStorage.getItem("873__jh6bdjktoken");

        if (token) {
          const response = await fetch(
            `${BASE_URL}/trader/cancelorder?orderid=${orderid}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            this.optionsopen = false;

            this.gettradeorders();
          }
        }
      } catch (error) {
        throw error;
      }
    },
    ordertimeduration(order) {
      const item = order.orderdetails.selectedAutoTradeParams.find(
        (item) => item.label === "Time Period"
      );

      if (item) {
        return item.option;
      } else {
        return "not available";
      }
    },
  },
};
</script>

<style lang="scss">
.tradeorderitem {
  color: rgb(132, 142, 156);
  font-size: #{scaleValue(11)};
  padding: #{scaleValue(12)} 0;

  display: grid;
  grid-template-columns: repeat(10, 1fr);
  border-bottom: 0.3px solid rgba($neon-blue, 0.5);

  &.optionsopen {
    border-bottom: 0.3px solid rgba($neon-blue, 0);
  }

  & span {
    display: flex;
    align-items: center;
    font-size: #{scaleValue(12)};
    //background: red;
    //overflow-y: hidden;
    //overflow-x: scroll;

    &.pair {
      color: $gold;
      text-transform: uppercase;
    }

    &.side {
      text-transform: capitalize;
    }

    &.buy {
      color: $usdt-green;
    }

    &.sell {
      color: $neon-pink;
    }

    &.ordertype {
      color: $neon-blue;
    }

    &.conditions {
      color: $neon-yellow;
    }

    &.cancelbtn {
      display: inline-block;
      //background: $neon-pink;
      border-radius: 8px;
      //padding: #{scaleValue(10)} #{scaleValue(10)};
      //text-align: center !important;
      color: $white;
      cursor: pointer;

      color: $warning-red;
    }

    &:last-child {
      display: inline-block;
      text-align: right;
    }
  }

  &.automatic {
    grid-template-columns: repeat(7, 1fr);
  }

  &.automatic-eight {
    grid-template-columns: repeat(8, 1fr);
  }

  &__optionsopen {
    border-bottom: 0.3px solid rgba($neon-blue, 0.5);
    padding: #{scaleValue(12)} 0;

    &--question {
      font-size: #{scaleValue(12)};
      margin-bottom: #{scaleValue(12)};
    }

    &--answer {
      font-size: #{scaleValue(12)};
      cursor: pointer;
      margin-left: #{scaleValue(30)};
      opacity: 0.8;
      transition: all 0.5s ease;

      &:hover {
        opacity: 1;
      }
    }
  }

  &__automaticactions {
    display: flex;
    justify-content: space-between;
  }

  &__autotraderarea {
    padding: #{scaleValue(12)} 0;

    &--header {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      font-size: #{scaleValue(10)};
      margin-bottom: #{scaleValue(12)};
      color: rgba($gold, 0.4);

      &.content {
        border-bottom: 0.3px solid rgba($neon-orange, 0.2);
        padding-bottom: #{scaleValue(10)};
        margin: 0;
      }
    }
  }
}
</style>
