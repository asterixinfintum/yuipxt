<template>
  <div class="popup">
    <div class="popup__body transactionstyle__body">
      <div class="transactionstyle__subject">
        <div class="transactionstyle__subject--name">
          <h3>Confirm Transaction Details</h3>
        </div>
        <div class="transactionstyle__subject--closebtn" @click="toggleconfirmTrade">
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

      <div class="transactionstyle__container" v-if="transactionexecuted">
        <div class="centertext">
          <p class="success-text">Transaction executed</p>
        </div>
        <div class="transactionstyle__btn">
          <button class="btn colored-btn padded-btn" @click="$router.go()">Ok</button>
        </div>
      </div>

      <div
        class="transactionstyle__container"
        v-if="
          contentObj &&
          contentObj.transactionType === 'conversion' &&
          !transactionexecuted
        "
      >
        <div class="previewtrade__content">
          <div class="previewtrade__contentarea">
            <div class="previewtrade__contentitem">
              <div class="previewtrade__contentitemleft">Convert From</div>
              <div class="previewtrade__contentitemright">
                <div class="previewtrade__contentitemright--top">
                  {{ contentObj.fromInput }} {{ contentObj.fromCoin }}
                </div>
                <div class="previewtrade__contentitemright--bottom">
                  ≈ ${{ contentObj.youPayUSD }}
                </div>
              </div>
            </div>

            <div class="previewtrade__contentitem">
              <div class="previewtrade__contentitemleft">Convert To</div>
              <div class="previewtrade__contentitemright">
                <div class="previewtrade__contentitemright--top">
                  {{ contentObj.toInput }} {{ contentObj.toCoin }}
                </div>
                <div class="previewtrade__contentitemright--bottom">
                  ≈ ${{ contentObj.youGetUSD }}
                </div>
              </div>
            </div>

            <div class="previewtrade__contentitem">
              <div class="previewtrade__contentitemleft">Fee</div>
              <div class="previewtrade__contentitemright">
                <div class="previewtrade__contentitemright--top">
                  ${{ contentObj.transactionFee }}
                </div>
              </div>
            </div>

            <div class="previewtrade__contentitem">
              <div class="previewtrade__contentitemleft">Total</div>
              <div class="previewtrade__contentitemright">
                <div class="previewtrade__contentitemright--top">
                  ${{ contentObj.transactionTotal }}
                </div>
              </div>
            </div>

            <div class="previewtrade__contentitem">
              <div class="previewtrade__contentitemleft">Wallet</div>
              <div class="previewtrade__contentitemright">
                <div class="previewtrade__contentitemright--top"></div>
                <div class="previewtrade__contentitemright--bottom wallet-type">
                  {{ contentObj.walletCategory }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="transactionstyle__btn">
          <button
            class="btn colored-btn padded-btn"
            @click="triggerConversion"
            v-if="!loading"
          >
            Confirm and Trade
          </button>

          <button class="btn colored-btn padded-btn dim" v-if="loading">
            <span class="loader-button"></span>
          </button>
        </div>
      </div>

      <div
        class="transactionstyle__container"
        v-if="
          contentObj &&
          contentObj.transactionType.type === 'transfer' &&
          !transactionexecuted
        "
      >
        <div class="previewtrade__content">
          <div class="previewtrade__contentarea">
            <div class="previewtrade__contentitem">
              <div class="previewtrade__contentitemleft">
                Transfer {{ contentObj.assetName }} From {{ contentObj.formerWallet }} to
                {{ contentObj.currentWallet }}
              </div>
              <div class="previewtrade__contentitemright">
                <div class="previewtrade__contentitemright--top">
                  {{ contentObj.balanceAmount }} {{ contentObj.assetName }}
                </div>
                <div class="previewtrade__contentitemright--bottom">
                  ≈ ${{ contentObj.youPayUSD }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="transactionstyle__btn">
          <button
            class="btn colored-btn padded-btn"
            @click="triggerTransfer"
            v-if="!loading"
          >
            Confirm and Trade
          </button>

          <button class="btn colored-btn padded-btn dim" v-if="loading">
            <span class="loader-button"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      loading: false,
      transactionexecuted: false,
    };
  },
  props: ["contentObj", "toggleconfirmTrade"],
  methods: {
    ...mapActions("convert", ["executeConversion"]),
    ...mapActions("transfer", ["executeTransfer"]),
    triggerTransfer() {
      const { executeTransfer, transfer } = this;

      this.loading = true;

      executeTransfer(transfer)
        .then((data) => {
          this.loading = false;
          this.transactionexecuted = true;
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
        });
    },
    triggerConversion() {
      const { executeConversion, conversion } = this;

      this.loading = true;

      executeConversion(conversion)
        .then((data) => {
          this.loading = false;
          this.transactionexecuted = true;
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
        });
    },
  },
  computed: {
    conversion() {
      const {
        ownerId,
        currentAssetFrom,
        toInput,
        fromInput,
        wallet,
        assetCategoryTo,
        transactionType,
        transactionFee,
        currentAssetTo,
        walletCategory,
        transactionTotal,
      } = this.contentObj;

      const conversion = {
        toquant: parseFloat(toInput),
        fromquant: parseFloat(fromInput),
        assetfrom: currentAssetFrom,
        assetto: currentAssetTo,
        wallet,
        total: transactionTotal,
        transactionFee,
      };

      return conversion;
    },
    transfer() {
      const {
        ownerId,
        assetId,
        balanceAmount,
        transactionType,
        transactionDescription,
        currentWallet,
        formerWallet,
        assetType,
      } = this.contentObj;

      const transfer = {
        ownerId,
        assetId,
        balanceAmount,
        transactionType,
        transactionDescription,
        currentWallet,
        formerWallet,
        assetType,
      };

      return transfer;
    },
  },
};
</script>
