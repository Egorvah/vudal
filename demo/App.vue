<template>
  <div id="app">

    <button @click.prevent="$modals.simpleModal.$show()">Simple Modal</button>
    <button @click.prevent="$modals.modalWithChild.$show()">Modal with child</button>
    <button @click.prevent="$modals.alert('Hello world!')">Modal alert</button>
    <button @click.prevent="confirm()">Modal confirm</button>

    <vudal name="simpleModal">
      <div class="header">
        <i class="close icon">&times;</i>
        Title
      </div>
      <div class="content">
        Content
      </div>
      <div class="actions">
        <div class="cancel vudal-btn">Close</div>
      </div>
    </vudal>

    <vudal name="modalWithChild">
      <div class="header">
        <i class="close icon">&times;</i>
        Parent
      </div>
      <div class="content">
        Lorem ipsum dolor sit amet, pro quodsi feugiat epicurei in, modo repudiandae at sed.
        Pro persius contentiones et, no pro posse postulant, nec labore omittam an.
        Mel amet idque scripserit cu, pro eu solum justo.
        Aperiam cotidieque te duo, mel te denique offendit explicari.
        Pri ex eius quaeque adipiscing, ut sonet legere vivendo eam.
        Sint liber volumus ad qui, mea ex magna oportere philosophia, et corrumpit forensibus mel.
        Id nec quod graeco percipitur, usu te error laboramus signiferumque.
        Nec persius complectitur cu, ei est mutat fuisset placerat.
      </div>
      <div class="actions">
        <div class="cancel vudal-btn">Close</div>
        <div class="vudal-btn" @click.prevent="$modals.child.$show()">Show child modal</div>
      </div>
    </vudal>

    <vudal name="child" parent="modalWithChild">
      <div class="header">
        <i class="close icon">&times;</i>
        Child
      </div>
      <div class="content">
        Per fastidii definiebas ea.
        Est fabulas ponderum intellegam id.
        Pri sale docendi eleifend ei.
      </div>
      <div class="actions">
        <div class="cancel vudal-btn">Close</div>
      </div>
    </vudal>
  </div>
</template>

<script>

import Vudal from './../src/index.js';

export default {
  components: { Vudal },

  methods: {
    confirm() {
      this.$modals.confirm({
        message: 'Confirm?',
        onApprove: () => { alert('Approve'); },
        onCancel: () => { alert('Cancel'); },
      });
    },
  },
};
</script>
<style>
  .close {
    float: right;
    font-size: 21px;
    font-weight: 700;
    line-height: 1;
    color: #bbb;
    text-shadow: 0 1px 0 #fff;
    filter: alpha(opacity=20);
    cursor: pointer;
  }
  .close:hover {
    color: #000;
  }

</style>
