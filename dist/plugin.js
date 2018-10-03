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

var _ismobilejs = require('ismobilejs');

var _ismobilejs2 = _interopRequireDefault(_ismobilejs);

var _vudal = require('./vudal.vue');

var _vudal2 = _interopRequireDefault(_vudal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = {
  confirm: {
    style: 'normal',
    approveLabel: 'Approve',
    cancelLabel: 'Cancel',
    approveBtnClass: 'vudal-btn vudal-btn-primary',
    cancelBtnClass: 'vudal-btn vudal-btn-default'
  }
};

exports.default = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var opts = _jquery2.default.extend(true, {}, defaultOptions, options);
    var defaultLayer = 1000;
    var dimmerSelector = '.vudal-dimmer';
    var hideModalsOnDimmerClick = options.hideModalsOnDimmerClick != null ? options.hideModalsOnDimmerClick : true;

    var Modal = function () {
      function Modal() {
        (0, _classCallCheck3.default)(this, Modal);

        this.modals = [];
        this.refreshOnResize = true;
        this.lastLayer = defaultLayer;
        this.contentPosition = null;
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

          if (this[name] != null) {
            console.error('Cannot use modal name "' + name + '", it is a reserved word');
            return;
          }

          this.modals.push(modal);
          this[name] = modal;

          (0, _jquery2.default)(dimmerSelector).append((0, _jquery2.default)(modal.$el).detach());
        }
      }, {
        key: 'removeModal',
        value: function removeModal(modal) {
          var _this = this;

          var name = Modal.getModalName(modal);

          var foundModal = this.getModal(name);

          if (foundModal) {
            var index = this.modals.indexOf(foundModal);
            this.modals.splice(index, 1);
            delete this[name];
          }

          if (!this.hasActiveModals) {
            this.closeDimmer();
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
          if (this.contentPosition === null) {
            this.contentPosition = (0, _jquery2.default)('body').scrollTop();
          }

          (0, _jquery2.default)('body').addClass('no-scroll').css('top', '-' + this.contentPosition + 'px');
          (0, _jquery2.default)(dimmerSelector).addClass('show');

          (0, _jquery2.default)(modal.$el).css('z-index', this.getNewLayer());

          this.setPosition(modal);

          var parentModal = this.getActiveParentModal(modal);
          if (parentModal) {
            (0, _jquery2.default)(parentModal.$el).addClass('child-active');
            setTimeout(function () {
              (0, _jquery2.default)(parentModal.$el).on('click', modal.hide);
            }, 150);
          }

          modal.internalOptions.onVisible();
        }
      }, {
        key: 'onHide',
        value: function onHide(modal) {
          (0, _jquery2.default)(modal.$el).removeAttr('style');
          modal.internalOptions.onHidden();

          this.getParentModals(modal).forEach(function (parentModal) {
            if (parentModal) {
              (0, _jquery2.default)(parentModal.$el).removeClass('child-active');
              (0, _jquery2.default)(parentModal.$el).off('click', modal.hide);
            }
          });

          this.getChildrenModals(modal).forEach(function (childModal) {
            return childModal.hide();
          });
          (0, _jquery2.default)(modal.$el).removeClass('child-active');

          if (!this.hasActiveModals) {
            this.closeDimmer();
          }
        }
      }, {
        key: 'hideAll',
        value: function hideAll() {
          this.modals.forEach(function (modal) {
            if (!modal.isVisible) {
              return;
            }

            modal.hide();
          });

          if (!this.hasActiveModals) {
            this.closeDimmer();
          }
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
        key: 'getActiveParentModal',
        value: function getActiveParentModal(modal) {
          return this.getParentModals(modal).filter(function (m) {
            return m.isVisible === true;
          })[0];
        }
      }, {
        key: 'getParentModals',
        value: function getParentModals(modal) {
          var _this3 = this;

          return modal.parents.map(function (parent) {
            return _this3.modals.filter(function (m) {
              if (m.$vnode) {
                return m.$vnode.data.ref === parent || modal.name != null && m.name === parent;
              }
              return modal.name != null && m.name === parent;
            })[0];
          }).filter(function (m) {
            return m != null;
          });
        }
      }, {
        key: 'closeDimmer',
        value: function closeDimmer() {
          (0, _jquery2.default)('body').removeClass('no-scroll').removeAttr('style');
          (0, _jquery2.default)(dimmerSelector).removeClass('show');

          this.lastLayer = defaultLayer;

          if (this.contentPosition != null) {
            (0, _jquery2.default)('body').scrollTop(this.contentPosition);

            this.contentPosition = null;
          }
        }
      }, {
        key: 'setPosition',
        value: function setPosition(modal) {
          var _this4 = this;

          if (!modal.autoCenter) {
            return;
          }
          setTimeout(function () {
            if (_this4.activeModals.length === 1) {
              var marginTop = (0, _jquery2.default)(window).height() - 50 < (0, _jquery2.default)(modal.$el).height() ? (0, _jquery2.default)(window).height() / 2 - 50 : (0, _jquery2.default)(modal.$el).height() / 2;
              var marginLeft = (0, _jquery2.default)(modal.$el).width() / 2;
              (0, _jquery2.default)(modal.$el).css('margin', '-' + marginTop + 'px 0 50px -' + marginLeft + 'px');
            } else {
              var top = (0, _jquery2.default)(window).height() / 2 - (0, _jquery2.default)(modal.$el).height() / 2 + (0, _jquery2.default)('.vudal-dimmer').scrollTop();
              (0, _jquery2.default)(modal.$el).css('top', top + 'px');
              (0, _jquery2.default)(modal.$el).css('margin-top', '0px');
            }
          }, 0);
        }
      }, {
        key: 'resetPositions',
        value: function resetPositions() {
          var _this5 = this;

          this.modals.forEach(function (modal) {
            _this5.setPosition(modal);
          });
        }
      }, {
        key: 'alert',
        value: function alert(message, details) {
          var _this6 = this;

          new Vue({
            render: function render(h) {
              return h(_vudal2.default, { class: 'narrow', props: { name: 'alertModal' }, on: { hide: this.onOk } }, [h('div', { class: 'header main center', domProps: { innerHTML: message } }, []), h('div', { class: 'content center', domProps: { innerHTML: details } }, []), h('div', { class: 'actions' }, [h('button', { class: 'vudal-btn', on: { click: this.onOk } }, ['OK'])])]);
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
            _this6.getModal('alertModal').$show();
          });
        }
      }, {
        key: 'confirm',
        value: function confirm() {
          var _this7 = this;

          var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var message = params.message,
              _onApprove = params.onApprove,
              _onCancel = params.onCancel,
              parent = params.parent;
          var approveLabel = params.approveLabel,
              cancelLabel = params.cancelLabel,
              approveBtnClass = params.approveBtnClass,
              cancelBtnClass = params.cancelBtnClass,
              style = params.style;


          if (approveLabel == null) {
            approveLabel = opts.confirm.approveLabel;
          }

          if (cancelLabel == null) {
            cancelLabel = opts.confirm.cancelLabel;
          }

          if (approveBtnClass == null) {
            approveBtnClass = opts.confirm.approveBtnClass;
          }

          if (cancelBtnClass == null) {
            cancelBtnClass = opts.confirm.cancelBtnClass;
          }

          if (style == null || ['narrow', 'normal', 'wide'].indexOf(style) === -1) {
            style = opts.confirm.style;
          }

          if (style === 'normal') {
            style = '';
          }

          new Vue({
            render: function render(h) {
              return h(_vudal2.default, { class: style, props: { name: 'confirmModal', parent: parent }, on: { hide: this.closeVudal } }, [h('div', { class: 'header main center', domProps: { innerHTML: message } }, []), h('div', { class: 'actions' }, [h('button', { class: approveBtnClass, on: { click: this.onApprove }, style: { marginLeft: '5px' } }, [approveLabel]), h('button', { class: cancelBtnClass, on: { click: this.onCancel }, style: { marginLeft: '5px' } }, [cancelLabel])])]);
            },
            data: function data() {
              return { message: message };
            },


            methods: {
              onApprove: function onApprove() {
                if (_onApprove != null) {
                  _onApprove();
                }
                this.$modals.confirmModal.$hide();
              },
              onCancel: function onCancel() {
                if (_onCancel != null) {
                  _onCancel();
                }
                this.$modals.confirmModal.$hide();
              },
              closeVudal: function closeVudal() {
                this.$destroy();
              }
            }
          }).$mount();

          Vue.nextTick(function () {
            _this7.getModal('confirmModal').$show();
          });
        }
      }, {
        key: 'activeModals',
        get: function get() {
          return this.modals.filter(function (modal) {
            return modal.isVisible;
          }).sort(function (a, b) {
            if (a.showedAt < b.showedAt) {
              return -1;
            }
            if (a.showedAt > b.showedAt) {
              return 1;
            }
            return 0;
          });
        }
      }, {
        key: 'hasActiveModals',
        get: function get() {
          return this.activeModals.length > 0;
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
            (0, _jquery2.default)(document).on('click', dimmerSelector, function (event) {
              if (Vue.prototype.$modals.getModal('confirmModal') != null) {
                return;
              }
              if (event.target !== (0, _jquery2.default)(dimmerSelector).get(0)) {
                return;
              }
              Vue.prototype.$modals.hideAll();
            });
          }

          (0, _jquery2.default)(window).on('popstate', function (event) {
            if ((0, _jquery2.default)(dimmerSelector).hasClass('show')) {
              event.stopPropagation();
              event.preventDefault();
              Vue.prototype.$modals.hideAll();
            }
          });

          (0, _jquery2.default)(window).on('keyup', function (event) {
            if ((0, _jquery2.default)(dimmerSelector).hasClass('show') && event.keyCode === 27) {
              var modals = Vue.prototype.$modals.activeModals.filter(function (modal) {
                return modal.closeByEsc;
              });
              if (modals.length > 0) {
                modals[modals.length - 1].hide();
              }
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

    Vue.prototype.$modals = modal;
  }
};