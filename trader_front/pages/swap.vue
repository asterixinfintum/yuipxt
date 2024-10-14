<template>
  <div>
    <div class="swap">
      <div class="content">
        <HeaderBox />

        <div class="content__body">
          <div class="container">
            <SideNav />

            <div v-if="confirmTrade">
              <PreviewTrade
                :contentObj="{
                  ownerId: client ? client._id : '',
                  currentAssetFrom: currentAssetFrom ? currentAssetFrom._id : '',
                  currentAssetTo: currentAssetTo ? currentAssetTo._id : '',
                  toCoin: currentAssetTo ? currentAssetTo.coin : '',
                  fromCoin: currentAssetFrom ? currentAssetFrom.coin : '',
                  transactionType,
                  fromInput,
                  toInput,
                  wallet: wallet._id,
                  assetCategoryTo,
                  transactionFee,
                  walletCategory,
                  transactionTotal: conversiontotal,
                  youPayUSD: youpayval,
                  youGetUSD: yougetval,
                  transactionFee: calculatePercentage(fromInput, 5),
                  rate:
                    currentAssetFrom && currentAssetTo
                      ? compareAssetsPrices(currentAssetFrom.price, currentAssetTo.price)
                      : '',
                }"
                :toggleconfirmTrade="toggleconfirmTrade"
              />
            </div>

            <div class="popup" v-if="walletCategoriesOpen">
              <div class="popup__body transactionstyle__body">
                <div class="transactionstyle__subject">
                  <div class="transactionstyle__subject--name">
                    <h3>Select wallet to swap in</h3>
                  </div>
                  <div
                    class="transactionstyle__subject--closebtn"
                    @click="toggleWalletCat"
                  >
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
                  </div>
                </div>

                <div class="transactionstyle__btnoptionsgrid">
                  <div
                    class="transactionstyle__btnoptionsgridsection"
                    @click="selectWallet('fiat/spot')"
                  >
                    <div class="transactionstyle__btnoptionsgridsection--svg">
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
                    <div class="transactionstyle__btnoptionsgridsection--text">
                      Fiat and Spot
                    </div>
                  </div>

                  <div
                    class="transactionstyle__btnoptionsgridsection"
                    @click="selectWallet('margin')"
                  >
                    <div class="transactionstyle__btnoptionsgridsection--svg">
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
                    <div class="transactionstyle__btnoptionsgridsection--text">
                      Margin
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="popup" v-if="assetCategoriesOpen">
              <div class="popup__body transactionstyle__body">
                <div class="transactionstyle__subject">
                  <div class="transactionstyle__subject--name">
                    <h3>
                      <span
                        >Select asset to swap
                        {{ swapDirection === "from" ? "from" : "to" }} in</span
                      >
                      <span v-if="walletCategory === 'fiat/spot'">Spot Wallet</span>
                      <span v-if="walletCategory === 'margin'">Margin Wallet</span>
                      <span v-if="walletCategory === 'defi'">Defi Wallet</span>
                      <span v-if="walletCategory === 'bonus'">Earning Wallet</span>
                      <span v-if="walletCategory === 'tokenized stocks'"
                        >Tokenized Stocks Wallet</span
                      >
                      <span v-if="walletCategory === 'bot trading'"
                        >Bot Trading Wallet</span
                      >
                    </h3>
                  </div>
                  <div
                    class="transactionstyle__subject--closebtn"
                    @click="toggleCryptoCat"
                  >
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
                  </div>
                </div>

                <div class="transactionstyle__selectassetcat">
                  <div
                    class="transactionstyle__selectassetcat--area"
                    @click="setCurrentCategory('crypto')"
                  >
                    <figure>
                      <img src="https://assets.coincap.io/assets/icons/256/btc.png" />
                    </figure>
                    <span class="btn">
                      <button class="btn">Crypto</button>
                    </span>
                  </div>

                  <div
                    class="transactionstyle__selectassetcat--area"
                    @click="setCurrentCategory('stock')"
                  >
                    <figure>
                      <img src="https://assets.coincap.io/assets/icons/rune@2x.png" />
                    </figure>
                    <span class="btn">
                      <button class="btn">Stock</button>
                    </span>
                  </div>

                  <div
                    class="transactionstyle__selectassetcat--area"
                    @click="setCurrentCategory('commodity')"
                  >
                    <figure>
                      <img src="https://assets.coincap.io/assets/icons/rune@2x.png" />
                    </figure>
                    <span class="btn">
                      <button class="btn">Commodity</button>
                    </span>
                  </div>

                  <div
                    class="transactionstyle__selectassetcat--area"
                    @click="setCurrentCategory('fiat')"
                  >
                    <figure>
                      <img
                        src="https://clipart-library.com/new_gallery/111-1111898_transparent-american-flag-icon.png"
                      />
                    </figure>
                    <span class="btn">
                      <button class="btn">Fiat</button>
                    </span>
                  </div>
                </div>

                <div class="transactionstyle__search">
                  <div class="transactionstyle__search--body">
                    <span>
                      <svg
                        focusable="false"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        data-icon="SearchOutlined"
                        class="sc-aXZVg ktFCMi mx-icon iconfont iconsearch"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M9.93186 10.8786C9.02879 11.5806 7.89393 11.9987 6.66146 11.9987C3.71594 11.9987 1.32812 9.6109 1.32812 6.66536C1.32812 3.71984 3.71594 1.33203 6.66146 1.33203C9.60699 1.33203 11.9948 3.71984 11.9948 6.66536C11.9948 7.89783 11.5767 9.0327 10.8747 9.93576L14.4662 13.5273C14.7265 13.7876 14.7265 14.2098 14.4662 14.4701C14.2059 14.7304 13.7837 14.7304 13.5234 14.4701L9.93186 10.8786ZM10.6615 6.66536C10.6615 8.8745 8.87059 10.6654 6.66146 10.6654C4.45232 10.6654 2.66146 8.8745 2.66146 6.66536C2.66146 4.45622 4.45232 2.66536 6.66146 2.66536C8.87059 2.66536 10.6615 4.45622 10.6615 6.66536Z"
                        ></path>
                      </svg>
                    </span>
                    <span>
                      <input
                        type="text"
                        placeholder="Search for asset"
                        v-model="searchInput"
                      />
                    </span>
                  </div>
                </div>

                <div class="transactionstyle__listitemsassets">
                  <div
                    class="transactionstyle__listitemsasset"
                    v-for="(asset, caindex) in paginatedList"
                    @click="setCurrentAsset(asset)"
                  >
                    <figure class="assetlist__area--assetlogo">
                      <img :src="returnCryptoLogo(asset.image)" />
                    </figure>
                    <div class="transactionstyle__listitemsasset--labels">
                      <label class="name" v-if="asset.coin">{{ asset.name }}</label>
                      <label class="chain">{{ asset.coin }}</label>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>

            <div class="layout-stretch" v-if="assets && assets.length">
              <PageIndicator :page_name="'Swap/Convert'" />

              <div class="margin__main layout-padding">
                <div class="swap__body">
                  <h2 class="swap__body--h2">Swap/Convert</h2>

                  <div class="swap__selectassets">
                    <div class="swap__selectasset swap__box">
                      <div class="swap__selectasset--direction">
                        <span>From</span>
                      </div>
                      <div
                        class="swap__selectasset--symbol"
                        @click="setSwapDirection('from')"
                      >
                        <figure class="assetlist__area--assetlogo">
                          <img
                            :src="
                              currentAssetFrom
                                ? returnCryptoLogo(currentAssetFrom.image)
                                : ''
                            "
                          />
                        </figure>
                        <div class="swap__selectasset--labels">
                          <span>
                            {{
                              currentAssetFrom
                                ? currentAssetFrom.coin
                                : setandreturnFromAsset(paginatedList[0]).coin
                            }}
                          </span>

                          <span>{{ currentAssetFrom.assetType }}</span>
                        </div>
                      </div>

                      <div class="swap__selectasset--categories">
                        <button class="btn category-open" @click="toggleWalletCat">
                          <span>Wallet:</span>
                          <label>
                            <span v-if="walletCategory === 'fiat/spot'">Spot Wallet</span>
                            <span v-if="walletCategory === 'margin'">Margin</span>
                            <span v-if="walletCategory === 'defi'">Defi</span>
                            <span v-if="walletCategory === 'bonus'">Earning</span>
                            <span v-if="walletCategory === 'tokenized stocks'"
                              >Tokenized Stocks</span
                            >
                            <span v-if="walletCategory === 'bot trading'"
                              >Bot Trading</span
                            >
                            <span>
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
                          </label>
                        </button>
                      </div>
                    </div>

                    <span class="swap__selectassets--arrow">
                      <svg
                        viewBox="0 0 24 24"
                        focusable="false"
                        class="chakra-icon css-onkibi"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
                        ></path>
                      </svg>
                    </span>

                    <div class="swap__selectasset swap__box">
                      <div class="swap__selectasset--direction">
                        <span>To</span>
                      </div>
                      <div
                        class="swap__selectasset--symbol"
                        @click="setSwapDirection('to')"
                      >
                        <figure class="assetlist__area--assetlogo">
                          <img
                            :src="
                              currentAssetTo ? returnCryptoLogo(currentAssetTo.image) : ''
                            "
                          />
                        </figure>
                        <div class="swap__selectasset--labels">
                          <span>
                            {{
                              currentAssetTo
                                ? currentAssetTo.coin
                                : paginatedList[1]
                                ? setandreturnToAsset(paginatedList[1]).coin
                                : setandreturnToAsset(paginatedList[0]).coin
                            }}
                          </span>

                          <span>{{ currentAssetTo.assetType }}</span>
                        </div>
                      </div>

                      <div class="swap__selectasset--categories">
                        <button class="btn category-open">
                          <span>Wallet:</span>
                          <label>
                            <span v-if="walletCategory === 'fiat/spot'">Spot Wallet</span>
                            <span v-if="walletCategory === 'margin'">Margin</span>
                          </label>
                        </button>
                      </div>
                    </div>

                    <span class="flex-place-holder"></span>
                  </div>

                  <div class="swap__box">
                    <div class="swap__convertarea">
                      <div class="swap__convertarea--action">
                        <p>You Pay</p>
                      </div>

                      <div class="swap__convertarea--convertion">
                        <p>≈ ${{ youpayval }}</p>
                      </div>
                    </div>

                    <div class="swap__boxassetarea">
                      <figure class="assetlist__area--assetlogo">
                        <img
                          :src="
                            currentAssetFrom
                              ? returnCryptoLogo(currentAssetFrom.image)
                              : ''
                          "
                        />
                      </figure>
                      <div class="swap__boxassetarea--inputarea">
                        <input
                          placeholder="0"
                          v-model="fromInput"
                          @input="validateNumberInputFrom"
                          :class="{ inputError }"
                        />
                        <span></span>
                      </div>
                    </div>

                    <div class="swap__clientbalancearea">
                      <div class="swap__clientbalancearea--sect dim">
                        <span class="walletbalance-label">Wallet Balance:</span>
                        <span class="walletbalance"
                          >{{
                            addEllipsis(
                              `${parseFloat(assetblc(currentAssetFrom)).toFixed(5)}`,
                              13
                            )
                          }}
                          (${{
                            addEllipsis(
                              `${parseFloat(assetblcUSD(currentAssetFrom)).toFixed(5)}`,
                              13
                            )
                          }}) {{ currentAssetFrom.coin }}</span
                        >
                      </div>

                      <div class="swap__clientbalancearea--sect">
                        <span class="max" @click="setfromInputToMax">Max</span>
                      </div>
                    </div>
                  </div>

                  <div class="swap__box">
                    <div class="swap__convertarea">
                      <div class="swap__convertarea--action">
                        <p>You Get</p>
                      </div>

                      <div class="swap__convertarea--convertion">
                        <p>≈ ${{ yougetval }}</p>
                      </div>
                    </div>

                    <div class="swap__boxassetarea">
                      <figure class="assetlist__area--assetlogo">
                        <img
                          :src="
                            currentAssetTo ? returnCryptoLogo(currentAssetTo.image) : ''
                          "
                        />
                      </figure>
                      <div class="swap__boxassetarea--inputarea">
                        <input
                          placeholder="0"
                          v-model="toInput"
                          @input="validateNumberInputTo"
                          :class="{ inputError }"
                        />
                        <span></span>
                      </div>
                    </div>

                    <div class="swap__clientbalancearea">
                      <div class="swap__clientbalancearea--sect dim">
                        <span class="walletbalance-label">Wallet Balance:</span>
                        <span class="walletbalance"
                          >{{
                            addEllipsis(
                              `${parseFloat(assetblc(currentAssetTo)).toFixed(5)}`,
                              13
                            )
                          }}
                          (${{
                            addEllipsis(
                              `${parseFloat(assetblcUSD(currentAssetTo)).toFixed(5)}`,
                              13
                            )
                          }}) {{ currentAssetTo.coin }}</span
                        >
                      </div>

                      <div class="swap__clientbalancearea--sect">
                        <!--<span class="max">Max</span>-->
                      </div>
                    </div>
                  </div>

                  <div class="swap__box transparent">
                    <div class="swap__expectedamount">
                      <div class="swap__expectedamount--area">
                        <div class="swap__expectedamount--areasec">
                          <span class="svg">
                            <svg
                              viewBox="0 0 24 24"
                              focusable="false"
                              class="chakra-icon css-13izzit"
                            >
                              <path
                                fill="currentColor"
                                d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,19a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,12,19Zm1.6-6.08a1,1,0,0,0-.6.917,1,1,0,1,1-2,0,3,3,0,0,1,1.8-2.75A2,2,0,1,0,10,9.255a1,1,0,1,1-2,0,4,4,0,1,1,5.6,3.666Z"
                              ></path>
                            </svg>
                          </span>
                          <span
                            >1 {{ currentAssetFrom.coin }} =
                            {{
                              addEllipsis(
                                `${compareAssetsPrices(
                                  currentAssetFrom.price,
                                  currentAssetTo.price
                                )}`,
                                13
                              )
                            }}
                            {{ currentAssetTo.coin }}</span
                          >
                        </div>

                        <div class="swap__expectedamount--areasec">
                          <span class="expected">Expected Amount (USD):</span>
                        </div>

                        <div class="swap__expectedamount--areasec">
                          <span class="expected">Total:</span>
                        </div>
                      </div>

                      <div class="swap__expectedamount--area flex-end-column">
                        <div class="swap__expectedamount--areasec">
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
                          <span> ${{ transactionFee }} </span>
                        </div>

                        <div class="swap__expectedamount--areasec">
                          <span>
                            {{ toInput ? toInput : "" }}
                            {{ currentAssetTo.coin }}
                          </span>
                        </div>

                        <div class="swap__expectedamount--areasec">
                          <span class="color-primary fontWeight600 fontSize20">
                            ${{ conversiontotal.toFixed(5) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="swap__btns">
                    <button
                      class="swap__btns--btn btn colored-btn dim"
                      v-if="!enablePreviewBtn"
                    >
                      Preview Trade
                    </button>
                    <button
                      class="swap__btns--btn btn colored-btn"
                      v-if="enablePreviewBtn"
                      @click="previewTrade"
                    >
                      Preview Trade
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
import swapMixin from "@/mixins/swap";
import cryptologosMixin from "@/mixins/cryptologos";
import globalMixin from "@/mixins/global";

export default {
  mixins: [swapMixin, cryptologosMixin, globalMixin],
  methods: {
    validateNumberInputFrom() {
      const { customSplitByDot, removePeriodAndCommas } = this;
      const formattedNumber = this.fromInput
        .replace(/[^1234567890.]/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      const characters = removePeriodAndCommas(customSplitByDot(formattedNumber));

      return (this.fromInput = characters);
    },
    validateNumberInputTo() {
      const { customSplitByDot, removePeriodAndCommas } = this;
      const formattedNumber = this.toInput
        .replace(/[^1234567890.]/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      const characters = removePeriodAndCommas(customSplitByDot(formattedNumber));

      return (this.toInput = characters);
    },
    removeCommasAfterDot(inputString) {
      const withoutCommasAfterDot = inputString.replace(/(\.\d*)/g, (match) =>
        match.replace(/,/g, "")
      );
      return withoutCommasAfterDot;
    },
    customSplitByDot(inputString) {
      const dotIndex = inputString.indexOf(".");
      if (dotIndex !== -1) {
        const firstPart = inputString.slice(0, dotIndex + 1);
        const secondPart = inputString.slice(dotIndex + 1);
        return [firstPart, secondPart];
      } else {
        return [inputString, ""]; // If there's no dot, return the whole string in the first part and an empty string in the second part.
      }
    },
    removePeriodAndCommas(array) {
      const withoutPeriodAndCommas = array.map((str, index) => {
        if (index === 1) {
          return str.replace(/[.,]/g, "");
        }

        return str;
      });

      return withoutPeriodAndCommas.join("");
    },
  },
  computed: {
    convertedFrom() {
      return `0.00`;
    },
  },
  mounted() {
    this.getallpairs();
  },
};
</script>
