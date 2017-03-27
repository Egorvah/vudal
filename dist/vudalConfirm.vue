<template>
  <vudal :name="name">
    <div class="header">
      {{ heading }}
    </div>
    <div class="content">
      <slot></slot>
    </div>
    <div class="actions">
      <button type="button" class="vudal-btn cancel" :class="cancelBtnClass" @click.prevent="cancel()">{{ cancelLabel }}</button>
      <button type="button" class="vudal-btn" :class="approveBtnClass" @click.prevent="approve()">{{ approveLabel }}</button>
    </div>
  </vudal>
</template>
<script src="./vudalConfirm.js">
</script>
