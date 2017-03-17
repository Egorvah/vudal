<template>
  <div class="vudal" v-bind:class="{ 'show': isVisible, 'hide': !isVisible, 'mobile' : isPhone }">
    <slot></slot>
  </div>
</template>
<script>
import objectAssign from 'object-assign';
import elementResizeEvent from 'element-resize-event';
import MobileDetect from 'mobile-detect';

const md = new MobileDetect(window.navigator.userAgent);

export default {

  props: {
    options: {
      type: Object,
      default() {
        return {};
      },
    },

    parentRef: {
      type: String,
      default: null,
    },

    parent: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      isVisible: false,
      internalOptions: this.options,
    };
  },

  mounted() {
    this.$modals.addModal(this);

    const options = {
      onHidden: () => this.$emit('hidden'),
      onVisible: () => this.$emit('visible'),
      onShow: () => this.$emit('show'),
      onHide: () => {
        this.$emit('hide');
        return true;
      },
    };
    this.$setOptions(options);

    this.$toggle = () => this.toggle();
    this.$show = () => this.show();
    this.$hide = () => this.hide();
    this.$remove = () => this.$modals.removeModal(this);

    // set to center modal after change content size
    elementResizeEvent(this.$el, () => {
      this.$modals.setPosition(this);
    });
  },

  destroyed() {
    this.$modals.removeModal(this);
  },

  computed: {
    $isActive() {
      return this.isVisible;
    },
  },

  methods: {
    $setOptions(options) {
      const opts = objectAssign({}, this.internalOptions, options);
      this.internalOptions = opts;
    },

    toggle() {
      if (this.isVisible) {
        this.hide();
      }
      else {
        this.show();
      }
    },

    show() {
      this.isVisible = true;
      this.internalOptions.onShow();
      this.$modals.onShow(this);
    },

    hide() {
      this.isVisible = false;
      this.internalOptions.onHide();
      this.$modals.onHide(this);
    },

    isPhone() {
      return !!md.phone();
    },
  },

};
</script>

<style>

  body.no-scroll {
    overflow: hidden;
  }

  .modals.dimmer .ui.modal.mobile
  {
    position: initial!important;
  }

  .ui.modal.mobile
  {
    will-change: initial!important;
  }

  .vudal-dimmer {
    overflow: scroll;
    display: none;
    position: fixed;
    top: 0!important;
    left: 0!important;
    width: 100%;
    height: 100%;
    text-align: center;
    vertical-align: middle;
    background-color: rgba(0,0,0,.85);
    opacity: 0;
    line-height: 1;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-duration: .5s;
    animation-duration: .5s;
    -webkit-transition: background-color .5s linear;
    transition: background-color .5s linear;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    will-change: opacity;
    z-index: 1000;
  }

  .vudal-dimmer.show {
    display: block;
    opacity: 1;
  }

  .vudal {
    position: absolute;
    z-index: 1001;
    top: 50%;
    left: 50%;
    background: white;
    width: 720px;
    margin: -300px 0 0 -360px;
    text-align: left;
    border-radius: .28571429rem;
    box-shadow: 1px 3px 3px 0 rgba(0,0,0,.2),1px 3px 15px 2px rgba(0,0,0,.2);
  }

  .vudal.wide {
    width: 90%;
  }

  .vudal.show {
    display: block;
  }

  .vudal.hide {
    display: none;
  }

  .vudal>.header {
    display: block;
    font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
    background: #FFF;
    margin: 0;
    padding: 1.25rem 1.5rem;
    box-shadow: none;
    color: rgba(0,0,0,.85);
    border-bottom: 1px solid rgba(34,36,38,.15);
  }

  .vudal>.header:not(.ui) {
    font-size: 1.3em;
    line-height: 1.2857em;
    font-weight: 700;
  }

  .vudal>.content {
    display: block;
    width: 100%;
    font-size: 1em;
    line-height: 1.4;
    padding: 1.5rem;
    background: #FFF;
  }

  .vudal>.actions {
    background: #F9FAFB;
    padding: 1rem;
    border-top: 1px solid rgba(34,36,38,.15);
    text-align: right;
  }

  .vudal>.close {
    cursor: pointer;
    position: absolute;
    top: -2.5rem;
    right: -2.5rem;
    z-index: 1;
    opacity: .8;
    font-size: 1.25em;
    color: #FFF;
    width: 2.25rem;
    height: 2.25rem;
    padding: .625rem 0 0;
  }

  .vudal>.icon:first-child+*, .vudal>:first-child:not(.icon) {
    border-top-left-radius: .28571429rem;
    border-top-right-radius: .28571429rem;
  }

  .vudal>:last-child {
    border-bottom-left-radius: .28571429rem;
    border-bottom-right-radius: .28571429rem;
  }

  .vudal.child-active {
    filter: blur(4px);
    -webkit-filter: blur(4px);
    -moz-filter: blur(4px);
    -o-filter: blur(4px);
    -ms-filter: blur(4px);
    filter:progid:DXImageTransform.Microsoft.Blur(PixelRadius='4');
    position: fixed;
  }

  .vudal .horizontal-scroll {
    overflow-x: scroll;
  }

  @media only screen and (max-width: 767px) {
    .vudal {
      width: 95%;
      margin: 0 0 0 -47.5%;
    }

    .vudal>.close {
      top: .5rem!important;
      right: .5rem!important;
    }
  }

  @media only screen and (max-width: 991px) {
    .vudal>.close {
      top: 1.0535rem;
      right: 1rem;
      color: rgba(0,0,0,.87);
    }
  }
</style>
