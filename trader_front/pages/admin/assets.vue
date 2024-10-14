<template>
  <div>
    <div class="assetsmanager">
      <h2 class="assetsmanager__h2">Assets</h2>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.assetsmanager {
  padding: #{scaleValue(100)};

  &__h2 {
    font-weight: 500;
    font-size: #{scaleValue(25)};
    margin-bottom: #{scaleValue(40)};
  }
}
</style>
