<template>
  <div>
    <div class="header__mobile">
      <div class="header__mobile--main">
        <div
          class="header__mobile--burger"
          @click="togglediv('mobiledropdown')"
          v-if="!sidenavopen"
        >
          <svg
            class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium mui-fez96c"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0 0H20V2.22222H0V0ZM0 17.7778H20V20H0V17.7778ZM20 8.88889H0V11.1111H20V8.88889Z"
            ></path>
          </svg>
        </div>

        <div
          class="header__mobile--burger"
          @click="togglediv('mobiledropdown')"
          v-if="sidenavopen"
        >
          <svg
            class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium mui-19j1sea"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 8.46171L1.53829 0L0 1.53829L8.46171 10L0 18.4617L1.53829 20L10 11.5383L18.4617 20L20 18.4617L11.5383 10L20 1.53829L18.4617 0L10 8.46171Z"
            ></path>
          </svg>
        </div>

        <div class="header__logo" v-if="client" @click="routeToHomeTrade">
          <figure class="tradex-logo-headr">
            <img src="@/assets/imgs/logo_psb.png" />
          </figure>
          <p>Tradex Quant</p>
        </div>
        <div class="header__logo" v-if="!client" @click="routeToHomeTrade">
          <figure class="tradex-logo-headr">
            <img src="@/assets/imgs/logo_psb.png" />
          </figure>
          <p>Tradex Quant</p>
        </div>
      </div>

      <div class="header__mobile--sidenav" ref="mobiledropdown">
        <div class="header__mobile--menu">
          <div class="header__menuitem" @click="navigateToPage('blog')">
            <label>Blog</label>
          </div>
        </div>

        <div class="header__mobile--menu">
          <div
            class="header__menuitem"
            @click="scrollToDiv('landingperks')"
            v-if="!client"
          >
            <label>Account plans</label>
          </div>
        </div>

        <div class="header__mobile--menu">
          <div class="header__menuitem" @click="accountplanspage" v-if="client">
            <label>View Account plans</label>
          </div>
        </div>

        <div class="header__mobile--menu">
          <div class="header__menuitem" @click="accountplanspage" v-if="client">
            <div class="sidenav__item--svg">
              <span>
                <svg
                  viewBox="0 0 24 24"
                  focusable="false"
                  class="chakra-icon css-onkibi"
                  aria-hidden="true"
                >
                  <g fill="currentColor" fill-rule="nonzero">
                    <g id="circular-graph">
                      <path
                        d="M20.23,0H3.77C1.69,0,0,1.69,0,3.77V20.23c0,2.08,1.69,3.77,3.77,3.77H20.23c2.08,0,3.77-1.69,3.77-3.77V3.77c0-2.08-1.69-3.77-3.77-3.77ZM3.77,2.06H20.23c.95,0,1.71,.77,1.71,1.71v.76L13.45,13.23l-3.23-4.53c-.19-.26-.48-.44-.8-.47s-.65,.07-.88,.29L2.06,14.46V3.77c0-.95,.77-1.71,1.71-1.71ZM20.23,21.94H3.77c-.95,0-1.71-.77-1.71-1.71v-2.71s.04-.02,.05-.03l7.01-6.43,3.27,4.59c.19,.27,.5,.45,.84,.47,.33,.03,.66-.1,.9-.34l7.82-8.01v12.45c0,.95-.77,1.71-1.71,1.71Z"
                        id="Shape"
                      ></path>
                    </g>
                  </g>
                </svg>
              </span>
            </div>
            <label>Financial Overview</label>
          </div>
        </div>

        <div class="header__mobile--menu">
          <div class="header__menuitem" @click="accountplanspage" v-if="client">
            <div class="sidenav__item--svg">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="css-199zucj"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15 3.5a5.502 5.502 0 00-5.302 4.032 7.502 7.502 0 016.77 6.77A5.502 5.502 0 0015 3.5zM14.5 15a5.5 5.5 0 10-11 0 5.5 5.5 0 0011 0zm-8 0L9 17.5l2.5-2.5L9 12.5 6.5 15zM9 4H4v5l5-5zm11 16h-5l5-5v5z"
                    fill="currentColor"
                  ></path>
                </svg>
              </span>
            </div>
            <label>Spot</label>
          </div>
        </div>

        <div class="header__mobile--menu">
          <div class="header__menuitem" @click="accountplanspage" v-if="client">
            <div class="sidenav__item--svg">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="css-199zucj"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.5 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm0-5.031L5.969 7.5 7.5 9.031l1.531-1.53L7.5 5.968zM20 4h-8l3.125 3.125L4.061 18.19l1.768 1.768L16.893 8.893 20 12V4zm0 12.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z"
                    fill="currentColor"
                  ></path>
                </svg>
              </span>
            </div>
            <label>Margin Wallet</label>
          </div>
        </div>

        <div class="header__mobile--menu">
          <div class="header__menuitem" @click="accountplanspage" v-if="client">
            <div class="sidenav__item--svg">
              <span>
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 512 512"
                  aria-hidden="true"
                  focusable="false"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="32"
                    d="M464 208L352 96 240 208m112-94.87V416M48 304l112 112 112-112m-112 94V96"
                  ></path>
                </svg>
              </span>
            </div>
            <label>Swaps/Convertions</label>
          </div>
        </div>

        <div class="header__mobile--menu">
          <div class="header__menuitem" @click="accountplanspage" v-if="client">
            <div class="sidenav__item--svg">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="css-19ss7aa"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M16.597 16.594A6.48 6.48 0 0112 18.498h-1.25v2.5H12a9 9 0 006.364-15.364 9 9 0 00-12.728 0l1.767 1.768a6.5 6.5 0 019.193 9.192zM13.25 8h-2.5v4.518l3.185 3.185 1.768-1.768-2.453-2.453V8zM5.627 9.568v1.2l-.092.006c-.767.062-1.371.29-1.783.662-.41.37-.639.891-.639 1.564 0 .684.24 1.223.676 1.642.438.421 1.08.726 1.889.925l.076.019v1.901l-.123-.029a3.94 3.94 0 01-.838-.305 2.512 2.512 0 01-.596-.4L3.14 17.935c.446.416 1.309.784 2.268.974l.08.016v1.277h1.578v-1.207l.086-.011c.796-.11 1.357-.448 1.718-.891a2.457 2.457 0 00.532-1.562c0-.669-.246-1.177-.668-1.568-.426-.394-1.037-.675-1.772-.874l-.074-.02v-1.802l.125.033c.406.106.816.31 1.099.558l1.035-1.136c-.43-.4-1.102-.697-1.875-.861l-.08-.017V9.568H5.628zm.19 4.272l-.137-.056c-.221-.09-.381-.185-.485-.303a.599.599 0 01-.149-.418c0-.133.028-.298.126-.448.1-.152.265-.279.522-.34l.123-.03v1.595zm1.057 3.678v-1.732l.147.08a.934.934 0 01.376.346.936.936 0 01.122.483.9.9 0 01-.096.429.744.744 0 01-.414.343l-.135.05z"
                    fill="currentColor"
                  ></path>
                </svg>
              </span>
            </div>
            <label>My Transaction History</label>
          </div>
        </div>

        <div class="header__mobile--menu">
          <div class="header__menuitem" @click="accountplanspage" v-if="client">
            <div class="sidenav__item--svg">
              <span>
                <svg
                  viewBox="0 0 14 14"
                  focusable="false"
                  class="chakra-icon css-onkibi"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M14,7.77 L14,6.17 L12.06,5.53 L11.61,4.44 L12.49,2.6 L11.36,1.47 L9.55,2.38 L8.46,1.93 L7.77,0.01 L6.17,0.01 L5.54,1.95 L4.43,2.4 L2.59,1.52 L1.46,2.65 L2.37,4.46 L1.92,5.55 L0,6.23 L0,7.82 L1.94,8.46 L2.39,9.55 L1.51,11.39 L2.64,12.52 L4.45,11.61 L5.54,12.06 L6.23,13.98 L7.82,13.98 L8.45,12.04 L9.56,11.59 L11.4,12.47 L12.53,11.34 L11.61,9.53 L12.08,8.44 L14,7.75 L14,7.77 Z M7,10 C5.34,10 4,8.66 4,7 C4,5.34 5.34,4 7,4 C8.66,4 10,5.34 10,7 C10,8.66 8.66,10 7,10 Z"
                  ></path>
                </svg>
              </span>
            </div>
            <label>Settings</label>
          </div>
        </div>

        <div class="header__mobile--menu">
          <div class="header__menuitem">
            <div @click="togglediv('actions')">
              <label>Actions</label>
              <span class="svg">
                <svg
                  class="sc-bgqQcB halGnt mx-icon icondown"
                  focusable="false"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                  viewBox="0 0 1024 1024"
                  data-icon="CaretDownOutlined"
                >
                  <path
                    d="M929.1776 203.1616a61.44 61.44 0 0 1 46.8992 100.9664L559.104 799.0272a61.44 61.44 0 0 1-94.0032 0L47.9232 304.128a61.44 61.44 0 0 1 46.8992-100.9664h834.3552z"
                  ></path>
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div class="header__mobile--dropdown" ref="actions" v-if="client">
          <div class="header__mobile--dropdownitem">
            <label class="white-color">Transaction history</label>
          </div>
          <div class="header__mobile--dropdownitem">
            <label class="white-color">Withdrawal</label>
          </div>
        </div>

        <div class="header__mobile--dropdown" ref="trade" v-if="client">
          <div
            class="header__mobile--dropdownitem"
            @click.stop="
              navigateToTradePage(
                `trade?autotrader=true&wallet=spot&assettype=${baseasset.assetType}`,
                baseasset._id
              )
            "
          >
            <label>Spot</label>
            <span>
              designed for the modern trader who demands convenience, flexibility, and
              security. Our spot wallet is tailored to meet the needs of active traders.
            </span>
          </div>
          <div
            class="header__mobile--dropdownitem"
            @click.stop="
              navigateToTradePage(
                `trade?autotrader=true&wallet=margin&assettype=${baseasset.assetType}`,
                baseasset._id
              )
            "
          >
            <label>Margin</label>
            <span>
              Our margin wallet is specifically designed for traders who want to use
              margin trading to amplify their gains.
            </span>
          </div>
        </div>

        <div class="header__mobile--dropdown" ref="trade" v-if="!client">
          <div class="header__mobile--dropdownitem">
            <label>Spot</label>
            <span>
              designed for the modern trader who demands convenience, flexibility, and
              security. Our spot wallet is tailored to meet the needs of active traders.
            </span>
          </div>
          <div class="header__mobile--dropdownitem">
            <label>Margin</label>
            <span>
              Our margin wallet is specifically designed for traders who want to use
              margin trading to amplify their gains.
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="header__desktop">
      <div class="header" :class="generalLandingPageStyle" id="header">
        <div class="header__left">
          <div class="header__logo" v-if="client" @click="$router.push('/overview')">
            <figure class="tradex-logo-headr">
              <img src="@/assets/imgs/logo_psb.png" />
            </figure>
            <p>Tradex Quant</p>
          </div>
          <div class="header__logo" v-if="!client" @click="$router.push('/')">
            <figure class="tradex-logo-headr">
              <img src="@/assets/imgs/logo_psb.png" />
            </figure>
            <p>Tradex Quant</p>
          </div>
          <div class="header__menu">
            <div class="header__menuitem" @click="navigateToPage('blog')">
              <label>Blog</label>
            </div>

            <!--<div
          class="header__menuitem"
          @click.stop="
            navigateToTradePage(
              `trade?autotrader=true&wallet=margin&assettype=${baseasset.assetType}`,
              baseasset._id
            )
          "
          v-if="!client"
        >
          <label>Markets</label>
        </div>-->

            <div
              class="header__menuitem"
              @click="scrollToDiv('landingperks')"
              v-if="!client"
            >
              <label>Account plans</label>
            </div>

            <div class="header__menuitem" @click="accountplanspage" v-if="client">
              <label>View Account plans</label>
            </div>

            <!-- <div
          class="header__menuitem"
          @click="openInNewTab('https://www.coindesk.com/business/')"
        >
          <label>News</label>
        </div>-->
          </div>
        </div>
        <div class="header__right">
          <!--<div class="header__search" :class="generalLandingPageStyle" id="header__search">
                <span class="header__search--logo">
                    <svg class="sc-aXZVg ktFCMi mx-icon iconfont iconsearch" focusable="false" width="1em" height="1em"
                        fill="currentColor" aria-hidden="true" viewBox="0 0 16 16" data-icon="SearchOutlined">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M9.93186 10.8786C9.02879 11.5806 7.89393 11.9987 6.66146 11.9987C3.71594 11.9987 1.32812 9.6109 1.32812 6.66536C1.32812 3.71984 3.71594 1.33203 6.66146 1.33203C9.60699 1.33203 11.9948 3.71984 11.9948 6.66536C11.9948 7.89783 11.5767 9.0327 10.8747 9.93576L14.4662 13.5273C14.7265 13.7876 14.7265 14.2098 14.4662 14.4701C14.2059 14.7304 13.7837 14.7304 13.5234 14.4701L9.93186 10.8786ZM10.6615 6.66536C10.6615 8.8745 8.87059 10.6654 6.66146 10.6654C4.45232 10.6654 2.66146 8.8745 2.66146 6.66536C2.66146 4.45622 4.45232 2.66536 6.66146 2.66536C8.87059 2.66536 10.6615 4.45622 10.6615 6.66536Z">
                        </path>
                    </svg>
                </span>
                <span class="header__search--input">
                    <input placeholder="Search" />
                </span>
            </div>-->

          <div class="header__btns header__menu" v-if="!client">
            <div class="header__menuitem">
              <button
                class="btn transparent landing rounded-corner header-padding"
                @click="navigateToPage('login')"
                id="login-btn"
              >
                Log In
              </button>
            </div>
            <div class="header__menuitem">
              <button
                class="btn padded-btn colored-btn colored landing rounded-corner header-padding"
                @click="navigateToPage('register')"
              >
                open an account
              </button>
            </div>
          </div>

          <div class="header__btns header__menu" v-if="client">
            <div class="header__menuitem" @click="navigateToPage('blog')">
              <label class="header__menuitem--username capitalize gold-colored">{{
                client.firstname ? `${client.firstname} ${client.lastname}` : ""
              }}</label>
            </div>

            <div class="header__menuitem">
              <button
                class="btn padded-btn neon-border neon-blue"
                @click="$router.push(`/wallet/fiatandspot`)"
              >
                {{ client.accountplan }}
              </button>
            </div>

            <button
              class="btn padded-btn colored-btn"
              @click="$router.push(`/wallet/fiatandspot`)"
            >
              Deposit
            </button>
            <div class="header__menuitem">
              <label></label>
            </div>
            <!--for adding margin between the btn above and the menuitem below ;)-->
            <!--<div class="header__menuitem">
                    <label>Convert</label>
                </div>-->
            <div class="header__menuitem">
              <span class="header__menuitem--svgbtn">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  class="r-1nao33i r-4qtqp9 r-yyyyoo r-lwhw9o r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-cnnz9e"
                >
                  <g>
                    <path
                      d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"
                    ></path>
                  </g>
                </svg>
              </span>
              <div class="header__dropdown right">
                <div class="header__dropdowncontent">
                  <!--<div class="header__dropdowncontent--item">
                <figure class="header__dropdowncontent--logo">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="" class="css-1s4hjvp">
                    <use xlink:href="#market-overview-g"></use>
                  </svg>
                </figure>
                <div>
                  <span class="header__dropdowncontent--headerlabel">Dashboard</span>
                  <span class="header__dropdowncontent--textlabel">
                    You received a deposit of 30,000 usdt
                  </span>
                </div>
              </div>-->

                  <div class="header__dropdowncontent--item" @click="triggerlogout">
                    <figure class="header__dropdowncontent--logo">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="" class="css-1s4hjvp">
                        <use xlink:href="#market-overview-g"></use>
                      </svg>
                    </figure>
                    <div>
                      <span class="header__dropdowncontent--headerlabel">Logout</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="header__menuitem notifications">
              <!-- <span class="notifications">20</span>-->
              <span class="header__menuitem--svgbtn">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  class="r-1nao33i r-4qtqp9 r-yyyyoo r-lwhw9o r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-cnnz9e"
                >
                  <g>
                    <path
                      d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z"
                    ></path>
                  </g>
                </svg>
              </span>
              <!-- <div class="header__dropdown right">
                        <div class="header__dropdowncontent">
                            <div class="header__dropdowncontent--item">
                                <figure class="header__dropdowncontent--logo">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="" class="css-1s4hjvp">
                                        <use xlink:href="#market-overview-g"></use>
                                    </svg>
                                </figure>
                                <div>
                                    <span class="header__dropdowncontent--headerlabel">Received Deposit</span>
                                    <span class="header__dropdowncontent--textlabel">
                                        You received a deposit of 30,000 usdt
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import generalutilities from "@/mixins/generalutilities";
import clientMixin from "@/mixins/client";
import cryptoassetsMixin from "@/mixins/cryptoassets";
import inhouseassetsMixin from "@/mixins/inhouseassets";

