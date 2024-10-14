<template>
  <div>
    <div class="overview">
      <div class="content">
        <TraderHeader />

        <div class="content__body">
          <div class="container">
            <SideNav />

            <div class="layout-stretch" v-if="client">
              <PageIndicator :page_name="'Wallet Overview'" />
              <div class="overview__main layout-padding" v-if="client.tailoreddashboard">
                <div class="overview__mainarea">
                  <div class="overview__balance" @click="$router.push('/fiatandspot')">
                    <h2 class="overview__mainareaonecard--h2">
                      <span class="label">Total BTC/USD</span>
                      <span class="value balance">{{
                        client.tailoreddashboard.spotwalletstate
                      }}</span>
                    </h2>
                    <div class="overview__balance--amount">
                      {{ formatNumberForSpecificLocale(spotwallet.btctotal)
                      }}<span class="slash">/</span
                      ><span class="green"
                        >${{ formatNumberForSpecificLocale(spotwallet.usdtotal) }}</span
                      >
                    </div>
                    <div class="overview__balance--wallet">Spot Wallet</div>
                  </div>
                  <div class="overview__balance" @click="$router.push('/margin')">
                    <h2 class="overview__mainareaonecard--h2">
                      <span class="label">Total BTC/USD</span>
                      <span class="value balance">{{
                        client.tailoreddashboard.marginwalletstate
                      }}</span>
                    </h2>
                    <div class="overview__balance--amount">
                      {{ formatNumberForSpecificLocale(marginwallet.btctotal)
                      }}<span class="slash">/</span
                      ><span class="green"
                        >${{ formatNumberForSpecificLocale(marginwallet.usdtotal) }}</span
                      >
                    </div>
                    <div class="overview__balance--wallet">Margin Wallet</div>
                  </div>
                </div>

                <div class="overview__mainarea column">
                  <div class="overview__mainarea--header">
                    <h2 class="overview__mainareaonecard--h2">
                      <span class="label">Top trades today</span>
                    </h2>
                  </div>

                  <div class="overview__mainarea--conveyor">
                    <div class="overview__mainarea--assetsgrid flex">
                      <div
                        class="overview__mainarea--asset toptrader leftphase"
                        :class="{ opacityzero }"
                        v-for="(toptrader, index) in toptraders"
                        :key="index"
                        :style="
                          index > 0 && leftphase
                            ? { transform: 'translateX(' + index * 103 + '%)' }
                            : {}
                        "
                      >
                        <div class="overview__mainarea--assettop">
                          <div class="overview__mainarea--assetleft">
                            <figure>
                              <img
                                src="https://rawcdn.githack.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
                              />
                            </figure>
                            <div class="overview__mainarea--assetprice">
                              <span class="label">Profit</span>
                              <span class="amount"
                                >${{ toptrader.profit }}
                                <span class="percent green"
                                  >+{{ toptrader.profitPercentage }}%</span
                                ></span
                              >
                            </div>
                          </div>
                          <div class="overview__mainarea--assetright">
                            <span class="label">Stake</span>
                            <span class="amount">${{ toptrader.stake }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="overview__mainarea">
                  <div class="overview__mainareaoneleft" v-if="client">
                    <div class="overview__mainareaonecard first">
                      <div
                        class="overview__mainareaonecard--report overview__mainareaonecard--reportdaily"
                      >
                        <h2 class="overview__mainareaonecard--h2">Daily report</h2>
                        <div class="overview__mainareaonecard--date">
                          {{ formatDate }}
                        </div>
                      </div>

                      <div class="overview__mainareaonecard--myprofit">
                        <div class="overview__mainareaonecard--myprofitarea">
                          <span class="myprofit">My profit</span>
                          <span class="myprofitdot">.</span>
                          <span class="myprofitpercentage green"
                            >{{ client.tailoreddashboard.myprofitpercent }}%</span
                          >
                        </div>
                        <div class="overview__mainareaonecard--myprofitarea">
                          <span class="dollarvalue"
                            >${{
                              formatNumberForSpecificLocale(
                                client.tailoreddashboard.myprofitvalue
                              )
                            }}</span
                          >
                        </div>
                        <div class="overview__mainareaonecard--myprofitarea">
                          <span
                            class="statement"
                            v-if="client.tailoreddashboard.profitsstate === 'profit'"
                            >Increased
                            <span
                              >{{
                                client.tailoreddashboard.myprofitpercentfromyesterday
                              }}%</span
                            >
                            from yesterday</span
                          >

                          <span
                            class="statement"
                            v-if="client.tailoreddashboard.profitsstate === 'loss'"
                            >Decreased
                            <span
                              >{{
                                client.tailoreddashboard.myprofitpercentfromyesterday
                              }}%</span
                            >
                            from yesterday</span
                          >
                        </div>
                      </div>
                    </div>

                    <div class="overview__mainareaonecard graphparent">
                      <div class="overview__mainareaonecard--report">
                        <h2 class="overview__mainareaonecard--h2">
                          <span class="label">Total Auto trade market statistics</span>
                          <span class="value twenthr">24hr</span>
                        </h2>
                        <div class="overview__mainareaonecard--percentage">
                          <span
                            class="percent"
                            :class="{
                              green:
                                client.tailoreddashboard.autotrademarketstate ===
                                'profit',
                              red:
                                client.tailoreddashboard.autotrademarketstate !==
                                'profit',
                            }"
                          >
                            {{
                              client.tailoreddashboard.autotrademarketstate === "profit"
                                ? "+"
                                : "-"
                            }}{{ client.tailoreddashboard.autotrademarketpercentage }}%
                          </span>
                          <span class="smallfigure"
                            >${{
                              formatNumberForSpecificLocale(
                                client.tailoreddashboard.autotrademarketfigure
                              )
                            }}</span
                          >
                        </div>

                        <div class="overview__mainareaonecard--graph">
                          <DashboardStatsGraph />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="overview__mainareaoneright overview__mainareaoneleft">
                    <div class="overview__mainareaonecard">
                      <div class="overview__mainareaonecard--report">
                        <h2 class="overview__mainareaonecard--h2">
                          <span class="label">Traders currently on network:</span>
                          <span class="value">{{
                            tradesboard ? tradesboard.onlinetraders : ""
                          }}</span>
                        </h2>
                        <div class="overview__mainareaonecard--learnmore">
                          <span class="currenttrades"
                            >Network trade statistics (USD) per min</span
                          >
                          <!--<span>&rarr;</span>-->
                        </div>

                        <div class="overview__mainareaonecard--tradetypes">
                          <div class="overview__mainareaonecard--tradetypesgrid">
                            <div class="overview__mainareaonecard--tradetype">
                              <span
                                >${{ tradesboard ? tradesboard.markettrades : "" }}</span
                              >
                              <span>Market Trades</span>
                            </div>
                            <div class="overview__mainareaonecard--tradetype">
                              <span
                                >${{ tradesboard ? tradesboard.limittrades : "" }}</span
                              >
                              <span>Limit Trades</span>
                            </div>
                            <div class="overview__mainareaonecard--tradetype">
                              <span
                                >${{ tradesboard ? tradesboard.stoptrades : "" }}</span
                              >
                              <span>Stop Trades</span>
                            </div>
                            <div class="overview__mainareaonecard--tradetype">
                              <span
                                >${{ tradesboard ? tradesboard.totalvolume : "" }}</span
                              >
                              <span>Total volume</span>
                            </div>
                          </div>
                        </div>

                        <div class="overview__mainareaonecard--networkhealth">
                          <span>Network Health</span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="overview__mainarea column">
                  <div class="overview__mainarea--header">
                    <h2 class="overview__mainareaonecard--h2">
                      <span class="label">Top assets</span>
                    </h2>

                    <div class="overview__mainarea--assetcategories">
                      <span
                        :class="{ current: topassetscategory === 'stock' }"
                        @click="toggletopassetscategory('stock')"
                        >Stocks</span
                      >
                      <span
                        :class="{ current: topassetscategory === 'crypto' }"
                        @click="toggletopassetscategory('crypto')"
                        >Cryptocurrencies</span
                      >
                      <span
                        :class="{ current: topassetscategory === 'commodity' }"
                        @click="toggletopassetscategory('commodity')"
                        >Commodities</span
                      >
                    </div>
                  </div>

                  <div class="overview__mainarea--assets">
                    <div class="overview__mainarea--assetsgrid">
                      <div
                        class="overview__mainarea--asset"
                        v-for="topasset in currenttopassets"
                      >
                        <div class="overview__mainarea--assettop">
                          <div class="overview__mainarea--assetleft">
                            <figure>
                              <img :src="`${baseurl}/${topasset.image}`" />
                            </figure>
                            <div class="overview__mainarea--assetprice">
                              <span class="label"
                                >Price: ${{
                                  formatNumberForSpecificLocale(topasset.price)
                                }}</span
                              >
                              <span class="amount"
                                ><span class="percent green"
                                  >+{{
                                    formatNumberForSpecificLocale(topasset.percentageup)
                                  }}%</span
                                ></span
                              >
                            </div>
                          </div>
                          <div class="overview__mainarea--assetright">
                            <span class="label">Volume</span>
                            <span class="amount"
                              >${{ formatNumberForSpecificLocale(topasset.volume) }}</span
                            >
                          </div>
                        </div>

                        <div class="overview__mainarea--assetbuttons">
                          <button
                            class="btn"
                            @click.stop="
                              $router.push(
                                `/trader?tradetype=spot&assetid=${topasset.id}&assettype=${topasset.assetType}&assetinitials=${topasset.initials}&assetname=${topasset.name}&userid=${client._id}`
                              )
                            "
                          >
                            Trade
                          </button>

                          <button class="btn" @click="$router.push('/swaps')">
                            Swap/Convert
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
//import listMixin from "@/mixins/list";

