<template>
  <div>
    <div v-if="withdrawalmodalopen">
      <Withdraw :close="hidewithdrawalmodal" :walletname="currentpage" />
    </div>

    <div v-if="transfer">
      <Transfer />
    </div>
    <div class="pageindicator layout-padding" :class="{ transparent }">
      <div class="pageindicator__toparea">
        <div class="pageindicator__header">
          <h2 class="pageindicator__header--h2">{{ page_name }}</h2>
        </div>
        <div class="pageindicator__btns" v-if="!nobtns">
          <button
            class="btn padded-btn colored-btn"
            @click="$router.push(`/wallet/${currentpage}`)"
            v-if="showdepositbtn"
          >
            Deposit
          </button>
          <button
            class="btn padded-btn greyed-btn mobile-invisible"
            @click="showwithdrawalmodal"
            v-if="showwithdrawbtn"
          >
            Withdrawal
          </button>
          <!--<button class="btn padded-btn greyed-btn" @click="openTransferPanel">
            Transfer</button
          >-->
          <button
            class="btn padded-btn greyed-btn mobile-invisible"
            @click="$router.push(`/transactionhistory`)"
          >
            Transaction History
          </button>
        </div>
      </div>

      <div class="pageindicator__warningarea" v-if="client">
        <div>
          <div>
            <!-- <Warning />-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pageindicatorMixin from "@/mixins/pageindicator";

export default {
  mixins: [pageindicatorMixin],
};
</script>

<style lang="scss">
.pageindicator {
  display: flex;
  background: $light-black;
  flex-direction: column;

  &.transparent {
    background: transparent;
  }

  &__toparea {
    display: flex;
    align-items: center;
    justify-content: space-between;
    //margin-bottom: #{scaleValue(30)};
  }

  &__header {
    &--h2 {
      font-weight: 500;
      font-size: #{scaleValue(30)};
      color: $primary-color;

      @media only screen and (max-width: 414px) {
        font-size: #{scaleValue(70)};
      }
    }
  }

  &__btns {
    font-weight: 600;

    @media only screen and (max-width: 414px) {
      display: flex;
      flex-direction: column;
    }

    & button {
      margin-left: #{scaleValue(10)};
      font-size: #{scaleValue(14)};
      padding-top: #{scaleValue(13)};
      padding-bottom: #{scaleValue(13)};

      @media only screen and (max-width: 414px) {
        font-size: #{scaleValue(55)};
        padding-top: #{scaleValue(50)};
        padding-bottom: #{scaleValue(50)};
      }
    }
  }
}
</style>
