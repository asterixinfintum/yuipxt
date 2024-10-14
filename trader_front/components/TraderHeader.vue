<template>
  <div>
    <div class="trader__escalator">
      <!--<HeaderAnnouncement :announcement="announcements[0]" />-->
      <!--<CurrencyEscalator />-->
    </div>
    <div class="trader__header">
      <div class="trader__header--area">
        <div
          class="trader__header--logo"
          v-if="client"
          @click="$router.push('/overview')"
        >
          <figure>
            <img :src="`${primaryapi}/traderheaderlogotransparent.png`" />
          </figure>
        </div>

        <div class="trader__header--logo" v-if="!client" @click="$router.push('/')">
          <figure>
            <img :src="`${primaryapi}/traderheaderlogotransparent.png`" />
          </figure>
        </div>

        <div class="trader__header--menu">
          <!--<div
            class="trader__header--menuitem"
            :class="{ current: currentpage.includes('markets') }"
            @click="routepage('markets')"
          >
            Markets
          </div>
          <div
            class="trader__header--menuitem"
            :class="{ current: currentpage.includes('spot') }"
            @click="routepage('spot')"
          >
            Spot trade
          </div>
          <div
            class="trader__header--menuitem"
            :class="{ current: currentpage.includes('swaps') }"
            @click="routepage('swaps')"
          >
            Swaps/Transfer
          </div>
          <div
            class="trader__header--menuitem"
            :class="{ current: currentpage.includes('staking') }"
            @click="routepage('staking')"
          >
            Staking/Rewards
          </div>
          <div
            class="trader__header--menuitem"
            :class="{ current: currentpage.includes('automatic') }"
            @click="routepage('automatic')"
          >
            Automatic trader (AI)
          </div>
          <div
            class="trader__header--menuitem"
            :class="{ current: currentpage.includes('margin') }"
            @click="routepage('margin')"
          >
            Margin trade
          </div>-->
          <div
            class="trader__header--menuitem"
            :class="{ current: currentpage.includes('accountplans') }"
            @click="$router.push('blog')"
          >
            Blog
          </div>
          
          <div
            class="trader__header--menuitem"
            :class="{ current: currentpage.includes('accountplans') }"
            @click="$router.push('accountplans')"
          >
            Account Plans
          </div>
          <div
            class="trader__header--menuitem"
            :class="{ current: currentpage.includes('blog') }"
            @click="$router.push('margin')"
          >
            Margin wallet
          </div>
          <div
            class="trader__header--menuitem"
            :class="{ current: currentpage.includes('blog') }"
            @click="$router.push('fiatandspot')"
          >
            Spot wallet
          </div>
          
        </div>
      </div>

      <div class="trader__header--area" v-if="client">
        <div class="trader__header--menu">
          <!--<div class="trader__header--menuitem" @click="togglesearch">
            <span>
              <svg
                viewBox="0 0 24 24"
                focusable="false"
                class="chakra-icon css-onkibi"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M23.384,21.619,16.855,15.09a9.284,9.284,0,1,0-1.768,1.768l6.529,6.529a1.266,1.266,0,0,0,1.768,0A1.251,1.251,0,0,0,23.384,21.619ZM2.75,9.5a6.75,6.75,0,1,1,6.75,6.75A6.758,6.758,0,0,1,2.75,9.5Z"
                ></path>
              </svg>
            </span>
          </div>-->

          <div class="trader__header--menuitem">
            <span>
              {{ client.accountplan }}
            </span>
          </div>
          <div class="trader__header--menuitem capitalize neon-blue">
            <span> {{ client.firstname }} {{ client.lastname }} </span>
          </div>
          <div
            class="trader__header--menuitem"
            :class="{ current: currentpage.includes('blog') }"
            @click="triggerlogout"
          >
            Log out
          </div>
          <div class="trader__header--menuitem menuitembtn" @click="$router.push(`/wallet/fiatandspot`)">
            <span>
              <svg
                viewBox="0 0 24 24"
                focusable="false"
                class="chakra-icon css-onkibi"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
                ></path></svg
            ></span>
            <span>Deposit</span>
          </div>
        </div>
      </div>

      <div class="trader__header--area" v-if="!client">
        <div class="trader__header--menu">
          <!--<div class="trader__header--menuitem" @click="togglesearch">
            <span>
              <svg
                viewBox="0 0 24 24"
                focusable="false"
                class="chakra-icon css-onkibi"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M23.384,21.619,16.855,15.09a9.284,9.284,0,1,0-1.768,1.768l6.529,6.529a1.266,1.266,0,0,0,1.768,0A1.251,1.251,0,0,0,23.384,21.619ZM2.75,9.5a6.75,6.75,0,1,1,6.75,6.75A6.758,6.758,0,0,1,2.75,9.5Z"
                ></path>
              </svg>
            </span>
          </div>-->
          <!--<div class="trader__header--menuitem">Help</div>-->
          <div class="trader__header--menuitem" @click="$router.push('/login')">
            Log In
          </div>
          <div
            class="trader__header--menuitem menuitembtn"
            @click="$router.push('/register')"
          >
            Register
          </div>
        </div>
      </div>
    </div>

    <div class="trader__search" v-if="showsearch" @click.stop="togglesearch">
      <div class="trader__search--input" @click.stop="searchitems">
        <input placeholder="Pair, Stake pool, Topic" />
      </div>

      <div class="trader__search--body">
        <div class="trader__search--results">
          <div class="trader__search--menu">
            <span
              :class="{ current: currentsearch === 'All' }"
              @click.stop="togglecurrentsearch('All')"
              >All</span
            >
            <span
              :class="{ current: currentsearch === 'Spot trade' }"
              @click.stop="togglecurrentsearch('Spot trade')"
              >Spot trade</span
            >
            <span
              :class="{ current: currentsearch === 'Margin trade' }"
              @click.stop="togglecurrentsearch('Margin trade')"
              >Margin trade</span
            >
            <span
              :class="{ current: currentsearch === 'Auto trade' }"
              @click.stop="togglecurrentsearch('Auto trade')"
              >Auto trade</span
            >
            <span
              :class="{ current: currentsearch === 'Blog' }"
              @click.stop="togglecurrentsearch('Blog')"
              >Blog</span
            >
            <span
              :class="{ current: currentsearch === 'Staking' }"
              @click.stop="togglecurrentsearch('Staking')"
              >Staking</span
            >
            <span
              :class="{ current: currentsearch === 'Markets' }"
              @click.stop="togglecurrentsearch('Markets')"
              >Markets</span
            >
          </div>

          <div class="trader__search--results">
            <h2 class="trader__search--resultsh2">Category</h2>

            <div class="trader__search--resultslist">
              <div class="trader__search--result">
                <div class="trader__search--resultleft">
                  <figure>
                    <img :src="`${primaryapi}/tron-trx-logo.svg`" />
                  </figure>
                  <div>TRON/ETH</div>
                </div>
                <div class="trader__search--resultright">
                  <span>$3000</span>
                  <span>+4.5%</span>
                </div>
              </div>

              <div class="trader__search--result">
                <div class="trader__search--resultleft">
                  <figure>
                    <img :src="`${primaryapi}/tron-trx-logo.svg`" />
                  </figure>
                  <div>TRON/ETH</div>
                </div>
                <div class="trader__search--resultright">
                  <span>$3000</span>
                  <span>+4.5%</span>
                </div>
              </div>

              <div class="trader__search--result">
                <div class="trader__search--resultleft">
                  <figure>
                    <img :src="`${primaryapi}/tron-trx-logo.svg`" />
                  </figure>
                  <div>TRON/ETH</div>
                </div>
                <div class="trader__search--resultright">
                  <span>$3000</span>
                  <span>+4.5%</span>
                </div>
              </div>

              <div class="trader__search--result">
                <div class="trader__search--resultleft">
                  <figure>
                    <img :src="`${primaryapi}/tron-trx-logo.svg`" />
                  </figure>
                  <div>TRON/ETH</div>
                </div>
                <div class="trader__search--resultright">
                  <span>$3000</span>
                  <span>+4.5%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="trader__search--results">
            <h2 class="trader__search--resultsh2">Category</h2>

            <div class="trader__search--resultslist">
              <div class="trader__search--result">
                <div class="trader__search--resultleft">
                  <figure>
                    <img :src="`${primaryapi}/tron-trx-logo.svg`" />
                  </figure>
                  <div>TRON/ETH</div>
                </div>
                <div class="trader__search--resultright">
                  <span>$3000</span>
                  <span>+4.5%</span>
                </div>
              </div>

              <div class="trader__search--result">
                <div class="trader__search--resultleft">
                  <figure>
                    <img :src="`${primaryapi}/tron-trx-logo.svg`" />
                  </figure>
                  <div>TRON/ETH</div>
                </div>
                <div class="trader__search--resultright">
                  <span>$3000</span>
                  <span>+4.5%</span>
                </div>
              </div>

              <div class="trader__search--result">
                <div class="trader__search--resultleft">
                  <figure>
                    <img :src="`${primaryapi}/tron-trx-logo.svg`" />
                  </figure>
                  <div>TRON/ETH</div>
                </div>
                <div class="trader__search--resultright">
                  <span>$3000</span>
                  <span>+4.5%</span>
                </div>
              </div>

              <div class="trader__search--result">
                <div class="trader__search--resultleft">
                  <figure>
                    <img :src="`${primaryapi}/tron-trx-logo.svg`" />
                  </figure>
                  <div>TRON/ETH</div>
                </div>
                <div class="trader__search--resultright">
                  <span>$3000</span>
                  <span>+4.5%</span>
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

