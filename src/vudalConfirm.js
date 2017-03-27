import Vudal from './vudal.vue';

export default {

  props: {
    heading: {
      type: String,
      default: '',
    },
    name: {
      type: String,
    },
    approveLabel: {
      type: String,
      default: 'Ok',
    },
    cancelLabel: {
      type: String,
      default: 'Cancel',
    },
    approveBtnColor: {
      type: String,
      default: 'primary',
    },
    cancelBtnColor: {
      type: String,
      default: 'default',
    },
  },

  components: { Vudal },

  computed: {
    approveBtnClass() {
      return `vudal-btn-${this.approveBtnColor}`;
    },

    cancelBtnClass() {
      return `vudal-btn-${this.cancelBtnColor}`;
    },
  },

  methods: {
    approve() {
      this.$emit('approve');
    },

    cancel() {
      this.$emit('cancel');
    },

    $show() {
      this.$modals[name].$show();
    },
  },
};
