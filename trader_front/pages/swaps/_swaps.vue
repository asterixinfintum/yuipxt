<template>
  <div>
    <div>
      <TraderHeader />

      <div class="swaptransfer__assetslist" v-if="alopen" @click.stop="togglealopen">
        <div class="swaptransfer__assetslist--list">
          <div class="swaptransfer__assetslist--header">
            <h2 class="swaptransfer__assetslist--h2">Trade from</h2>

            <span class="swaptransfer__assetslist--close" @click.stop="togglealopen">
              <svg
                viewBox="0 0 24 24"
                focusable="false"
                class="chakra-icon css-onkibi"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"
                ></path>
              </svg>
            </span>
          </div>

          <div class="swaptransfer__assetslist--assetcategories">
            <span
              @click.stop="selectcategory('crypto')"
              :class="{ current: assetcat === 'crypto' }"
              >Crypto</span
            >
            <span
              @click.stop="selectcategory('stock')"
              :class="{ current: assetcat === 'stock' }"
              >Stocks</span
            >
            <span
              @click.stop="selectcategory('commodity')"
              :class="{ current: assetcat === 'commodity' }"
              >Commodities</span
            >
          </div>

          <div
            class="swaptransfer__assetslist--searchsec"
            @click.stop="
              {
              }
            "
          >
            <div class="swaptransfer__assetslist--search" ref="assetsearch">
              <span class="svg">
                <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-zgjiqu">
                  <path
                    fill="currentColor"
                    d="M23.384,21.619,16.855,15.09a9.284,9.284,0,1,0-1.768,1.768l6.529,6.529a1.266,1.266,0,0,0,1.768,0A1.251,1.251,0,0,0,23.384,21.619ZM2.75,9.5a6.75,6.75,0,1,1,6.75,6.75A6.758,6.758,0,0,1,2.75,9.5Z"
                  ></path>
                </svg>
              </span>

              <span class="input">
                <input
                  placeholder="Search for asset"
                  ref="assetsearchinput"
                  v-model="assetsearchval"
                />
              </span>
            </div>
          </div>

          <div class="swaptransfer__assetslist--items">
            <div
              class="swaptransfer__assetslist--item"
              v-for="asset in assetslist"
              @click.stop="selectasset(asset)"
            >
              <div class="swaptransfer__assetslist--area">
                <figure class="swaptransfer__assetslist--logo">
                  <img :src="`${BASE_URL}/${asset.assetlogo}`" />
                </figure>
              </div>
              <div class="swaptransfer__assetslist--area">
                <span class="name">{{ asset.assetname }}</span>
                <span class="initials">{{ asset.assetinitials }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="swaptransfer">
        <div class="swaptransfer__content">
          <div class="swaptransfer__content--slideup" v-if="swapconfirm">
            <div class="slideup__confirm">
              <div class="slideup__confirm--header">
                <span class="back" @click="toggleswapconfirm">
                  <svg
                    viewBox="0 0 24 24"
                    focusable="false"
                    class="chakra-icon css-onkibi"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
                    ></path>
                  </svg>
                </span>
                <h3 class="h3">Swap</h3>
                <span></span>
              </div>

              <div class="slideup__confirm--amount">
                <span class="assetunit"
                  >{{ assetfromvalue }}
                  {{ assetfrom ? assetfrom.assetinitials : "" }}</span
                >
                <span class="assetamount"
                  >≈ {{ expectedamount }} {{ assetto ? assetto.assetinitials : "" }}</span
                >
              </div>

              <div class="slideup__confirm--details">
                <div class="slideup__confirm--detailsarea">
                  <span>From</span>
                  <div class="slideup__confirm--asset">
                    <figure>
                      <img :src="`${BASE_URL}/${assetfrom.assetlogo}`" v-if="assetfrom" />
                    </figure>
                    <p>{{ assetfrom ? assetfrom.assetinitials : "" }}</p>
                  </div>
                </div>

                <div class="slideup__confirm--detailsarea">
                  <span>To</span>
                  <div class="slideup__confirm--asset">
                    <figure>
                      <img :src="`${BASE_URL}/${assetto.assetlogo}`" v-if="assetto" />
                    </figure>
                    <p>{{ assetto ? assetto.assetinitials : "" }}</p>
                  </div>
                </div>
              </div>

              <div class="slideup__confirm--details">
                <div class="slideup__confirm--detailsarea">
                  <span>Fee</span>
                  <span>${{ fee ? fee : "0.00" }}</span>
                </div>

                <div class="slideup__confirm--detailsarea">
                  <span>Total</span>
                  <span
                    >{{ total ? total : "0.00" }}
                    {{ assetfrom ? assetfrom.assetinitials : "" }}</span
                  >
                </div>
              </div>

              <div class="slideup__confirm--btnarea">
                <button @click="confirmswap">Confirm Swap</button>
              </div>
            </div>
          </div>

          <div class="swaptransfer__content--slideup submitting" v-if="swapcomplete">
            <div class="slideup__submitting">
              <div class="slideup__submitting--header">
                <div class="slideup__confirm--header">
                  <span
                    class="back"
                    @click="
                      () => {
                        swapcomplete = false;
                      }
                    "
                  >
                    <svg
                      viewBox="0 0 24 24"
                      focusable="false"
                      class="chakra-icon css-onkibi"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
                      ></path>
                    </svg>
                  </span>
                  <h3 class="h3"></h3>
                  <span></span>
                </div>
                <h3>Swap execution complete</h3>
              </div>
            </div>
          </div>

          <div class="swaptransfer__content--slideup submitting" v-if="submitting">
            <div class="slideup__submitting">
              <div class="slideup__submitting--loading">
                <span class="arrow left">
                  <svg
                    viewBox="0 0 24 24"
                    focusable="false"
                    class="chakra-icon css-onkibi"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
                    ></path>
                  </svg>
                </span>
                <span class="arrow right">
                  <svg
                    viewBox="0 0 24 24"
                    focusable="false"
                    class="chakra-icon css-onkibi"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
                    ></path>
                  </svg>
                </span>
              </div>

              <div class="slideup__submitting--header">
                <h3>Submitting Transaction</h3>
              </div>

              <div class="slideup__submitting--details">
                <p>
                  Swapping {{ assetfromvalue ? assetfromvalue : "" }}
                  {{ assetfrom ? assetfrom.assetinitials : "" }} for
                  {{ expectedamount ? expectedamount : "" }}
                  {{ assetfrom ? assetto.assetinitials : "" }}
                </p>
              </div>
            </div>
          </div>

          <div class="swaptransfer__content--header">
            <div class="swaptransfer__content--h2">
              <h2>
                <span
                  class="swap menu-item"
                  :class="{ current: switchbtn === 'swap' }"
                  @click="toggleswitch('swap')"
                  >Swap</span
                >
                <span>|</span>
                <span
                  class="transfer menu-item"
                  :class="{ current: switchbtn === 'transfer' }"
                  @click="toggleswitch('transfer')"
                  >Transfer</span
                >
              </h2>
            </div>

            <div class="swaptransfer__content--switch">
              <button
                @click.stop="togglewalletbtn('spot')"
                :class="{ current: walletbtn === 'spot' }"
              >
                Spot wallet
              </button>
              <button
                @click.stop="togglewalletbtn('margin')"
                :class="{ current: walletbtn === 'margin' }"
              >
                Margin wallet
              </button>
            </div>
          </div>

          <div class="swaptransfer__swap" v-if="switchbtn === 'swap'">
            <div class="swaptransfer__swap--section top">
              <div class="swaptransfer__swap--header">
                <span class="paywith">Pay With</span>
                <span class="balance"
                  >Balance:
                  {{ assetfrom ? formatNumberForSpecificLocale(assetfrom.blc) : "" }}
                  {{ assetfrom ? assetfrom.assetinitials : "" }}</span
                >
              </div>

              <div class="swaptransfer__swap--assetarea">
                <div
                  class="swaptransfer__swap--assetborder"
                  @click.stop="openassetsdialogue('from')"
                >
                  <figure>
                    <img :src="`${BASE_URL}/${assetfrom.assetlogo}`" v-if="assetfrom" />
                  </figure>
                  <span class="asset">{{
                    assetfrom ? assetfrom.assetinitials : ""
                  }}</span>
                  <span class="arrow">
                    <svg
                      viewBox="0 0 24 24"
                      focusable="false"
                      class="chakra-icon css-onkibi"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
                      ></path>
                    </svg>
                  </span>
                </div>

                <span class="swaptransfer__swap--assettype">{{
                  assetfrom ? assetfrom.assettype : ""
                }}</span>

                <div class="swaptransfer__swap--input">
                  <input
                    type="number"
                    v-model="assetfromvalue"
                    ref="assetfromvalueinput"
                  />
                  <div class="swaptransfer__swap--inputmax">
                    <span @click="setmax">Max</span>
                  </div>
                </div>

                <div class="swaptransfer__swap--usdvalue">
                  <span
                    >≈ ${{
                      fromAsset_quantity === 0
                        ? `0.00`
                        : formatNumberForSpecificLocale(fromAsset_quantity)
                    }}</span
                  >
                </div>
              </div>
            </div>

            <div class="swaptransfer__swap--section bottom">
              <div class="swaptransfer__swap--arrowcircle">
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
                    ></path>
                  </svg>
                </span>
              </div>

              <div class="swaptransfer__swap--header">
                <span class="paywith">You Get</span>
                <span class="balance"
                  >Balance:
                  {{ assetto ? formatNumberForSpecificLocale(assetto.blc) : "" }}
                  {{ assetto ? assetto.assetinitials : "" }}</span
                >
              </div>

              <div class="swaptransfer__swap--assetarea">
                <div
                  class="swaptransfer__swap--assetborder"
                  @click.stop="openassetsdialogue('to')"
                >
                  <figure>
                    <img :src="`${BASE_URL}/${assetto.assetlogo}`" v-if="assetto" />
                  </figure>
                  <span class="asset">{{ assetto ? assetto.assetinitials : "" }}</span>
                  <span class="arrow">
                    <svg
                      viewBox="0 0 24 24"
                      focusable="false"
                      class="chakra-icon css-onkibi"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
                      ></path>
                    </svg>
                  </span>
                </div>

                <span class="swaptransfer__swap--assettype">{{
                  assetto ? assetto.assettype : ""
                }}</span>
              </div>
            </div>

            <div class="swaptransfer__swap--summary">
              <div class="swaptransfer__swap--summaryarea" v-if="assetfromvalue">
                <div class="swaptransfer__swap--summaryareale left white-label">
                  <span class="svg">
                    <svg
                      viewBox="0 0 24 24"
                      focusable="false"
                      class="chakra-icon css-aj9lgj"
                    >
                      <path
                        fill="currentColor"
                        d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,19a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,12,19Zm1.6-6.08a1,1,0,0,0-.6.917,1,1,0,1,1-2,0,3,3,0,0,1,1.8-2.75A2,2,0,1,0,10,9.255a1,1,0,1,1-2,0,4,4,0,1,1,5.6,3.666Z"
                      ></path>
                    </svg>
                  </span>
                  <span
                    >1 {{ assetfrom ? assetfrom.assetinitials : "" }} =
                    {{
                      assetfrom_to_assetto
                        ? formatNumberForSpecificLocale(assetfrom_to_assetto)
                        : ""
                    }}
                    {{ assetto ? assetto.assetinitials : "" }}</span
                  >
                </div>

                <div class="swaptransfer__swap--summaryareale right">
                  <span class="svg">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 512 512"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M336 448H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h320c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm157.2-340.7l-81-81c-6.2-6.2-16.4-6.2-22.6 0l-11.3 11.3c-6.2 6.2-6.2 16.4 0 22.6L416 97.9V160c0 28.1 20.9 51.3 48 55.2V376c0 13.2-10.8 24-24 24s-24-10.8-24-24v-32c0-48.6-39.4-88-88-88h-8V64c0-35.3-28.7-64-64-64H96C60.7 0 32 28.7 32 64v352h288V304h8c22.1 0 40 17.9 40 40v27.8c0 37.7 27 72 64.5 75.9 43 4.3 79.5-29.5 79.5-71.7V152.6c0-17-6.8-33.3-18.8-45.3zM256 192H96V64h160v128z"
                      ></path>
                    </svg>
                  </span>
                  <span
                    >${{ fee ? fee : "0.00" }} |
                    {{ feededuction ? formatNumberForSpecificLocale(feededuction) : "" }}
                    {{ assetfrom ? assetfrom.assetinitials : "" }}</span
                  >
                </div>
              </div>

              <div class="swaptransfer__swap--summaryarea" v-if="expectedamount">
                <div class="swaptransfer__swap--summaryareale left grey-label">
                  <span>Expected Amount</span>
                </div>

                <div class="swaptransfer__swap--summaryareale right white-label">
                  <span
                    >{{ expectedamount ? expectedamount : "0.00 "
                    }}{{ assetto ? ` ${assetto.assetinitials}` : "" }}</span
                  >
                </div>
              </div>

              <div class="swaptransfer__swap--summaryarea" v-if="expectedamountUSD">
                <div class="swaptransfer__swap--summaryareale left grey-label">
                  <span>Expected Amount (USD)</span>
                </div>

                <div class="swaptransfer__swap--summaryareale right white-label">
                  <span
                    >≈ ${{
                      expectedamountUSD === 0
                        ? "0.00"
                        : formatNumberForSpecificLocale(expectedamountUSD)
                    }}</span
                  >
                </div>
              </div>

              <div class="swaptransfer__swap--btn">
                <button class="blue dim" v-if="!allowswap">Preview Swap</button>

                <button class="blue" v-if="allowswap" @click="toggleswapconfirm">
                  Preview Swap
                </button>
              </div>
            </div>
          </div>

          <div class="swaptransfer__transfer top" v-if="switchbtn === 'transfer'">
            <div
              class="swaptransfer__content--slideup submitting"
              v-if="transfercomplete"
            >
              <div class="slideup__submitting">
                <div class="slideup__submitting--header">
                  <div class="slideup__confirm--header">
                    <span class="back" @click="transfercomplete = false">
                      <svg
                        viewBox="0 0 24 24"
                        focusable="false"
                        class="chakra-icon css-onkibi"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
                        ></path>
                      </svg>
                    </span>
                    <h3 class="h3"></h3>
                    <span></span>
                  </div>
                  <h3>Transfer completed</h3>
                </div>
              </div>
            </div>

            <div
              class="swaptransfer__content--slideup submitting"
              v-if="submittingtransfer"
            >
              <div class="slideup__submitting">
                <div class="slideup__submitting--loading">
                  <span class="arrow left">
                    <svg
                      viewBox="0 0 24 24"
                      focusable="false"
                      class="chakra-icon css-onkibi"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
                      ></path>
                    </svg>
                  </span>
                  <span class="arrow right">
                    <svg
                      viewBox="0 0 24 24"
                      focusable="false"
                      class="chakra-icon css-onkibi"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
                      ></path>
                    </svg>
                  </span>
                </div>

                <div class="slideup__submitting--header">
                  <h3>
                    Transfering {{ assetfromvalue }}
                    {{ assetfrom ? assetfrom.assetinitials : "" }} (${{
                      fromAsset_quantity === 0
                        ? `0.00`
                        : formatNumberForSpecificLocale(fromAsset_quantity)
                    }}) from your
                    <span class="assetamount">{{
                      walletbtn === "spot" ? "Spot wallet" : "Margin wallet"
                    }}</span>
                    to your
                    <span class="assetamount">{{
                      walletbtn === "spot" ? "Margin wallet" : "Spot wallet"
                    }}</span>
                  </h3>
                </div>
              </div>
            </div>

            <div class="swaptransfer__transferpreview" v-if="transferconfirm">
              <div class="slideup__confirm--header">
                <span class="back" @click="toggletransferconfirm">
                  <svg
                    viewBox="0 0 24 24"
                    focusable="false"
                    class="chakra-icon css-onkibi"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
                    ></path>
                  </svg>
                </span>
                <h3 class="h3">Transfer</h3>
                <span></span>
              </div>
              <div class="slideup__confirm--amount">
                <span class="assetunit"
                  >You're about to transfer {{ assetfromvalue }}
                  {{ assetfrom ? assetfrom.assetinitials : "" }} (${{
                    fromAsset_quantity === 0
                      ? `0.00`
                      : formatNumberForSpecificLocale(fromAsset_quantity)
                  }}) to your</span
                >
                <span class="assetamount">{{
                  walletbtn === "spot" ? "Margin wallet" : "Spot wallet"
                }}</span>
              </div>

              <div class="slideup__confirm--btnarea">
                <button @click="confirmtransfer">Confirm Transfer</button>
              </div>
            </div>

            <div class="swaptransfer__swap--section">
              <div class="swaptransfer__swap--header">
                <span class="paywith"
                  >Transfer to
                  {{ walletbtn === "spot" ? "Margin wallet" : "Spot wallet" }}</span
                >
                <span class="balance"
                  >Balance:
                  {{ assetfrom ? formatNumberForSpecificLocale(assetfrom.blc) : "" }}
                  {{ assetfrom ? assetfrom.assetinitials : "" }}</span
                >
              </div>

              <div class="swaptransfer__transfer--content">
                <div class="swaptransfer__swap--assetarea">
                  <div class="swaptransfer__swap--assetborder" @click="togglealopen">
                    <figure>
                      <img :src="`${BASE_URL}/${assetfrom.assetlogo}`" v-if="assetfrom" />
                    </figure>
                    <span class="asset">{{
                      assetfrom ? assetfrom.assetinitials : ""
                    }}</span>
                    <span class="arrow">
                      <svg
                        viewBox="0 0 24 24"
                        focusable="false"
                        class="chakra-icon css-onkibi"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
                        ></path>
                      </svg>
                    </span>
                  </div>

                  <span class="swaptransfer__swap--assettype">{{
                    assetfrom ? assetfrom.assettype : ""
                  }}</span>
                </div>

                <div class="swaptransfer__transfer--input">
                  <div class="swaptransfer__swap--input">
                    <input
                      type="number"
                      v-model="assetfromvalue"
                      ref="assetfromvalueinput"
                    />
                    <div class="swaptransfer__swap--inputmax">
                      <span @click="setmax">Max</span>
                    </div>
                  </div>

                  <div class="swaptransfer__swap--usdvalue">
                    <span
                      >≈ ${{
                        fromAsset_quantity === 0
                          ? `0.00`
                          : formatNumberForSpecificLocale(fromAsset_quantity)
                      }}</span
                    >
                  </div>
                </div>

                <div class="swaptransfer__swap--summary">
                  <div class="swaptransfer__swap--btn">
                    <button class="blue dim" v-if="!allowtransfer">
                      Preview Transfer
                    </button>

                    <button
                      class="blue"
                      v-if="allowtransfer"
                      @click="toggletransferconfirm"
                    >
                      Preview Transfer
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
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

import BASE_VARS from "@/store/base_vars";

const { BASE_URL } = BASE_VARS;

export default {
  data() {
    return {
      switchbtn: "swap", //swap, transfer
      walletbtn: "spot",
      assetfromvalue: 0,
      alopen: false,
      assetcat: "crypto",
      assets: [],
      assetslist: [],
      BASE_URL,
      assetsearchval: "",
      assetfrom: null,
      assetto: null,
      swapdirection: "from",
      gettingrate: false,
      fromAsset_quantity: 0,
      expectedamount: 0,
      expectedamountUSD: 0,
      assetfrom_to_assetto: 0,
      fee: 3.81,
      feededuction: null,
      total: 0,
      swapconfirm: false,
      submitting: false,
      swapcomplete: false,
      transferconfirm: false,
      submittingtransfer: false,
      transfercomplete: false,
    };
  },
  computed: {
    ...mapState({
      spotwallet: (state) => state.userwallet.spotwallet,
      marginwallet: (state) => state.userwallet.marginwallet,
    }),
    allowswap() {
      if (this.assetfrom && this.assetfrom.blc) {
        if (this.assetfrom.assetid === this.assetto.assetid) {
          return false;
        }

        if (!this.expectedamount || this.expectedamountUSD < 6) {
          return false;
        }

        if (this.assetfrom.blc < this.total) {
          return false;
        }

        return true;
      }

      return false;
    },
    allowtransfer() {
      if (this.assetfrom && this.assetfrom.blc) {
        if (!this.assetfromvalue || parseFloat(this.assetfromvalue) === 0) {
          return false;
        }

        return true;
      }

      return false;
    },
  },
  watch: {
    assetfrom() {
      this.reset();
      this.assetfromvalue = 0;
    },
    assetto() {
      this.reset();
      this.assetfromvalue = 0;
    },
    assetfromvalue(newval, oldval) {
      if (newval) {
        this.getrates();

        this.getfeededuction();

        return;
      }

      this.reset();
    },
    spotwallet(newval, oldval) {
      if (newval) {
        this.selectcategory("crypto");
      }
    },
    assets(newval, oldval) {
      if (!this.assetfrom) {
        this.assetfrom = newval[0];
      }

      if (!this.assetto) {
        this.assetto = newval[1];
      }
    },
    switchbtn() {
      this.assetslist = this.assets;
      this.assetsearchval = "";

      this.reset();
      this.assetfromvalue = 0;
    },
    assetsearchval(newval, oldval) {
      const { assets } = this;

      if (assets.length) {
        const searchVal = this.assetsearchval.trim().toLowerCase();

        const filtered = assets.filter(
          (asset) =>
            asset.assetname.trim().toLowerCase().includes(searchVal) ||
            asset.assetinitials.trim().toLowerCase().includes(searchVal)
        );

        this.assetslist = filtered;
      }
    },
    async walletbtn(newval, oldval) {
      if (this.assetfrom) {
        this.assetcat = this.assetfrom.assettype;

        await this.getassets();

        if (this.assetfrom) {
          const assetfrom = await this.assets.find(
            (asset) =>
              asset.assetname.trim().toLowerCase() ===
              this.assetfrom.assetname.trim().toLowerCase()
          );

          this.assetfrom = assetfrom ? assetfrom : this.assets[0];

          if (this.assetto) {
            this.assetcat = this.assetfrom.assettype;

            await this.getassets();

            const assetto = await this.assets.find(
              (asset) =>
                asset.assetname.trim().toLowerCase() ===
                this.assetto.assetname.trim().toLowerCase()
            );

            this.assetto = assetto ? assetto : this.assets[1];
          }
        }
      }
    },
  },
  mounted() {
    const assetfromvalueinput = this.$refs.assetfromvalueinput;

    assetfromvalueinput.addEventListener("focus", function () {
      this.select();
    });

    assetfromvalueinput.addEventListener("blur", () => {
      if (!this.assetfromvalue) {
        this.assetfromvalue = 0;
      }
    });
  },
  methods: {
    toggletransferconfirm() {
      this.transferconfirm
        ? (this.transferconfirm = false)
        : (this.transferconfirm = true);
    },
    async confirmtransfer() {
      try {
        const token = localStorage.getItem("873__jh6bdjktoken");

        let walletfromid;
        let wallettoid;

        if (this.walletbtn === "spot") {
          walletfromid = this.spotwallet._id;
          wallettoid = this.marginwallet._id;
        } else {
          walletfromid = this.marginwallet._id;
          wallettoid = this.spotwallet._id;
        }

        const transferinfo = {
          walletfromid,
          wallettoid,
          assetfromid: this.assetfrom.assetid,
          totaltodeductfromassetfrom: this.assetfromvalue,
        };

        this.submittingtransfer = true;
        this.transferconfirm = false;

        const response = await fetch(`${BASE_URL}/transfer/userwallet/asset`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(transferinfo),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          this.transfercomplete = true;
          this.submittingtransfer = false;

          this.reset();
          this.assetfromvalue = 0;
        }
      } catch (error) {
        this.transfercomplete = false;
        this.submittingtransfer = false;
        this.reset();
        this.assetfromvalue = 0;
        throw error;
      }
    },
    async confirmswap() {
      try {
        const token = localStorage.getItem("873__jh6bdjktoken");

        let walletid;

        if (this.walletbtn === "spot") {
          walletid = this.spotwallet._id;
        } else {
          walletid = this.marginwallet._id;
        }

        const swapinfo = {
          walletid,
          assetfromid: this.assetfrom.assetid,
          assettoid: this.assetto.assetid,
          totaltodeductfromassetfrom: this.total,
          amounttoaddtoassetto: this.expectedamount,
        };

        this.swapconfirm = false;
        this.submitting = true;

        const response = await fetch(`${BASE_URL}/swap/userwallet/asset`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(swapinfo),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          this.submitting = false;
          this.swapcomplete = true;
          this.reset();
          await this.getassets();
        }
      } catch (error) {
        throw error;
      }
      const token = localStorage.getItem("873__jh6bdjktoken");

      const swapinfo = {};
    },
    toggleswapconfirm() {
      if (!this.swapconfirm) {
        this.swapconfirm = true;
      } else {
        this.swapconfirm = false;
      }
    },
    reset() {
      this.fromAsset_quantity = 0;
      this.expectedamount = 0;
      this.expectedamountUSD = 0;
      this.assetfrom_to_assetto = 0;
    },
    async setmax() {
      if (this.assetfrom) {
        if (this.assetfrom.blc) {
          await this.getfeededuction();

          this.assetfromvalue = this.assetfrom.blc - this.feededuction;
          this.total = this.assetfromvalue + this.feededuction;
        }
      }
    },
    formatNumberForSpecificLocale(number, locale = "en-US") {
      if (number) {
        return number.toLocaleString(locale);
      } else {
        return "0";
      }
    },
    openassetsdialogue(swapdirection) {
      this.swapdirection = swapdirection;
      this.togglealopen();
    },
    selectasset(asset) {
      if (this.swapdirection === "from") {
        this.assetfrom = asset;
      } else {
        this.assetto = asset;
      }

      this.togglealopen();
    },
    setupAssetSearchInputListeners() {
      // Add event listeners or perform actions once assetsearchinput is available
      this.$refs.assetsearchinput.addEventListener("focus", () => {
        this.$refs.assetsearch.classList.add("focus");
      });

      this.$refs.assetsearchinput.addEventListener("blur", () => {
        this.$refs.assetsearch.classList.remove("focus");
      });
    },
    async getfeededuction() {
      const token = localStorage.getItem("873__jh6bdjktoken");

      if (token) {
        try {
          const { assetfrom, fee } = this;

          const response = await fetch(
            `${BASE_URL}/swap/getfeededuction?assetfromid=${assetfrom.assetid}&swapfee=${fee}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          const { feededuction } = data;

          this.feededuction = feededuction;
        } catch (error) {
          throw error;
        }
      }
    },
    async getrates() {
      const token = localStorage.getItem("873__jh6bdjktoken");

      if (token) {
        try {
          const { assetfrom, assetto, assetfromvalue, fee } = this;

          this.gettingrate = true;

          const response = await fetch(
            `${BASE_URL}/swap/getrates?assetfromid=${assetfrom.assetid}&assettoid=${assetto.assetid}&inputvalue=${assetfromvalue}&swapfee=${fee}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          const {
            message,
            expectedamount,
            fromAssetprice,
            toAssetprice,
            fromAsset_quantity,
            expectedamountUSD,
            assetfrom_to_assetto,
            feededuction,
            total,
          } = data;

          if (message === "rate available") {
            this.expectedamount = expectedamount;
            this.expectedamountUSD = expectedamountUSD;

            this.fromAsset_quantity = fromAsset_quantity;
            this.assetfrom_to_assetto = assetfrom_to_assetto;
            this.total = total;
          } else {
            await this.reset();
            this.fromAsset_quantity = fromAsset_quantity;
          }
        } catch (error) {
          throw error;
        }
      }
    },
    async getassets() {
      const { assetcat } = this;

      try {
        const token = localStorage.getItem("873__jh6bdjktoken");

        let walletid;

        if (this.walletbtn === "spot") {
          walletid = this.spotwallet._id;
        } else {
          walletid = this.marginwallet._id;
        }

        if (token) {
          const response = await fetch(
            `${BASE_URL}/swap/getassets?walletid=${walletid}&assetype=${this.assetcat}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();
          const { walletassets_list } = data;

          this.assets = walletassets_list;
          this.assetslist = walletassets_list;
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    },
    selectcategory(assetcat) {
      this.assetcat = assetcat;

      this.getassets();
    },
    togglealopen() {
      this.getassets();
      this.alopen ? (this.alopen = false) : (this.alopen = true);
    },
    toggleswitch(switchbtn) {
      this.switchbtn = switchbtn;
    },
    togglewalletbtn(walletbtn) {
      this.walletbtn = walletbtn;
    },
  },
};
</script>

<style lang="scss" scoped>
$swap-background: #2d3748;
$swap-side-padding: 0 #{scaleValue(25)};
$border: 1px solid rgb(43, 49, 58);
$gold-b: rgb(240, 185, 11);
$dialogue-background: #2d3748;

@keyframes slideIn {
  0% {
    transform: translateY(100%);
  }

  50% {
    transform: translateY(-10%);
  }

  100% {
    transform: translateY(0);
  }
}

.swaptransfer {
  &__assetslist {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background: rgba($swap-background, 0.5);
    z-index: 9;

    &--list {
      min-height: #{scaleValue(100)};
      padding: #{scaleValue(25)} 0;
      width: #{scaleValue(500)};
      background: $dialogue-background;
      margin: 0 auto;
      margin-top: #{scaleValue(130)};
      border-radius: #{scaleValue(10)};
    }

    &--header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: #{scaleValue(20)};
      padding: 0 #{scaleValue(25)};
    }

    &--h2 {
      font-size: #{scaleValue(18)};
      font-weight: 500;
    }

    &--assetcategories {
      color: rgba($white, 0.5);
      font-size: #{scaleValue(14)};
      display: flex;
      align-items: center;
      margin-bottom: #{scaleValue(20)};
      padding: 0 #{scaleValue(25)};

      & span {
        cursor: pointer;
        margin-right: #{scaleValue(40)};
        transition: all 0.5s ease;

        &:hover {
          color: $gold-b;
        }

        &.current {
          color: $gold-b;
        }
      }
    }

    &--close {
      cursor: pointer;

      & svg {
        height: #{scaleValue(10)};
        width: #{scaleValue(10)};
        fill: rgba($white, 0.6);
      }
    }

    &--search {
      display: flex;
      align-items: center;
      border-radius: #{scaleValue(6)};
      padding: 0 #{scaleValue(10)};
      overflow: hidden;
      background: rgba($black, 0.5);
      border: 1px solid transparent;
      margin-bottom: #{scaleValue(20)};

      &.focus {
        border: 1px solid $gold-b;
      }

      &:hover {
        border: 1px solid $gold-b;
      }

      & span {
        display: flex;
        align-items: center;

        &.svg {
          margin-right: #{scaleValue(10)};
        }

        &.input {
          flex: 1;
        }

        & svg {
          height: #{scaleValue(17)};
          width: #{scaleValue(17)};
          fill: rgba($white, 0.6);
        }

        & input {
          width: 100%;
          height: #{scaleValue(43)};
          border: none;
          outline: none;
          background: transparent;
          color: $white;
          font-size: #{scaleValue(15)};
        }
      }
    }

    &--items {
      padding: 0 #{scaleValue(12)};
      height: #{scaleValue(300)};
      overflow-y: scroll;
    }

    &--item {
      display: flex;
      align-items: center;
      padding: #{scaleValue(10)} #{scaleValue(10)};
      border: 1px solid transparent;
      border-radius: #{scaleValue(10)};
      transition: all 0.5s ease;
      cursor: pointer;

      &:hover {
        //border: 1px solid $neon-blue;
        background: rgba(#4a5568, 0.3);
      }
    }

    &--logo {
      border-radius: 100%;
      overflow: hidden;
      height: #{scaleValue(30)};
      width: #{scaleValue(30)};

      & img {
        object-fit: contain;
        height: 100%;
        width: 100%;
      }
    }

    &--area {
      display: flex;
      flex-direction: column;
      margin-right: #{scaleValue(15)};

      & span {
        &.name {
          font-size: #{scaleValue(15)};
          color: rgba($neon-blue, 0.4);
          font-weight: 500;
        }

        &.initials {
          font-size: #{scaleValue(13)};
          color: rgba($white, 0.4);
        }
      }
    }

    &--searchsec {
      padding: 0 #{scaleValue(25)};
    }
  }

  &__content {
    margin: 0 auto;
    border-radius: #{scaleValue(10)};
    background: rgba($swap-background, 0.2);
    width: #{scaleValue(550)};
    min-height: #{scaleValue(200)};
    margin-top: #{scaleValue(50)};
    padding: #{scaleValue(25)} 0;
    padding-bottom: 0;
    overflow: hidden;

    position: relative;

    &--slideup {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      min-height: #{scaleValue(25)};
      z-index: 4;

      animation: slideIn 0.5s ease-in-out;

      &.submitting {
        &::before {
          content: "";
          position: absolute;
          width: 100%;
          background: rgba($black, 0.4);
          bottom: #{scaleValue(238)};
          left: 0;
          height: #{scaleValue(270)};
        }
      }
    }

    &--header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $swap-side-padding;
    }

    &--h2 {
      & h2 {
        font-weight: 500;
        font-size: #{scaleValue(14)};

        & span {
          cursor: pointer;

          &.current {
            color: $gold;
          }
        }
      }
    }

    &--switch {
      border-radius: #{scaleValue(20)};
      background: rgba($swap-background, 0.5);
      overflow: hidden;
      display: grid;
      grid-template-columns: repeat(2, 1fr);

      & button {
        cursor: pointer;
        color: $white;
        background: transparent;
        border: none;
        font-size: #{scaleValue(11)};
        padding: #{scaleValue(8)} #{scaleValue(10)};
        transition: all 0.5s ease;

        &.current {
          background: rgba($swap-background, 0.9);
          color: $neon-blue;
        }
      }
    }
  }

  &__swap {
    &--header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding: $swap-side-padding;

      & span {
        &.paywith {
          font-size: #{scaleValue(12.8)};
        }

        &.balance {
          font-size: #{scaleValue(12)};
          color: rgba($white, 0.4);
        }
      }
    }

    &--arrowcircle {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      & span {
        display: flex;
        justify-content: center;
        align-items: center;
        border: $border;
        border-radius: 100%;
        height: #{scaleValue(30)};
        width: #{scaleValue(30)};
        background: rgba($swap-background, 1);
        transform: translateY(#{scaleValue(-14)});
        cursor: pointer;
        transition: all 0.5s ease;

        &:hover {
          background: #212631;
        }

        & svg {
          height: #{scaleValue(15)};
          width: #{scaleValue(15)};
        }
      }
    }

    &--section {
      margin-top: #{scaleValue(40)};
      position: relative;

      &.bottom {
        padding-top: #{scaleValue(20)};
        margin-top: #{scaleValue(20)};
        border-top: $border;
      }
    }

    &--assetarea {
      display: flex;
      margin-top: #{scaleValue(10)};
      flex-direction: column;
      padding: 0 #{scaleValue(25)};
    }

    &--assetborder {
      display: flex;
      align-items: center;
      background: rgba($swap-background, 0.9);
      padding: #{scaleValue(8)} #{scaleValue(10)};
      border-radius: #{scaleValue(20)};
      width: #{scaleValue(100)};
      justify-content: space-between;
      cursor: pointer;
      transform: translateX(#{scaleValue(-5)});

      & figure {
        height: #{scaleValue(20)};
        width: #{scaleValue(20)};
        border-radius: 100%;
        display: flex;
        align-items: center;
        overflow: hidden;

        & img {
          object-fit: contain;
          height: 100%;
          width: 100%;
        }
      }

      & span {
        display: flex;
        align-items: center;

        &.asset {
          font-size: #{scaleValue(13)};
        }

        &.arrow {
          & svg {
            height: #{scaleValue(13)};
            width: #{scaleValue(13)};
          }
        }
      }
    }

    &--input {
      position: relative;
      margin-top: #{scaleValue(12)};

      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input[type="number"]::-moz-focus-inner {
        border: 0;
      }

      input[type="number"]::-ms-clear,
      input[type="number"]::-ms-reveal {
        display: none;
      }

      & input {
        width: 100%;
        height: #{scaleValue(40)};

        -webkit-appearance: none; /* for Chrome, Safari */
        -moz-appearance: none; /* for Firefox */
        appearance: none;
        padding-right: #{scaleValue(50)};
        background: transparent;
        border: none;
        outline: none;
        color: $white;
        font-size: #{scaleValue(24)};
      }
    }

    &--inputmax {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      display: flex;
      align-items: center;
      font-size: #{scaleValue(11)};
      color: rgba($neon-blue, 0.6);

      & span {
        cursor: pointer;
        padding: #{scaleValue(5)} #{scaleValue(11)};
        border-radius: #{scaleValue(11)};
        background: rgba($black, 0.6);
      }
    }

    &--usdvalue {
      color: rgba($white, 0.4);
      margin-top: #{scaleValue(12)};
      font-size: #{scaleValue(13)};
    }

    &--summary {
      padding: $swap-side-padding;
      padding-top: #{scaleValue(30)};
      padding-bottom: #{scaleValue(30)};

      background: rgba(#2d3748, 0.4);
      padding-bottom: #{scaleValue(25)};
      margin-top: #{scaleValue(20)};
    }

    &--summaryarea {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    &--assettype {
      display: inline-block;
      font-size: #{scaleValue(8)};
      color: rgba($neon-pink, 1);
      margin-top: #{scaleValue(13)};

      text-transform: uppercase;
    }

    &--summaryareale {
      display: flex;
      align-items: center;
      font-size: #{scaleValue(13)};
      color: rgba($white, 0.8);
      margin-bottom: #{scaleValue(15)};

      & span {
        display: flex;
        align-items: center;

        &.svg {
          margin-right: #{scaleValue(8)};

          & svg {
            height: #{scaleValue(13)};
            width: #{scaleValue(13)};
            fill: #8c9bab;
          }
        }
      }

      &.grey-label {
        color: rgba($white, 0.5);
      }
    }

    &--btn {
      & button {
        width: 100%;
        color: $white;
        border: none;
        outline: none;
        background: $primary-color;
        border-radius: #{scaleValue(6)};
        padding: #{scaleValue(14)};
        cursor: pointer;
        font-size: #{scaleValue(14)};
      }
    }
  }

  &__transfer {
    position: relative;

    &--input {
      padding: $swap-side-padding;
    }
  }

  &__transferpreview {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    min-height: #{scaleValue(25)};
    z-index: 4;

    animation: slideIn 0.5s ease-in-out;

    background: #141a25;
    padding: #{scaleValue(25)};
  }
}
</style>
