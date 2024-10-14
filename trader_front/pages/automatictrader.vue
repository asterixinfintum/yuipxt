<template>
  <div>
    <div class="automatictrader">
      <div class="automatictrader__content">
        <TraderHeader />

        <div class="automatictrader__container">
          <div class="automatictrader__container--content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
$background: rgb(22, 26, 30);
$header-background: #181a20;
$neon-blue: #00ffff;
$bitcoin-orange: #f7931a;
$black: #000000;
$white: #fff;
$neon-pink: #ff6ec7;
$border-transparent: 1px solid transparent;
$border: 1px solid rgb(43, 49, 58);
$red: rgb(246, 70, 93);
$green: rgb(14, 203, 129);
$order-creator-background: rgb(22, 26, 30);
$input-background: rgba(43, 47, 54, 0.9);
$gold-b: rgb(240, 185, 11);
$red: rgb(246, 70, 93);

.automatictrader {
  background: rgba($background, 0.7);

  &__container {
    padding: 0 #{scaleValue(70)};

    &--content {
      border-left: $border;
      border-right: $border;
      border-top: $border;
      min-height: #{scaleValue(900)};
      padding: #{scaleValue(10)};
    }
  }
}
</style>
