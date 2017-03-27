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
<style scoped>
  .vudal-btn {
    display: inline-block;
    font-weight: 400;
    line-height: 1.25;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid transparent;
    padding: 8px 16px;
    font-size: 1em;
    border-radius: .25rem;
    -webkit-transition: all .2s ease-in-out;
    -o-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
    color: #292b2c;
    background-color: #fff;
    border-color: #ccc;
  }

  .vudal-btn-primary {
    color: #fff;
    background-color: #0275d8;
    border-color: #0275d8;
  }

  .vudal-btn-success {
    color: #fff;
    background-color: #5cb85c;
    border-color: #5cb85c;
  }

  .vudal-btn-danger {
    color: #fff;
    background-color: #d9534f;
    border-color: #d9534f;
  }

  .vudal-btn-warning {
    color: #fff;
    background-color: #f0ad4e;
    border-color: #f0ad4e;
  }
</style>
