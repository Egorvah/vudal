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
    approveBtnClass: {
      type: String,
    },
    cancelBtnClass: {
      type: String,
    },
  },

  components: { Vudal },

  data() {
    return {
      approveBtnColor: 'primary',
      cancelBtnColor: 'default',
    };
  },

  computed: {
    approveClass() {
      if (this.approveBtnClass != null) {
        return this.approveBtnClass;
      }
      return `vudal-btn vudal-btn-${this.approveBtnColor}`;
    },

    cancelClass() {
      if (this.cancelBtnClass != null) {
        return this.cancelBtnColor;
      }
      return `vudal-btn vudal-btn-${this.cancelBtnColor}`;
    },
  },

  methods: {
    approve() {
      this.$modals[this.name].$hide();
      this.$emit('approve');
    },

    cancel() {
      this.$emit('cancel');
    },
  },
};
