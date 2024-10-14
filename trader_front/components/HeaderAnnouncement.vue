<template>
  <div>
    <div class="headerannouncement" :class="{ green: background === '$landing-green' }">
      <div class="headerannouncement__announcement">
        <p>{{ announcement }}</p>
      </div>

      <div class="headerannouncement__button">
        <!--<button>Learn more</button>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["background", "color", "announcement"],
};
</script>
