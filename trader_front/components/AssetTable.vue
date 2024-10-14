<template>
  <div class="assettable">
    <div class="assettable__headersection">
      <div class="assettable__search">
        <span class="assettable__search--icon">
          <svg
            class="sc-aXZVg ktFCMi mx-icon iconfont iconsearch"
            focusable="false"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
            viewBox="0 0 16 16"
            data-icon="SearchOutlined"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9.93186 10.8786C9.02879 11.5806 7.89393 11.9987 6.66146 11.9987C3.71594 11.9987 1.32812 9.6109 1.32812 6.66536C1.32812 3.71984 3.71594 1.33203 6.66146 1.33203C9.60699 1.33203 11.9948 3.71984 11.9948 6.66536C11.9948 7.89783 11.5767 9.0327 10.8747 9.93576L14.4662 13.5273C14.7265 13.7876 14.7265 14.2098 14.4662 14.4701C14.2059 14.7304 13.7837 14.7304 13.5234 14.4701L9.93186 10.8786ZM10.6615 6.66536C10.6615 8.8745 8.87059 10.6654 6.66146 10.6654C4.45232 10.6654 2.66146 8.8745 2.66146 6.66536C2.66146 4.45622 4.45232 2.66536 6.66146 2.66536C8.87059 2.66536 10.6615 4.45622 10.6615 6.66536Z"
            ></path>
          </svg>
        </span>
        <span class="assettable__search--input">
          <input placeholder="Search" v-model="searchinput" />
        </span>
      </div>

      <div class="assettable__header">
        <!--<span
          class="assettable__header--item"
          @click="toggleview('favorites')"
          :class="{ currentview: pairview === 'favorites' }"
          >Favorites</span
        >-->
        <span
          class="assettable__header--item"
          @click="toggleview('all')"
          :class="{ currentview: pairview === 'all' }"
          >All</span
        >
        <span
          class="assettable__header--item"
          @click="toggleview('crypto')"
          :class="{ currentview: pairview === 'crypto' }"
          >Crypto</span
        >
        <span
          class="assettable__header--item"
          @click="toggleview('stock')"
          :class="{ currentview: pairview === 'stock' }"
          >Stocks</span
        >
        <span
          class="assettable__header--item"
          @click="toggleview('commodity')"
          :class="{ currentview: pairview === 'commodity' }"
          >Commodities</span
        >
      </div>

      <div class="assettable__item header-area">
        <div class="assettable__star">
          <span class="invisible">
            <svg
              class="sc-aXZVg ktFCMi mx-icon iconfont icondefault"
              focusable="false"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
              viewBox="0 0 1024 1024"
              data-icon="StarFilled"
            >
              <path
                d="M908.096 353.088l-253.888-36.864-113.536-230.08a32.128 32.128 0 0 0-57.408 0L369.792 316.16l-253.888 36.864a32 32 0 0 0-17.728 54.656l183.68 179.072-43.392 252.864a32 32 0 0 0 46.4 33.728L512 753.984l227.072 119.424a32 32 0 0 0 46.4-33.728l-43.392-252.864 183.68-179.072a31.936 31.936 0 0 0-17.664-54.656z"
              ></path>
            </svg>
          </span>
        </div>
        <div class="assettable__itemarea symbol">
          <div class="assettable__itemarea--top assettable__itemarea--bottom">
            <span>Pair</span>
          </div>
        </div>
        <div class="assettable__itemarea figures">
          <div class="assettable__itemarea--top assettable__itemarea--bottom">Price</div>
        </div>
        <div class="assettable__lastarea">
          <div class="assettable__itemarea">
            <div class="assettable__itemarea--top assettable__itemarea--bottom">
              Change
            </div>
          </div>
          <div class="assettable__star header-area">
            <span>
              <svg
                class="sc-aXZVg ktFCMi mx-icon iconfont icondefault"
                focusable="false"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
                viewBox="0 0 1024 1024"
                data-icon="StarFilled"
              >
                <path
                  d="M908.096 353.088l-253.888-36.864-113.536-230.08a32.128 32.128 0 0 0-57.408 0L369.792 316.16l-253.888 36.864a32 32 0 0 0-17.728 54.656l183.68 179.072-43.392 252.864a32 32 0 0 0 46.4 33.728L512 753.984l227.072 119.424a32 32 0 0 0 46.4-33.728l-43.392-252.864 183.68-179.072a31.936 31.936 0 0 0-17.664-54.656z"
                ></path>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="assettable__list">
      <div>
        <div
          class="assettable__item item-body"
          v-for="pair in currentpairs"
          @click="setcurrentpair(pair)"
          :class="{ current: currentpair._id === pair._id }"
        >
          <div class="assettable__star">
            <span>
              <svg
                class="sc-aXZVg ktFCMi mx-icon iconfont icondefault"
                focusable="false"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
                viewBox="0 0 1024 1024"
                data-icon="StarFilled"
              >
                <path
                  d="M908.096 353.088l-253.888-36.864-113.536-230.08a32.128 32.128 0 0 0-57.408 0L369.792 316.16l-253.888 36.864a32 32 0 0 0-17.728 54.656l183.68 179.072-43.392 252.864a32 32 0 0 0 46.4 33.728L512 753.984l227.072 119.424a32 32 0 0 0 46.4-33.728l-43.392-252.864 183.68-179.072a31.936 31.936 0 0 0-17.664-54.656z"
                ></path>
              </svg>
            </span>
          </div>
          <div class="assettable__itemarea symbol">
            <div class="assettable__itemarea--top neon-blue">
              <span class="uppercase">{{ pair.pair }}</span>
            </div>
          </div>

          <div class="assettable__itemarea figures">
            <div class="assettable__itemarea--top">
              {{ roundUpToFourDecimalPlaces(pair.price) }}
            </div>
          </div>

          <div class="assettable__lastarea">
            <div class="assettable__itemarea">
              <div
                class="assettable__itemarea--top neon-orange"
                :class="{
                  'neon-green': containsPlusOrMinus(`${pair.pricedifference}`),
                }"
              >
                {{ pair.pricedifference }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cryptoassetsMixin from "@/mixins/cryptoassets";
import generalutilities from "@/mixins/generalutilities";

import pairsMixin from "@/mixins/pairs";

export default {
  data() {
    return {
      searchinput: "",
    };
  },
  props: ["asset", "pairs", "setcurrentpair", "setpairsview", "pairview", "currentpair"],
  mixins: [cryptoassetsMixin, generalutilities],
  watch: {
    pairview(newval, oldval) {
      this.searchinput = "";
    }
  },
  computed: {
    walletType() {
      return this.$route.query.wallet;
    },
    currentpairs() {
      const { searchinput } = this;

      if (this.pairs && this.pairs.length) {
        if (searchinput.length) {
          const filtered = this.pairs.filter((pair) =>
            pair.pair.toLowerCase().includes(searchinput.toLowerCase().trim())
          );

          if (this.pairview !== "all") {
            const filteredontypes = filtered.filter(
              (pair) => pair.baseAssetType === this.pairview
            );

            return filteredontypes;
          }

          return filtered;
        }

        if (this.pairview !== "all") {
            const filteredontypes = this.pairs.filter(
              (pair) => pair.baseAssetType === this.pairview
            );

            return filteredontypes;
          }

        return this.pairs;
      } else {
        return [];
      }
    },
  },
  methods: {
    roundUpToFourDecimalPlaces(number) {
      return Math.ceil(number * 10000) / 10000;
    },
    toggleview(currentview) {
      console.log(currentview);
      this.setpairsview(currentview);
    },
    containsPlusOrMinus(str) {
      return str.includes("+") || str.includes("-");
    },
  },
};
</script>

<style lang="scss" scoped>
.assettable {
  margin-bottom: #{scaleValue(12)};
  border-bottom: $border;
  position: relative;

  &__headersection {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 3;
    background: $index-body;
  }

  &__search {
    border: $border;
    padding: #{scaleValue(8)};
    border-radius: #{scaleValue(6)};

    &:hover {
      border: $colored-border;
    }

    &--icon {
      & svg {
        height: #{scaleValue(12)};
        width: #{scaleValue(12)};
        transform: translateY(2px);
        opacity: 0.7;
      }
    }

    &--input {
      & input {
        @include input;
      }
    }
  }

  &__item {
    @include flex-align;
    font-size: #{scaleValue(11)};
    margin-bottom: #{scaleValue(12)};
    cursor: pointer;
    transition: all 0.5s ease;
    padding: #{scaleValue(5)} #{scaleValue(5)};

    &.item-body {
      margin: 0;

      &:hover {
        background: rgba($primary-color, 0.06);
      }
    }

    &.header-area {
      border-bottom: $border;
    }

    &.current {
      background: rgba($primary-color, 0.2) !important;
    }
  }

  &__list {
    padding-top: #{scaleValue(130)};
    position: relative;
    height: #{scaleValue(400)};
    overflow: hidden;
    overflow-y: scroll;
  }

  &__header {
    font-size: #{scaleValue(11)};
    margin-bottom: #{scaleValue(12)};
    border-bottom: $border;
    padding: #{scaleValue(12)} 0;

    &--item {
      cursor: pointer;
      margin-right: #{scaleValue(14)};
    }
  }

  &__lastarea {
    @include flex-align;
    width: #{scaleValue(40)};
  }

  &__itemarea {
    display: flex;

    width: #{scaleValue(60)};
    overflow: hidden;
    flex-shrink: 0;
    @include flex-align;

    &.symbol {
      width: #{scaleValue(110)};
    }

    &.figures {
      width: #{scaleValue(110)};
    }

    &--top {
      margin-bottom: #{scaleValue(6)};

      &.commodities-name {
        height: #{scaleValue(30)};
        color: $landing-green;
      }

      & span {
        &:nth-child(2) {
          opacity: 0.5;
        }

        &:nth-child(3) {
          opacity: 0.5;
        }
      }
    }

    &--bottom {
      opacity: 0.5;
    }
  }

  &__star {
    margin-left: #{scaleValue(7)};
    opacity: 0.4;
    cursor: pointer;

    transform: translateY(#{scaleValue(-2)});

    &.header-area {
      opacity: 0;
    }
  }

  .currentview {
    color: $primary-color;
  }

  .green {
    color: $green;
  }

  .red {
    color: $red;
  }

  .blue {
    color: $primary-color;
  }
}
</style>