import socket from "~/plugins/socket";

export default {
  data() {
    return {
      sidenavopen: false,
    };
  },
  name: "Landing",
  mixins: [generalutilities, clientMixin, cryptoassetsMixin, inhouseassetsMixin],
  methods: {
    ...mapActions("auth", ["logout"]),
    accountplanspage() {
      this.$router.push({ name: "accountplans" });
    },
    triggerlogout() {
      const { logout } = this;
      logout().then(() => this.$router.push("/"));
    },
    scrollToDiv(mydivid) {
      const target = document.getElementById(`${mydivid}`);

      if (target) {
        const currentScrollPosition = window.pageYOffset;
        const distanceToTarget = target.offsetTop - currentScrollPosition;

        window.scroll(0, distanceToTarget);
      } else {
        window.location.href = `http://localhost:8082`;
      }
    },
    togglediv(refitem) {
      const dropdown = this.$refs[refitem];

      if (refitem === "mobiledropdown") {
        this.sidenavopen ? (this.sidenavopen = false) : (this.sidenavopen = true);
      }

      if (dropdown) {
        dropdown.classList.toggle("visible", !dropdown.classList.contains("visible"));
      }
    },
    routeToHomeTrade() {
      const url = "https://app.tradexquant.com";
      window.location.href = `${url}/`;
    },
  },
  mounted() {
    socket.on("connect", function () {
      console.log("Connected to server");
    });

    socket.on("disconnect", function () {
      console.log("Disconnected from server");
    });
  },
  computed: {
    ...mapState({
      assets: (state) => state.list.assets,
    }),
    baseasset() {
      const baseasset = this.assets.find((asset) => asset.coin === "BTC");

      return baseasset;
    },
    generalLandingPageStyle() {
      return {
        landing: this.$route.name === "index",
      };
    },
  },
};
</script>
