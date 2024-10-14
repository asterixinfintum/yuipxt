<template>
  <div>
    <div class="assetsearch">
      <div class="assetsearch__head">
        <div class="assetsearch__inputarea assetsearch__margin-right">
          <div class="assetsearch__inputarea--svg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              class="css-1gixs0r"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11 6a5 5 0 110 10 5 5 0 010-10zm0-3a8 8 0 017.021 11.838l3.07 3.07-1.59 1.591-1.591 1.591-3.07-3.07A8 8 0 1111 3z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <div class="assetsearch__inputarea--input">
            <input placeholder="Search Asset" v-model="searchInput" />
          </div>
        </div>

        <div class="assetsearch__checkboxarea assetsearch__margin-right">
          <input type="checkbox" v-model="hideemptybalances" />
          <p
            @click="
              hideemptybalances ? (hideemptybalances = false) : (hideemptybalances = true)
            "
          >
            Hide Empty Balances
          </p>
        </div>

        <div
          class="assetsearch__underlinedlink assetsearch__margin-right"
          :class="{ faint: assettype !== 'commodity' }"
          @click="setCurrentCategory('commodity')"
        >
          <p>Commodities</p>
        </div>

        <div
          class="assetsearch__underlinedlink assetsearch__margin-right"
          :class="{ faint: assettype !== 'stock' }"
          @click="setCurrentCategory('stock')"
        >
          <p>Stocks</p>
        </div>

        <div
          class="assetsearch__underlinedlink assetsearch__margin-right"
          :class="{ faint: assettype !== 'crypto' }"
          @click="setCurrentCategory('crypto')"
        >
          <p>Crypto</p>
        </div>

        <div
          class="assetsearch__underlinedlink assetsearch__margin-right"
          :class="{ faint: assettype !== 'fiat' }"
          @click="setCurrentCategory('fiat')"
        >
          <p>Fiat</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  props: [
    "walletid",
    "start",
    "end",
    "setassetclass",
    "setsearchInput",
    "togglehideemptybalances",
  ],
  data() {
    return {
      searchInput: "",
      assettype: "commodity",
      hideemptybalances: false,
    };
  },
  mounted() {
    this.pageSize = 20;
  },
  computed: {
    ...mapState({
      client: (state) => state.auth.client,
      userwallets: (state) => state.userwallet.userwalletss,
    }),
  },
  methods: {
    ...mapActions("userwallet", ["getuserwallet"]),
    setCurrentCategory(assettype) {
      this.assettype = assettype;
      this.setassetclass(assettype);
    },
  },
  watch: {
    hideemptybalances(newValue, oldValue) {
      this.togglehideemptybalances(newValue);
    },
    assettype() {
      this.getuserwallet({
        walletid: this.walletid,
        assettype: this.assettype,
        start: this.start,
        end: this.end,
      });
    },
    searchInput(newValue, oldValue) {
      this.setsearchInput(newValue);

      if (!newValue.length) {
        this.getuserwallet({
          walletid: this.walletid,
          assettype: this.assettype,
          start: this.start,
          end: this.end,
        });

        return;
      }

      this.getuserwallet({
        walletid: this.walletid,
        assettype: this.assettype,
        start: this.start,
        end: this.end,
        searchquery: newValue,
      });
    },
  },
};
</script>

<style lang="scss">
.assetsearch {
  margin-bottom: #{scaleValue(25)};

  &__head {
    display: flex;
    align-items: center;

    @media only screen and (max-width: 414px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__margin-right {
    margin-right: #{scaleValue(30)};
    font-size: #{scaleValue(14)};

    @media only screen and (max-width: 414px) {
      font-size: #{scaleValue(55)};
      margin-right: #{scaleValue(100)};
    }
  }

  &__inputarea {
    border: $border;
    border-radius: #{scaleValue(6)};
    display: flex;
    align-items: center;
    height: #{scaleValue(38)};
    padding-left: #{scaleValue(13)};

    @media only screen and (max-width: 414px) {
      width: #{scaleValue(1000)};
      height: #{scaleValue(180)};
      padding-left: #{scaleValue(50)};
      margin-bottom: #{scaleValue(50)};
    }

    &--svg {
      margin-right: #{scaleValue(8)};
      height: 100%;
      display: flex;
      align-items: center;

      @media only screen and (max-width: 414px) {
        margin-right: #{scaleValue(20)};
      }

      & svg {
        height: #{scaleValue(19)};
        width: #{scaleValue(19)};
        fill: $white;
        opacity: 0.6;

        @media only screen and (max-width: 414px) {
          height: #{scaleValue(60)};
          width: #{scaleValue(60)};
        }
      }
    }

    &--input {
      & input {
        border: none;
        outline: none;
        height: 100%;
        background: transparent;
        width: #{scaleValue(200)};
        padding-right: #{scaleValue(13)};
        color: $white;
        font-size: #{scaleValue(14)};

        @media only screen and (max-width: 414px) {
          width: #{scaleValue(1000)};
          font-size: #{scaleValue(60)};
        }
      }
    }
  }

  &__checkboxarea {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    cursor: pointer;

    @media only screen and (max-width: 414px) {
      margin-bottom: #{scaleValue(60)};
    }

    & input {
      margin-right: #{scaleValue(8)};
      background: transparent;
      transform: translateY(#{scaleValue(-3)});

      &.lessopacity {
        transform: none;
      }
    }

    & p {
      opacity: 0.6;
      border-bottom: $dashed-border;
      padding-bottom: #{scaleValue(4)};

      &.lessopacity {
        opacity: 0.9;
        border-bottom: none;
        padding-bottom: 0;
      }
    }
  }

  &__underlinedlink {
    cursor: pointer;
    text-decoration: underline;
    color: $gold;

    &.faint {
      opacity: 0.3;
    }

    @media only screen and (max-width: 414px) {
      margin-bottom: #{scaleValue(60)};
    }
  }
}
</style>
