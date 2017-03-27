'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vudal = require('./vudal.vue');

var _vudal2 = _interopRequireDefault(_vudal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  props: {
    heading: {
      type: String,
      default: ''
    },
    name: {
      type: String
    },
    approveLabel: {
      type: String,
      default: 'Ok'
    },
    cancelLabel: {
      type: String,
      default: 'Cancel'
    },
    approveBtnColor: {
      type: String,
      default: 'primary'
    },
    cancelBtnColor: {
      type: String,
      default: 'default'
    }
  },

  components: { Vudal: _vudal2.default },

  computed: {
    approveBtnClass: function approveBtnClass() {
      return 'vudal-btn-' + this.approveBtnColor;
    },
    cancelBtnClass: function cancelBtnClass() {
      return 'vudal-btn-' + this.cancelBtnColor;
    }
  },

  methods: {
    approve: function approve() {
      this.$emit('approve');
    },
    cancel: function cancel() {
      this.$emit('cancel');
    },
    $show: function $show() {
      this.$modals[name].$show();
    }
  }
};