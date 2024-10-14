<template>
  <div>
    <div class="margin">
      <div class="content">
        <TraderHeader />

        <div class="content__body">
          <div class="container">
            <SideNav />

            <div class="layout-stretch">
              <PageIndicator
                :page_name="'Margin'"
                :showdepositbtn="true"
                :showwithdrawbtn="true"
              />

              <div class="margin__main layout-padding">
                <div class="balancearea row">
                  <div class="balancearea__section main">
                    <div class="balancearea__primarylabel">
                      <h3 class="balancearea__primarylabel--h3 neon-yellow">
                        Total Balance
                      </h3>
                      <span class="balancearea__primarylabel--eyesvg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          class="eye css-16vuvx8"
                        >
                          <path
                            d="M12 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                            fill="currentColor"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M6.555 6.31L1 12l5.555 5.69a7.572 7.572 0 0010.89 0L23 12l-5.555-5.69a7.572 7.572 0 00-10.89 0zM17 12a5 5 0 11-10 0 5 5 0 0110 0z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                    </div>

                    <div class="balancearea__primarybalance">
                      <p class="balancearea__primarybalance--btcvalue">
                        {{ formatNumberForSpecificLocale(walletbtctotal) }} BTC
                      </p>
                      <span class="balancearea__primarybalance--equals">≈</span>
                      <p class="balancearea__primarybalance--usdvalue">
                        ${{ formatNumberForSpecificLocale(walletusdtotal) }}
                      </p>
                    </div>
                  </div>

                  <div class="balancearea__section secondary">
                    <div class="balancearea__secondarybalance">
                      <h3 class="balancearea__secondarybalance--h3 neon-pink">
                        Total Debt
                      </h3>
                      <div class="balancearea__secondarybalance--btcvalue">
                        {{
                          tradeaccountdebtInBtc === 0 ? 0.00000000 : `${tradeaccountdebtInBtc}`
                        }}
                        BTC
                      </div>
                      <div class="balancearea__secondarybalance--usdvalue">
                        ≈ ${{ `${tradeaccountdebt}` }} USD
                      </div>
                    </div>
                  </div>

                  <div class="balancearea__section secondary">
                    <div class="balancearea__secondarybalance">
                      <h3 class="balancearea__secondarybalance--h3 neon-green">
                        Available Margin:
                      </h3>
                      <div class="balancearea__secondarybalance--btcvalue">
                        {{
                          tradeaccountmarginInBtc === 0 ? 0.00000000 : `${tradeaccountmarginInBtc}`
                        }} BTC
                      </div>
                      <div class="balancearea__secondarybalance--usdvalue">
                        ≈ ${{ `${tradeaccountmargin}` }} USD
                      </div>
                    </div>
                  </div>
                </div>

                <div class="balancearea row">
                  <div class="balancearea__section secondary">
                    <div class="balancearea__secondarybalance">
                      <h3 class="balancearea__secondarybalance--h3 neon-green">Equity</h3>
                      <div class="balancearea__secondarybalance--btcvalue">
                        {{ `${tradeaccountequityInBtc}` }} BTC
                      </div>
                      <div class="balancearea__secondarybalance--usdvalue">{{ `${tradeaccountequity}` }} USD</div>
                    </div>
                  </div>
                </div>

                <div v-if="marginwallet">
                  <AssetSearch
                    :walletid="marginwallet._id"
                    :start="start"
                    :end="end"
                    :setassetclass="setassetclass"
                    :setsearchInput="setsearchInput"
                    :togglehideemptybalances="togglehideemptybalances"
                  />
                </div>

                <div class="assetlistheader">
                  <div class="assetlistheader__item margin">
                    <label class="assetlistheader__item--label">Asset</label>
                    <div class="assetlistheader__item--arrows">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          class="css-1c0zcq0"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5zm6.5 6.303V13.5h-6.5v1.652l3.25 3.5 3.25-3.5z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div class="assetlistheader__item margin">
                    <label class="assetlistheader__item--label">Total balance</label>
                    <div class="assetlistheader__item--arrows">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          class="css-1c0zcq0"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5zm6.5 6.303V13.5h-6.5v1.652l3.25 3.5 3.25-3.5z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div class="assetlistheader__item margin">
                    <label class="assetlistheader__item--label">Balance in USD</label>
                    <div class="assetlistheader__item--arrows">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          class="css-1c0zcq0"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5zm6.5 6.303V13.5h-6.5v1.652l3.25 3.5 3.25-3.5z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <!--<div class="assetlistheader__item margin">
                                        <label class="assetlistheader__item--label">Available</label>
                                        <div class="assetlistheader__item--arrows">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-1c0zcq0"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5zm6.5 6.303V13.5h-6.5v1.652l3.25 3.5 3.25-3.5z" fill="currentColor"></path></svg>
                                            </span>
                                        </div>
                                    </div>-->

                  <div class="assetlistheader__item margin">
                    <label class="assetlistheader__item--label">Borrowed</label>
                    <div class="assetlistheader__item--arrows">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          class="css-1c0zcq0"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5zm6.5 6.303V13.5h-6.5v1.652l3.25 3.5 3.25-3.5z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div class="assetlistheader__item margin">
                    <label class="assetlistheader__item--label">Interest</label>
                    <div class="assetlistheader__item--arrows">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          class="css-1c0zcq0"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5zm6.5 6.303V13.5h-6.5v1.652l3.25 3.5 3.25-3.5z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div class="assetlistheader__item margin">
                    <label class="assetlistheader__item--label">Max Transfer Out</label>
                    <div class="assetlistheader__item--arrows">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          class="css-1c0zcq0"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5zm6.5 6.303V13.5h-6.5v1.652l3.25 3.5 3.25-3.5z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <!-- <div class="assetlistheader__item margin">
                                        <label class="assetlistheader__item--label">Equity value (USDT)</label>
                                        <div class="assetlistheader__item--arrows">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-1c0zcq0"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5zm6.5 6.303V13.5h-6.5v1.652l3.25 3.5 3.25-3.5z" fill="currentColor"></path></svg>
                                            </span>
                                        </div>
                                    </div>-->

                  <div class="assetlistheader__item margin">
                    <label class="assetlistheader__item--label">Action</label>
                  </div>
                </div>

                <div class="assetlist">
                  <div class="assetlist__item fiatandspot" v-for="asset in visibleassets">
                    <div class="assetlist__area fiatandspot">
                      <figure class="assetlist__area--assetlogo">
                        <img :src="returnCryptoLogo(asset.assetlogo)" />
                      </figure>
                      <div class="assetlist__area--asset">
                        <span class="assetlist__area--assetsymbol">{{
                          asset.assetinitials
                        }}</span>
                        <span class="assetlist__area--assetname">{{
                          limitTextLength(asset.assetname, 9)
                        }}</span>
                      </div>
                    </div>

                    <div class="assetlist__area fiatandspot number-value">
                      <p class="neon-blue">
                        {{
                          asset.blc !== 0
                            ? formatNumberForSpecificLocale(asset.blc)
                            : `0.00000000`
                        }}
                      </p>
                    </div>

                    <div class="assetlist__area fiatandspot number-value">
                      <p class="neon-blue">
                        ${{
                          asset.usdblc !== 0
                            ? formatNumberForSpecificLocale(asset.usdblc)
                            : `0.00000000`
                        }}
                      </p>
                    </div>

                    <div class="assetlist__area fiatandspot number-value">
                      <p class="neon-blue">${{ `0.00000000` }}</p>
                    </div>

                    <div class="assetlist__area fiatandspot number-value">
                      <p class="neon-blue">
                        {{ `0.00000000` }}
                      </p>
                    </div>

                    <div class="assetlist__area fiatandspot number-value">
                      <p class="neon-blue">
                        {{ `0.00000000` }}
                      </p>
                    </div>

                    <div class="assetlist__area fiatandspot assetlist__areabtns">
                      <!--<button class="btn color-primary">Buy</button>-->
                      <!--<button class="btn color-primary">Sell</button>-->
                      <!--<button class="btn color-primary">Deposit</button>-->
                      <button class="btn neon-pink" @click.stop="$router.push('/swaps')">
                        Swap/Convert
                      </button>
                      <button
                        class="btn neon-pink"
                        @click.stop="
                          $router.push(
                            `/trader?tradetype=margin&assetid=${asset.assetid}&assettype=${asset.assettype}&assetinitials=${asset.assetinitials}&assetname=${asset.assetname}&userid=${client._id}`
                          )
                        "
                        v-if="asset.coin !== 'USDT' && asset.coin !== 'USD'"
                      >
                        Trade
                      </button>
                      <!--<button
                        class="btn neon-pink"
                        @click.stop="
                          navigateToTradePage(
                            `trade?autotrader=true&wallet=margin&assettype=${asset.assetType}&baseAsset=${asset.coin}`,
                            asset._id
                          )
                        "
                        v-if="asset.coin !== 'USDT' && asset.coin !== 'USD'"
                      >
                        AlgoTrade
                      </button>-->

                      <!--<button class="btn color-primary">Earn</button>-->
                    </div>
                  </div>
                </div>

                <div class="assetlist__navigation color-primary fontWeight600">
                  <span
                    v-for="pagi in pagesbuttons"
                    @click="setpage(pagi)"
                    :class="{
                      current: currentpage === pagi,
                    }"
                    >{{ pagi }}</span
                  >
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
import walletMixin from "@/mixins/walletv2";
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  data() {
    return {
      assetclass: "commodity",
      start: 0,
      end: 10,
      currentpage: 1,
      searchInput: "",
      hideemptybalances: false,
    };
  },
  mixins: [walletMixin],
  computed: {
    ...mapState({
      client: (state) => state.auth.client,
      marginwallet: (state) => state.userwallet.marginwallet,
      assetslist: (state) => state.userwallet.userwalletassets_list,
      walletusdtotal: (state) => state.userwallet.walletusdtotal,
      walletbtctotal: (state) => state.userwallet.walletbtctotal,
      totalitems: (state) => state.userwallet.totalitems,
      tradeaccountmargin: (state) => state.userwallet.tradeaccountmargin,
      tradeaccountdebt: (state) => state.userwallet.tradeaccountdebt,
      tradeaccountequity: (state) => state.userwallet.tradeaccountequity,
      tradeaccountdebtInBtc: (state) => state.userwallet.tradeaccountdebtInBtc,
      tradeaccountmarginInBtc: (state) => state.userwallet.tradeaccountmarginInBtc,
      tradeaccountequityInBtc: (state) => state.userwallet.tradeaccountequityInBtc,
    }),
    pages() {
      const { totalitems } = this;

      return Math.ceil(totalitems / 10);
    },
    pagesbuttons() {
      const { pages } = this;

      const numberToArray = (num) => {
        const resultArray = [];
        for (let i = 1; i <= num; i++) {
          resultArray.push(i);
        }
        return resultArray;
      };

      return numberToArray(pages);
    },
    visibleassets() {
      if (this.hideemptybalances) {
        return this.assetslist.filter((itm) => itm.blc !== 0);
      }

      return this.assetslist;
    },
  },
  methods: {
    togglehideemptybalances(val) {
      this.hideemptybalances = val;
    },
    setsearchInput(value) {
      this.searchInput = value;
    },
    setpage(page) {
      const pageSize = 10;

      if (page === 1) {
        this.start = 0;
        this.end = pageSize;
        this.currentpage = 1;
      } else if (page > 1) {
        this.start = (page - 1) * pageSize;
        this.end = page * pageSize;
        this.currentpage = page;
      }

      if (this.searchInput.length) {
        this.getuserwallet({
          walletid: this.spotwallet._id,
          assettype: this.assetclass,
          start: this.start,
          end: this.end,
          searchquery: this.searchInput,
        });
      } else {
        this.getuserwallet({
          walletid: this.marginwallet._id,
          assettype: this.assetclass,
          start: this.start,
          end: this.end,
        });
      }
    },
    formatNumberForSpecificLocale(number, locale = "en-US") {
      if (number) {
        return number.toLocaleString(locale);
      } else {
        return "0";
      }
    },
    ...mapActions("userwallet", ["getuserwallet", "getusermargindashboard"]),
    setassetclass(assettype) {
      this.assetclass = assettype;
    },
  },
  watch: {
    marginwallet(newval, oldval) {
      if (newval) {
        if (this.marginwallet) {
          this.getuserwallet({
            walletid: this.marginwallet._id,
            assettype: this.assetclass,
            start: this.start,
            end: this.end,
          });

          this.getusermargindashboard({ userid: this.marginwallet.owner });
        }
      }
    },
    searchInput() {
      this.start = 0;
      this.end = 10;
    },
    assetclass() {
      this.start = 0;
      this.end = 10;
    },
    spotwallet(newval, oldval) {
      if (newval) {
        if (this.spotwallet) {
          this.getuserwallet({
            walletid: this.spotwallet._id,
            assettype: this.assetclass,
            start: this.start,
            end: this.end,
          });
        }
      }
    },
  },
};
</script>
