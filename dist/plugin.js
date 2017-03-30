'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

require('proxy-polyfill/proxy.min');

var _ismobilejs = require('ismobilejs');

var _ismobilejs2 = _interopRequireDefault(_ismobilejs);

var _vudal = require('./vudal.vue');

var _vudal2 = _interopRequireDefault(_vudal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isFunction(object) {
  return typeof object === 'function';
}

exports.default = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var defaultLayer = 1000;
    var dimmerSelector = '.vudal-dimmer';
    var modalSelector = '.vudal';
    var hideModalsOnDimmerClick = options.hideModalsOnDimmerClick != null ? options.hideModalsOnDimmerClick : true;

    var Modal = function () {
      function Modal() {
        (0, _classCallCheck3.default)(this, Modal);

        this.modals = [];
        this.refreshOnResize = true;
        this.lastLayer = defaultLayer;
      }

      (0, _createClass3.default)(Modal, [{
        key: 'getNewLayer',
        value: function getNewLayer() {
          this.lastLayer += 1;
          return this.lastLayer;
        }
      }, {
        key: 'addModal',
        value: function addModal(modal) {
          if (!(0, _jquery2.default)(dimmerSelector).length) {
            Modal.addDimmer();
          }

          var name = Modal.getModalName(modal);
          var existingModal = this.getModal(name);
          if (existingModal != null && !Vue.config.silent) {
            console.warn('Modal with name "' + name + '" already defined');
            return;
          }

          this.modals.push(modal);

          (0, _jquery2.default)(dimmerSelector).append((0, _jquery2.default)(modal.$el).detach());
        }
      }, {
        key: 'removeModal',
        value: function removeModal(modal) {
          var _this = this;

          var foundModal = this.modals.filter(function (m) {
            return m.$el === modal.$el;
          })[0];

          if (!foundModal && modal.$vnode) {
            foundModal = this.modals.filter(function (m) {
              return m.$vnode && m.$vnode.data.ref === modal.$vnode.data.ref;
            })[0];
          }

          if (foundModal) {
            var index = this.modals.indexOf(foundModal);
            this.modals.splice(index, 1);
          }

          this.getChildrenModals(modal).forEach(function (childModal) {
            return _this.removeModal(childModal);
          });

          (0, _jquery2.default)(modal.$el).remove();
        }
      }, {
        key: 'getModal',
        value: function getModal(name) {
          return this.modals.filter(function (modal) {
            if (modal.$vnode != null) {
              return modal.$vnode.data.ref === name || name != null && modal.name === name;
            }
            return name != null && modal.name === name;
          })[0];
        }
      }, {
        key: 'removeAll',
        value: function removeAll() {
          var _this2 = this;

          this.hideAll();
          this.modals.slice(0).forEach(function (modal) {
            _this2.removeModal(modal);
          });
        }
      }, {
        key: 'onShow',
        value: function onShow(modal) {
          (0, _jquery2.default)('body').addClass('no-scroll');
          (0, _jquery2.default)(dimmerSelector).addClass('show');

          (0, _jquery2.default)(modal.$el).css('z-index', this.getNewLayer());

          this.setPosition(modal);

          var parentModal = this.getParentModal(modal);
          if (parentModal) {
            (0, _jquery2.default)(parentModal.$el).addClass('child-active');
            setTimeout(function () {
              (0, _jquery2.default)(parentModal.$el).bind('click', modal.hide);
            }, 150);
          }

          modal.internalOptions.onVisible();
        }
      }, {
        key: 'onHide',
        value: function onHide(modal) {
          (0, _jquery2.default)(modal.$el).removeAttr('style');
          modal.internalOptions.onHidden();

          var activeModal = this.modals.filter(function (m) {
            return m.isVisible;
          })[0];

          if (!activeModal) {
            this.closeDimmer();
          }

          var parentModal = this.getParentModal(modal);
          if (parentModal) {
            (0, _jquery2.default)(parentModal.$el).removeClass('child-active');
            (0, _jquery2.default)(parentModal.$el).unbind('click', modal.hide);
          }

          this.getChildrenModals(modal).forEach(function (childModal) {
            return childModal.hide();
          });
        }
      }, {
        key: 'hideAll',
        value: function hideAll() {
          this.modals.forEach(function (modal) {
            if (modal.isVisible) {
              modal.hide();
            }
          });
          this.closeDimmer();
        }
      }, {
        key: 'getChildrenModals',
        value: function getChildrenModals(modal) {
          if (modal.$vnode) {
            return this.modals.filter(function (m) {
              return m.parentRef === modal.$vnode.data.ref || modal.name != null && m.parent === modal.name;
            });
          }

          return this.modals.filter(function (m) {
            return modal.name != null && m.parent === modal.name;
          });
        }
      }, {
        key: 'getParentModal',
        value: function getParentModal(modal) {
          if (modal.parentRef != null || modal.parent != null) {
            var parentModal = this.modals.filter(function (m) {
              if (m.$vnode) {
                return m.$vnode.data.ref === modal.parentRef || modal.name != null && m.name === modal.parent;
              }
              return modal.name != null && m.name === modal.parent;
            })[0];
            if (parentModal) {
              return parentModal;
            }
            return null;
          }

          return null;
        }
      }, {
        key: 'closeDimmer',
        value: function closeDimmer() {
          (0, _jquery2.default)('body').removeClass('no-scroll');
          (0, _jquery2.default)(dimmerSelector).removeClass('show');

          this.lastLayer = defaultLayer;
        }
      }, {
        key: 'setPosition',
        value: function setPosition(modal) {
          setTimeout(function () {
            var marginTop = (0, _jquery2.default)(window).height() - 50 < (0, _jquery2.default)(modal.$el).height() ? (0, _jquery2.default)(window).height() / 2 - 50 : (0, _jquery2.default)(modal.$el).height() / 2;
            var marginLeft = (0, _jquery2.default)(modal.$el).width() / 2;
            (0, _jquery2.default)(modal.$el).css('margin', '-' + marginTop + 'px 0 50px -' + marginLeft + 'px');
          }, 0);
        }
      }, {
        key: 'resetPositions',
        value: function resetPositions() {
          var _this3 = this;

          this.modals.forEach(function (modal) {
            _this3.setPosition(modal);
          });
        }
      }, {
        key: 'alert',
        value: function alert(message) {
          var _this4 = this;

          new Vue({
            render: function render(h) {
              return h(_vudal2.default, { props: { name: 'alertModal' }, on: { hide: this.onOk } }, [h('div', { class: 'header' }), h('div', { class: 'content' }, [message]), h('div', { class: 'actions' }, [h('button', { class: 'vudal-btn', on: { click: this.onOk } }, ['OK'])])]);
            },
            data: function data() {
              return { message: message };
            },


            methods: {
              onOk: function onOk() {
                this.$destroy();
                this.$modals.closeDimmer();
              }
            }
          }).$mount();

          Vue.nextTick(function () {
            _this4.getModal('alertModal').$show();
          });
        }
      }], [{
        key: 'getModalName',
        value: function getModalName(modal) {
          if (modal.name != null) {
            return modal.name;
          }

          if (modal.$vnode != null) {
            return modal.$vnode.data.ref;
          }

          return null;
        }
      }, {
        key: 'camelCase',
        value: function camelCase(string) {
          var find = /(-\w)/g;
          var convert = function convert(matches) {
            return matches[1].toUpperCase();
          };
          return string.replace(find, convert);
        }
      }, {
        key: 'addDimmer',
        value: function addDimmer() {
          var dimmer = '<div class="vudal-dimmer"></div>';
          (0, _jquery2.default)(document.body).append(dimmer);

          if (hideModalsOnDimmerClick) {
            (0, _jquery2.default)(document).on('click', dimmerSelector, function () {
              Vue.prototype.$modals.hideAll();
            });
          }

          (0, _jquery2.default)(document).on('click', modalSelector, function (event) {
            event.stopPropagation();
          });

          (0, _jquery2.default)(window).on('popstate', function () {
            if ((0, _jquery2.default)(dimmerSelector).hasClass('show')) {
              event.stopPropagation();
              event.preventDefault();
              Vue.prototype.$modals.hideAll();
            }
          });

          (0, _jquery2.default)(window).on('keyup', function (event) {
            if ((0, _jquery2.default)(dimmerSelector).hasClass('show') && event.keyCode === 27) {
              Vue.prototype.$modals.hideAll();
            }
          });

          (0, _jquery2.default)(window).resize(function () {
            if ((0, _jquery2.default)(dimmerSelector).hasClass('show')) {
              if (_ismobilejs2.default.phone) {
                if ((0, _jquery2.default)(document.activeElement).attr('type') !== 'text') {
                  Vue.prototype.$modals.resetPositions();
                }
              } else {
                Vue.prototype.$modals.resetPositions();
              }
            }
          });
        }
      }]);
      return Modal;
    }();

    var modal = new Modal();

    var proxyModal = new Proxy(modal, {
      get: function get(target, name) {
        if (isFunction(target[name])) {
          return target[name];
        }

        var foundModal = target.getModal(name);

        if (foundModal != null) {
          return foundModal;
        }
        return target[name];
      }
    });

    Vue.prototype.$modals = proxyModal;
  }
};