import BASE_VARS from "@/store/base_vars";

import socket from "@/plugins/socket.js";

const { BASE_URL } = BASE_VARS;

export default {
  props: [],
  data() {
    return {
      primaryapi: BASE_URL,
      showsearch: false,
      currentsearch: "All",
      tradesheader: "Market Trades",
      announcements: [
        `Tradex Quant Token (Tradex Quant) ICO launches Soon!`,
      ],
    };
  },
  mounted() {
    this.getCurrentUser();

    socket.on("updateclientprices", () => {
      this.getuserwallets(this.client._id);
    });
  },
  watch: {
    client(newval, oldval) {
      if (newval) {
        this.getuserwallets(newval._id);

        socket.emit("clientloggedin", { clientid: newval._id });
      }
    },
  },
  computed: {
    ...mapState({
      client: (state) => state.auth.client,
      userwallets: (state) => state.userwallet.userwalletss,
    }),
    currentpage() {
      return this.$route.fullPath;
    },
    devc() {
      return this.$route;
    },
  },
  methods: {
    triggerlogout() {
      const { logout } = this;
      logout().then(() => this.$router.push("/"));
    },
    scrollToDiv(mydivid) {
      const target = document.getElementById(`${mydivid}`);
      const currentScrollPosition = window.pageYOffset;
      const distanceToTarget = target.offsetTop - currentScrollPosition;

      window.scroll(0, distanceToTarget);
    },
    ...mapActions("userwallet", ["getuserwallets"]),
    ...mapActions("auth", ["logout"]),
    ...mapMutations("auth", ["SET_CLIENT", "SET_CLIENT_TOKEN"]),
    getCurrentUser() {
      const token = localStorage.getItem("873__jh6bdjktoken");

      if (!token) {
        return;
      }

      try {
        fetch(`${BASE_URL}/getclient`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const { token, userData } = data;

            this.SET_CLIENT(userData);
            this.SET_CLIENT_TOKEN(token);
          })
          .catch((error) => {
            console.log("Error:", error);
          });
      } catch (error) {
        console.error(error);
      }
    },
    searchitems() {},
    togglesearch() {
      this.showsearch ? (this.showsearch = false) : (this.showsearch = true);
    },
    routepage(route) {
      if (route === "spot" || route === "margin" || route === "automatic") {
        this.$router.push({
          path: "/trader", // The name of the route to navigate to
          query: { ...this.$route.query, tradetype: route }, // Merging existing query parameters with the new or updated parameter
        });

        return;
      }

      if (route === "swaps") {
        this.$router.push("swaps");
      }

      if (route === "markets") {
        this.$router.push("markets");
      }

      this.$router.push(route);
    },
  },
};
</script>
