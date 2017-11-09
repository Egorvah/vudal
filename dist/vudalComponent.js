'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _modalMixin = require('./modalMixin');

var _modalMixin2 = _interopRequireDefault(_modalMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  mixins: [_modalMixin2.default],

  mounted: function mounted() {
    var _this = this;

    (0, _jquery2.default)(this.$el).children('.close').on('click', function () {
      _this.hide();
    });

    (0, _jquery2.default)(this.$el).children('.header').children('.close').on('click', function () {
      _this.hide();
    });

    (0, _jquery2.default)(this.$el).on('click', '.actions .cancel, .actions .deny, .actions .negative, .close-modal', function () {
      _this.hide();
    });
  },


  watch: {
    isVisible: function isVisible(newVal) {
      if (newVal) {
        (0, _jquery2.default)(this.$el).removeClass('vudal-fade-out').addClass('vudal-fade-in');
      } else {
        (0, _jquery2.default)(this.$el).removeClass('vudal-fade-in').addClass('vudal-fade-out');
      }
    }
  }

};