import socket from "~/plugins/socket";

import BASE_VARS from "@/store/base_vars";

const { BASE_URL } = BASE_VARS;

export default {
  data() {
    return {
      rightphase: false,
      leftphase: true,
      opacityzero: false,
      toptraders: [],
      tradesboard: null,
      marginwallet: {},
      spotwallet: {},
      topassets: [],
      topassetscategory: "stock",
      baseurl: BASE_URL,
      interval: null,
    };
  },
  methods: {
    async gettradesboard() {
      try {
        const token = localStorage.getItem("873__jh6bdjktoken");

        if (token) {
          const response = await fetch(`${BASE_URL}/dashboard/gettradesboard`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            const { tradesboardobj } = data;

            this.tradesboard = tradesboardobj;
          }
        }
      } catch (error) {
        throw error;
      }
    },
    async gettoptrades() {
      try {
        const token = localStorage.getItem("873__jh6bdjktoken");

        if (token) {
          const response = await fetch(`${BASE_URL}/dashboard/gettoptraders`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            const toptraders = data.toptraders;

            this.opacityzero = true;
            this.leftphase = false;
            this.toptradersconveyor(toptraders);
          }
        }
      } catch (error) {
        throw error;
      }
    },
    toggletopassetscategory(category) {
      this.topassetscategory = category;
    },
    async getdasboardbalances() {
      try {
        const token = localStorage.getItem("873__jh6bdjktoken");

        if (token) {
          const response = await fetch(`${BASE_URL}/userwallet/dashboard`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          const { dashboardbalances } = data;
          const { marginwallet, spotwallet } = dashboardbalances;

          this.marginwallet = marginwallet;
          this.spotwallet = spotwallet;
        }
      } catch (error) {
        throw error;
      }
    },
    async getdashboardtopassets() {
      try {
        const token = localStorage.getItem("873__jh6bdjktoken");

        if (token) {
          const response = await fetch(`${BASE_URL}/userwallet/dashboard/topassets`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          //console.log(data);
          this.topassets = data.topassets;
        }
      } catch (error) {
        throw error;
      }
    },
    formatNumberForSpecificLocale(number, locale = "en-US") {
      if (number) {
        return number.toLocaleString(locale);
      } else {
        return "0";
      }
    },
    //...mapActions("wallet", ["getwallets"]),
    toptradersconveyor(toptraders) {
      setTimeout(() => {
        this.toptraders = toptraders;
        this.opacityzero = false;
        this.leftphase = true;
      }, 500);
    },
  },
  watch: {
    client(newval, oldval) {
      if (newval) {
        this.getdasboardbalances();
        this.getdashboardtopassets();
      }
    },
  },
  mounted() {
    this.gettoptrades();

    this.gettradesboard();

    this.interval = setInterval(() => {
      this.gettoptrades();
      this.gettradesboard();
    }, 9000);
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  computed: {
    currenttopassets() {
      const topassets = this.topassets;

      const currenttopassets = topassets.filter(
        (asset) => asset.assetType === this.topassetscategory
      );

      return currenttopassets;
    },
    ...mapState({
      client: (state) => state.auth.client,
    }),
    formatDate() {
      let date = new Date();

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      let day = date.getDate(); // Get the day as a number (1-31)
      let monthIndex = date.getMonth(); // Get the month as a number (0-11)
      let year = date.getFullYear();

      return `${monthNames[monthIndex]} ${day}, ${year}`;
    },
    finoverview() {},
    transactions() {
      return [];
    },
  },
};
</script>

<style lang="scss" scoped>
.overview {
  &__main {
    display: flex;
    flex-direction: column;
  }

  &__balance {
    padding: #{scaleValue(20)};
    background: rgba($light-black, 0.3);
    border-radius: #{scaleValue(10)};
    cursor: pointer;
    transition: all 0.5s ease;
    border: 0.5px solid transparent;

    width: #{scaleValue(650)};

    &:hover {
      border: 0.5px solid $neon-blue;
      background: linear-gradient(
        to bottom right,
        rgba(0, 180, 160, 0.1),
        rgba(0, 255, 255, 0.2)
      );
    }

    &--amount {
      font-size: #{scaleValue(30)};
      font-weight: 500;
      margin-bottom: #{scaleValue(30)};

      & span {
        &.green {
          color: $success;
        }

        &.slash {
          font-weight: 300;
        }
      }
    }

    &--wallet {
      color: $neon-yellow;
      font-size: #{scaleValue(12)};
    }
  }

  &__mainarea {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: #{scaleValue(40)};

    &.column {
      flex-direction: column;
    }

    &--assetcategories {
      font-size: #{scaleValue(14)};
      color: rgba($neon-blue, 0.8);

      & span {
        display: inline-block;
        margin-right: #{scaleValue(40)};
        cursor: pointer;
        opacity: 0.6;

        &.current {
          opacity: 1;
        }
      }
    }

    &--assets {
      margin-top: #{scaleValue(40)};
    }

    &--assetsgrid {
      display: grid;
      grid-template-columns: repeat(4, #{scaleValue(320)});
      gap: #{scaleValue(10)};

      position: relative;

      &.flex {
        display: flex;
        justify-content: space-between;
      }
    }

    &--conveyor {
      height: #{scaleValue(80)};
    }

    &--asset {
      padding: #{scaleValue(20)};
      background: rgba($light-black, 0.3);
      border-radius: #{scaleValue(10)};
      cursor: pointer;
      transition: all 0.5s ease;
      border: 0.5px solid transparent;

      &:hover {
        border: 0.5px solid $neon-blue;
        background: linear-gradient(
          to bottom right,
          rgba(0, 180, 160, 0.1),
          rgba(0, 255, 255, 0.2)
        );
      }

      &.toptrader {
        position: relative;
        background: linear-gradient(
          to bottom right,
          rgba(0, 255, 255, 0.1),
          rgba(0, 255, 255, 0.05)
        );
        transition: all 0.5s ease;
        width: #{scaleValue(320)};

        &.opacityzero {
          opacity: 0;
        }

        &.leftphase {
          position: absolute;
          left: 0;
          top: 0;
        }

        &.rightphase {
          right: 0;
        }

        &.translatenormal {
        }
      }
    }

    &--assettop {
      display: flex;
      justify-content: space-between;
    }

    &--assetbuttons {
      display: flex;
      align-items: center;
      margin-top: #{scaleValue(20)};

      & button {
        margin-right: #{scaleValue(35)};
        cursor: pointer;
        color: $neon-pink;
        font-size: #{scaleValue(13)};
        font-weight: 500;
      }
    }

    &--assetleft {
      display: flex;
      align-items: center;

      & figure {
        height: #{scaleValue(30)};
        width: #{scaleValue(30)};
        border-radius: 100%;
        margin-right: #{scaleValue(10)};

        & img {
          height: 100%;
          width: 100%;
          object-fit: contain;
          border-radius: 100%;
        }
      }
    }

    &--assetprice {
      display: flex;
      flex-direction: column;

      & span {
        display: inline-block;

        &.label {
          font-size: #{scaleValue(13)};
          color: rgba($white, 0.5);
          font-weight: 500;
          margin-bottom: #{scaleValue(5)};
        }

        &.amount {
          font-size: #{scaleValue(15)};

          color: $bitcoin-orange;
        }

        &.percent {
          font-size: #{scaleValue(10)};

          &.green {
            color: $usdt-green;
          }

          &.red {
            color: $neon-orange;
          }
        }
      }
    }

    &--assetright {
      display: flex;
      flex-direction: column;

      & span {
        display: inline-block;

        &.label {
          font-size: #{scaleValue(13)};
          color: rgba($white, 0.5);
          font-weight: 500;
          margin-bottom: #{scaleValue(5)};
        }

        &.amount {
          font-size: #{scaleValue(15)};
        }
      }
    }
  }

  &__mainareaoneleft {
    display: flex;
    padding: #{scaleValue(20)};
    background: rgba($light-black, 0.3);
    border-radius: #{scaleValue(10)};
    color: $white;
  }

  &__mainareaoneright {
    background: linear-gradient(
      to bottom right,
      rgba(0, 180, 160, 0.1),
      rgba(0, 255, 255, 0.2)
    );
  }

  &__mainareaonecard {
    width: #{scaleValue(408)};
    flex-shrink: 0;

    &.first {
      width: #{scaleValue(310)};
    }

    &.graphparent {
      width: #{scaleValue(500)};
    }

    &--h2 {
      font-size: #{scaleValue(17)};
      font-weight: 500;
      margin-bottom: #{scaleValue(10)};
      display: flex;
      align-items: center;

      & span {
        &.label {
          margin-right: #{scaleValue(10)};
        }

        &.value {
          color: $neon-blue;
          font-size: #{scaleValue(14)};
        }

        &.twenthr {
          color: $bitcoin-orange;
        }

        &.balance {
          font-size: #{scaleValue(12)};
          color: $success;
        }
      }
    }

    &--percentage {
      display: flex;
      align-items: center;

      & span {
        display: inline-block;

        &.percent {
          font-size: #{scaleValue(25)};
          font-weight: 500;
        }

        &.green {
          color: $success;
        }

        &.smallfigure {
          padding: #{scaleValue(5)} #{scaleValue(10)};
          font-size: #{scaleValue(12)};
          margin-left: #{scaleValue(12)};
          border-radius: #{scaleValue(25)};
          background: linear-gradient(
            to bottom right,
            rgba(0, 180, 160, 0.1),
            rgba(0, 255, 255, 0.2)
          );
        }
      }
    }

    &--date {
      color: rgba($white, 0.4);
      font-size: #{scaleValue(11)};
      font-weight: 500;
    }

    &--reportdaily {
      margin-bottom: #{scaleValue(60)};
    }

    &--myprofitarea {
      margin-bottom: #{scaleValue(10)};

      & span {
        &.myprofit {
          font-size: #{scaleValue(11)};
          color: rgba($white, 0.4);
        }

        &.myprofitdot {
          font-size: #{scaleValue(11)};
          color: rgba($white, 0.4);
        }

        &.myprofitpercentage {
          font-size: #{scaleValue(12)};

          &.green {
            color: $neon-blue;
          }
        }

        &.dollarvalue {
          font-size: #{scaleValue(40)};
          font-weight: 500;
        }

        &.statement {
          font-size: #{scaleValue(11)};
          color: rgba($white, 0.4);

          & span {
            color: rgba($white, 0.6);
          }
        }
      }
    }

    &--learnmore {
      font-size: #{scaleValue(12)};
      cursor: pointer;
      margin-bottom: #{scaleValue(40)};

      & span {
        &.currenttrades {
          color: $bitcoin-orange;
        }
      }
    }

    &--tradetypesgrid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: #{scaleValue(30)};
    }

    &--tradetype {
      display: flex;
      flex-direction: column;

      & span {
        display: inline-block;

        &:nth-child(1) {
          font-size: #{scaleValue(23)};
          margin-bottom: #{scaleValue(10)};
          color: rgba($white, 0.8);
        }

        &:nth-child(2) {
          font-size: #{scaleValue(13)};
          color: rgba($bitcoin-orange, 0.9);
        }
      }
    }

    &--networkhealth {
      font-size: #{scaleValue(12)};
      display: flex;
      align-items: center;
      margin-top: #{scaleValue(50)};

      & span {
        display: inline-block;

        &:nth-child(1) {
          margin-right: #{scaleValue(10)};
        }

        &:nth-child(2) {
          background: $neon-green;

          width: #{scaleValue(8)};
          height: #{scaleValue(8)};
          border-radius: 100%;
        }
      }
    }
  }
}

.green {
  color: $usdt-green;
}

.red {
  color: $neon-orange;
}
</style>
