import objectAssign from 'object-assign';
import elementResizeEvent from 'element-resize-event';
import isMobile from 'ismobilejs';
import $ from 'jquery';

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

    $(this.$el).addClass('vudal').addClass('hide');

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

    isPhone() {
      return isMobile.phone;
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
  },

  watch: {
    isVisible(newVal) {
      if (newVal) {
        $(this.$el).removeClass('hide').addClass('show');
      }
      else {
        $(this.$el).removeClass('show').addClass('hide');
      }
    },

    isPhone(newVal) {
      if (newVal) {
        $(this.$el).addClass('mobile');
      }
      else {
        $(this.$el).removeClass('mobile');
      }
    },
  },

};
