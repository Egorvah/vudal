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
    approveBtnClass: {
      type: String
    },
    cancelBtnClass: {
      type: String
    }
  },

  components: { Vudal: _vudal2.default },

  data: function data() {
    return {
      approveBtnColor: 'primary',
      cancelBtnColor: 'default'
    };
  },


  computed: {
    approveClass: function approveClass() {
      if (this.approveBtnClass != null) {
        return this.approveBtnClass;
      }
      return 'vudal-btn vudal-btn-' + this.approveBtnColor;
    },
    cancelClass: function cancelClass() {
      if (this.cancelBtnClass != null) {
        return this.cancelBtnClass + ' cancel';
      }
      return 'vudal-btn vudal-btn-' + this.cancelBtnColor + ' cancel';
    }
  },

  methods: {
    approve: function approve() {
      this.$modals[this.name].$hide();
      this.$emit('approve');
    },
    cancel: function cancel() {
      this.$emit('cancel');
    }
  }
};