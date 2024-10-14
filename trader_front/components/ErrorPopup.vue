<template>
  <div class="popup error-body">
    <div class="popup__body">
      <div class="transactionstyle__subject">
        <div></div>
        <div class="transactionstyle__subject--name">
          <h3>Tradex Quant</h3>
        </div>
        <div>
          <span class="popup__close" @click="close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              class="css-3kwgah"
            >
              <path
                d="M6.697 4.575L4.575 6.697 9.88 12l-5.304 5.303 2.122 2.122L12 14.12l5.303 5.304 2.122-2.122L14.12 12l5.304-5.303-2.122-2.122L12 9.88 6.697 4.575z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
        </div>
      </div>

      <div class="popup__text warning">
        <div class="warning__body--warningtext">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["error", "close"],
};
</script>

<style lang="scss" scoped>
.error-body {
  background: transparent !important;
}
</style>
