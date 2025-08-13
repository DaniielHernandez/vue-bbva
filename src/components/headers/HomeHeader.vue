<template>
  <div class="home-header__container">
    <div class="home-header__logo" @click="() => $emit('home-click')">
      <span class="highlight"> SLAs </span>
      <span> as a service </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {}
}
</script>

<style>

.home-header__container {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 5rem;
  padding-left: 5rem;
  background-color: #072146;
}
.home-header__logo {
  cursor: pointer;
  color: red;
}
.home-header__logo > .highlight {
  color: green;
}
</style>
