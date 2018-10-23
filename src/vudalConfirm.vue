<template>
  <vudal :name="name" class="narrow center">
    <div class="header main center">
      <slot></slot>
    </div>
    <div class="actions">
      <button type="button" :class="cancelClass" @click.prevent="cancel()">{{ cancelLabel }}</button>
      <button type="button" :class="approveClass" @click.prevent="approve()">{{ approveLabel }}</button>
    </div>
  </vudal>
</template>
<script src="./vudalConfirm.js">
</script>
