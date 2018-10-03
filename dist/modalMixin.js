'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _elementResizeEvent = require('element-resize-event');

var _elementResizeEvent2 = _interopRequireDefault(_elementResizeEvent);

var _ismobilejs = require('ismobilejs');

var _ismobilejs2 = _interopRequireDefault(_ismobilejs);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  props: {
    options: {
      type: Object,
      default: function _default() {
        return {};
      }
    },

    parentRef: {
      default: null
    },

    parent: {
      default: null
    },

    name: {
      type: String,
      default: null
    },

    closeByEsc: {
      type: Boolean,
      default: true
    },

    autoCenter: {
      type: Boolean,
      default: true
    },

    hideConfirmationMessage: {
      type: String,
      default: null
    }
  },

  data: function data() {
    return {
      isVisible: false,
      internalOptions: this.options,
      showedAt: null
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$modals.addModal(this);

    (0, _jquery2.default)(this.$el).addClass('vudal').addClass('hide');

    var options = {
      onHidden: function onHidden() {
        return _this.$emit('hidden');
      },
      onVisible: function onVisible() {
        return _this.$emit('visible');
      },
      onShow: function onShow() {
        return _this.$emit('show');
      },
      onHide: function onHide() {
        _this.$emit('hide');
        return true;
      }
    };
    this.$setOptions(options);

    this.$toggle = function () {
      return _this.toggle();
    };
    this.$show = function () {
      return _this.show();
    };
    this.$hide = function () {
      return _this.hide();
    };
    this.$remove = function () {
      return _this.$modals.removeModal(_this);
    };

    (0, _elementResizeEvent2.default)(this.$el, function () {
      _this.$modals.setPosition(_this);
    });
  },
  destroyed: function destroyed() {
    this.$modals.removeModal(this);
  },


  computed: {
    $isActive: function $isActive() {
      return this.isVisible;
    },
    isPhone: function isPhone() {
      return _ismobilejs2.default.phone;
    },
    parents: function parents() {
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
    }
  },

  methods: {
    $setOptions: function $setOptions(options) {
      var opts = (0, _objectAssign2.default)({}, this.internalOptions, options);
      this.internalOptions = opts;
    },
    toggle: function toggle() {
      if (this.isVisible) {
        this.hide();
      } else {
        this.show();
      }
    },
    show: function show() {
      this.isVisible = true;
      this.showedAt = Date.now();
      this.internalOptions.onShow();
      this.$modals.onShow(this);
    },
    hide: function hide() {
      var _this2 = this;

      var doHide = function doHide() {
        _this2.isVisible = false;
        _this2.showedAt = null;
        _this2.internalOptions.onHide();
        _this2.$modals.onHide(_this2);
      };

      if (this.hideConfirmationMessage) {
        this.$modals.confirm({
          message: this.hideConfirmationMessage,
          onApprove: doHide,
          parent: this.name
        });
      } else {
        doHide();
      }
    }
  },

  watch: {
    isVisible: function isVisible(newVal) {
      if (newVal) {
        (0, _jquery2.default)(this.$el).removeClass('hide').addClass('show');
      } else {
        (0, _jquery2.default)(this.$el).removeClass('show').addClass('hide');
      }
    },
    isPhone: function isPhone(newVal) {
      if (newVal) {
        (0, _jquery2.default)(this.$el).addClass('mobile');
      } else {
        (0, _jquery2.default)(this.$el).removeClass('mobile');
      }
    }
  }

};