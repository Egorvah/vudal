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
      default: null,
    },

    parent: {
      default: null,
    },

    name: {
      type: String,
      default: null,
    },

    closeByEsc: {
      type: Boolean,
      default: true,
    },

    autoCenter: {
      type: Boolean,
      default: true,
    },

    hideConfirmationMessage: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      isVisible: false,
      internalOptions: this.options,
      showedAt: null,
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

    parents() {
      if (this.parent != null) {
        if (Array.isArray(this.parent)) {
          return this.parent;
        }
        return [this.parent];
      }
      if (this.parentRef != null) {
        if (Array.isArray(this.parentRef)) {
          return this.parentRef;
        }
        return [this.parentRef];
      }

      return [];
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
      this.showedAt = Date.now();
      this.internalOptions.onShow();
      this.$modals.onShow(this);
    },

    hide() {
      const doHide = () => {
        this.isVisible = false;
        this.showedAt = null;
        this.internalOptions.onHide();
        this.$modals.onHide(this);
      }

      if (this.hideConfirmationMessage) {
        this.$modals.confirm({
          message: this.hideConfirmationMessage,
          onApprove: doHide,
          parent: this.name,
        });
      }
      else {
        doHide();
      }
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
