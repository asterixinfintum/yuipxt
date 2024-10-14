<template>
  <div class="list" :key="componentKey">
    <div class="list__headers list__item">
      <div class="list__item--section1">
        <div class="list__item--left">
          Price <span class="uppercase">({{ quotesymbol }})</span>
        </div>
      </div>

      <div class="list__item--section2">
        <div class="list__item--middle">
          Amount <span class="uppercase">({{ basesymbol }})</span>
        </div>
        <div class="list__item--right">Total</div>
      </div>
    </div>

    <div v-for="(order, index) in orders">
      <div
        class="list__item orderbookitem"
        v-if="order.price !== 0 && order.amount !== 0 && order.total !== 0"
      >
        <div
          class="list__item--colorcode"
          :style="{
            background: color,
            width: `${order.hierarchyPercentage}%`,
          }"
        ></div>
        <div class="list__item--section1">
          <div
            class="list__item--left"
            :style="{
              color,
            }"
          >
            {{ roundUpToFourDecimalPlaces(order.price) }}
          </div>
        </div>

        <div class="list__item--section2">
          <div class="list__item--middle">{{ order.amount }}</div>
          <div class="list__item--right">{{ order.total }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";

import generalutilities from "@/mixins/generalutilities";

export default {
  mixins: [generalutilities],
  props: ["type", "headers", "color", "asset", "interval", "currentpair", "orders"],
  data() {
    return {
      componentKey: 0,
    };
  },
  mounted() {},
  methods: {
    roundUpToFourDecimalPlaces(number) {
      return Math.ceil(number * 10000) / 10000;
    },
  },
  watch: {
    currentpair(newval, oldval) {
      //console.log(newval)
    },
    orders(newval, oldval) {
      //console.log(newval);
      this.componentKey++;
    },
  },
  computed: {
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
};
</script>

<style lang="scss" scoped>
@keyframes expandAndContract {
  0%,
  100% {
    transform: scaleX(0);
  }
  50% {
    transform: scaleX(1); // Original size
  }
}

.list {
  padding: #{scaleValue(10)} 0;
  height: #{scaleValue(450)};
  overflow-x: hidden;
  overflow-y: scroll;

  &__headers {
    @include flex-align;
    font-size: #{scaleValue(11)} !important;
    font-weight: 500;
    margin-bottom: #{scaleValue(10)};
    border-top: $border;
    border-bottom: $border;
    padding: #{scaleValue(10)} 0;
    opacity: 0.6;
  }

  &__item {
    @include flex-align;
    font-size: #{scaleValue(12)};
    font-weight: 500;
    margin-bottom: #{scaleValue(5)};

    position: relative;

    &--colorcode {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      opacity: 0.08;

      //transition: all 0.3s ease;

      animation: expandAndContract 0.3s ease-in-out;

      transform-origin: right;
    }

    &--section1 {
      @include flex-align;
      opacity: 0.9;
    }

    &--section2 {
      @include flex-align;
      opacity: 0.7;
    }

    &--left {
      overflow: hidden;
      width: #{scaleValue(100)};
      flex-shrink: 0;
    }

    &--middle {
      overflow: hidden;
      width: #{scaleValue(100)};
      flex-shrink: 0;
      margin-right: #{scaleValue(5)};
    }

    &--right {
      overflow: hidden;
      width: #{scaleValue(100)};
      flex-shrink: 0;
    }
  }

  .blue {
    color: $primary-color;
  }

  .green {
    color: $green;
  }
}
</style>
