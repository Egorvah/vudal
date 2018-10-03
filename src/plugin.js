import $ from 'jquery';
import isMobile from 'ismobilejs';
import Vudal from './vudal.vue';


const defaultOptions = {
  confirm: {
    style: 'normal',
    approveLabel: 'Approve',
    cancelLabel: 'Cancel',
    approveBtnClass: 'vudal-btn vudal-btn-primary',
    cancelBtnClass: 'vudal-btn vudal-btn-default',
  },
};

export default {
  install: (Vue, options = {}) => {
    const opts = $.extend(true, {}, defaultOptions, options);
    const defaultLayer = 1000;
    const dimmerSelector = '.vudal-dimmer';
    const hideModalsOnDimmerClick = options.hideModalsOnDimmerClick != null
      ? options.hideModalsOnDimmerClick
      : true;

    class Modal {
      constructor() {
        this.modals = [];
        this.refreshOnResize = true;
        this.lastLayer = defaultLayer;
        this.contentPosition = null;
      }

      getNewLayer() {
        this.lastLayer += 1;
        return this.lastLayer;
      }

      addModal(modal) {
        if (!$(dimmerSelector).length) {
          Modal.addDimmer();
        }

        const name = Modal.getModalName(modal);
        const existingModal = this.getModal(name);
        if (existingModal != null && !Vue.config.silent) {
          console.warn(`Modal with name "${name}" already defined`);
          return;
        }

        if (this[name] != null) {
          console.error(`Cannot use modal name "${name}", it is a reserved word`);
          return;
        }

        this.modals.push(modal);
        this[name] = modal;

        // add modal to dimmer wrapper
        $(dimmerSelector).append($(modal.$el).detach());
      }

      removeModal(modal) {
        const name = Modal.getModalName(modal);
        // remove from array modals
        const foundModal = this.getModal(name);

        if (foundModal) {
          const index = this.modals.indexOf(foundModal);
          this.modals.splice(index, 1);
          delete this[name];
        }

        // hide dimmer if all modals hidden
        if (!this.hasActiveModals) {
          this.closeDimmer();
        }

        // remove childs from DOM
        this.getChildrenModals(modal).forEach(childModal => this.removeModal(childModal));

        // remove from DOM
        $(modal.$el).remove();
      }

      getModal(name) {
        return this.modals.filter((modal) => {
          if (modal.$vnode != null) {
            return modal.$vnode.data.ref === name || (name != null && modal.name === name);
          }
          return name != null && modal.name === name;
        })[0];
      }

      static getModalName(modal) {
        if (modal.name != null) {
          return modal.name;
        }

        if (modal.$vnode != null) {
          return modal.$vnode.data.ref;
        }

        return null;
      }

      removeAll() {
        this.hideAll();
        this.modals.slice(0).forEach((modal) => {
          this.removeModal(modal);
        });
      }

      onShow(modal) {
        if (this.contentPosition === null) {
          this.contentPosition = $('body').scrollTop();
        }

        $('body').addClass('no-scroll').css('top', `-${this.contentPosition}px`);
        $(dimmerSelector).addClass('show');

        // add layer index
        $(modal.$el).css('z-index', this.getNewLayer());

        // add center position
        this.setPosition(modal);

        // if parent modal exists then add blur
        const parentModal = this.getActiveParentModal(modal);
        if (parentModal) {
          $(parentModal.$el).addClass('child-active');
          setTimeout(() => {
            $(parentModal.$el).on('click', modal.hide);
          }, 150);
        }

        modal.internalOptions.onVisible();
      }

      onHide(modal) {
        // remove all setted styles
        $(modal.$el).removeAttr('style');
        modal.internalOptions.onHidden();

        // if parent exists then remove blur
        this.getParentModals(modal).forEach((parentModal) => {
          if (parentModal) {
            $(parentModal.$el).removeClass('child-active');
            $(parentModal.$el).off('click', modal.hide);
          }
        });

        this.getChildrenModals(modal).forEach(childModal => childModal.hide());
        $(modal.$el).removeClass('child-active');

        // hide dimmer if all modals hidden
        if (!this.hasActiveModals) {
          this.closeDimmer();
        }
      }

      get activeModals() {
        return this.modals.filter(modal => modal.isVisible).sort((a, b) => {
          if (a.showedAt < b.showedAt) {
            return -1;
          }
          if (a.showedAt > b.showedAt) {
            return 1;
          }
          return 0;
        });
      }

      get hasActiveModals() {
        return this.activeModals.length > 0;
      }

      hideAll() {
        this.modals.forEach((modal) => {
          if(!modal.isVisible) {
            return;
          }

          modal.hide();
        });

        if (!this.hasActiveModals) {
          this.closeDimmer();
        }
      }

      getChildrenModals(modal) {
        if (modal.$vnode) {
          return this.modals.filter(
            m => m.parentRef === modal.$vnode.data.ref ||
            (modal.name != null && m.parent === modal.name)
          );
        }

        return this.modals.filter(m => modal.name != null && m.parent === modal.name);
      }

      getActiveParentModal(modal) {
        return this.getParentModals(modal).filter(m => m.isVisible === true)[0];
      }

      getParentModals(modal) {
        return modal.parents.map(parent =>
          this.modals.filter((m) => {
            if (m.$vnode) {
              return m.$vnode.data.ref === parent ||
                (modal.name != null && m.name === parent);
            }
            return modal.name != null && m.name === parent;
          })[0]
        ).filter(m => m != null);
      }

      closeDimmer() {
        $('body').removeClass('no-scroll').removeAttr('style');
        $(dimmerSelector).removeClass('show');
        // set to default layer value
        this.lastLayer = defaultLayer;

        if (this.contentPosition != null) {
          $('body').scrollTop(this.contentPosition);
          // reset content scroll height
          this.contentPosition = null;
        }
      }

      static camelCase(string) {
        const find = /(-\w)/g;
        const convert = matches => matches[1].toUpperCase();
        return string.replace(find, convert);
      }

      // eslint-disable-next-line class-methods-use-this
      setPosition(modal) {
        if (!modal.autoCenter) {
          return;
        }
        setTimeout(() => {
          // if there is only one active modal
          // then calculate margin (old method)
          // but for children calculate using top
          if (this.activeModals.length === 1) {
            const marginTop = ($(window).height() - 50) < $(modal.$el).height()
              ? ($(window).height() / 2) - 50
              : $(modal.$el).height() / 2;
            const marginLeft = $(modal.$el).width() / 2;
            $(modal.$el).css('margin', `-${marginTop}px 0 50px -${marginLeft}px`);
          }
          else {
            const top = ($(window).height() / 2) - ($(modal.$el).height() / 2) + $('.vudal-dimmer').scrollTop();
            $(modal.$el).css('top', `${top}px`);
            $(modal.$el).css('margin-top', `0px`);
          }
        }, 0);
      }

      resetPositions() {
        this.modals.forEach((modal) => {
          this.setPosition(modal);
        });
      }

      static addDimmer() {
        const dimmer = '<div class="vudal-dimmer"></div>';
        $(document.body).append(dimmer);

        if (hideModalsOnDimmerClick) {
          // close all modals when clickling on dimmer
          $(document).on('click', dimmerSelector, (event) => {
            if (Vue.prototype.$modals.getModal('confirmModal') != null) {
              return;
            }
            if (event.target !== $(dimmerSelector).get(0)) {
              return;
            }
            Vue.prototype.$modals.hideAll();
          });
        }

        // hide modals when clicking on back button
        $(window).on('popstate', (event) => {
          if ($(dimmerSelector).hasClass('show')) {
            event.stopPropagation();
            event.preventDefault();
            Vue.prototype.$modals.hideAll();
          }
        });

        // hide modals on esc
        $(window).on('keyup', (event) => {
          if ($(dimmerSelector).hasClass('show') && event.keyCode === 27) {
            const modals = Vue.prototype.$modals.activeModals.filter(modal => modal.closeByEsc);
            if (modals.length > 0) {
              modals[modals.length - 1].hide();
            }
          }
        });

        // reset position all modals after resize window
        $(window).resize(() => {
          // if show modal window
          if ($(dimmerSelector).hasClass('show')) {
            // detect mobile device
            if (isMobile.phone) {
              // if target not input
              if ($(document.activeElement).attr('type') !== 'text') {
                Vue.prototype.$modals.resetPositions();
              }
            }
            else {
              Vue.prototype.$modals.resetPositions();
            }
          }
        });
      }

      /**
       * Create alert window based on vudal
       */
      alert(message, details) {
        new Vue({

          render(h) {
            return h(Vudal, { class: 'narrow', props: { name: 'alertModal' }, on: { hide: this.onOk } }, [
              h('div', { class: 'header main center', domProps: { innerHTML: message } }, []),
              h('div', { class: 'content center', domProps: { innerHTML: details } }, []),
              h('div', { class: 'actions' }, [
                h('button', { class: 'vudal-btn', on: { click: this.onOk } }, ['OK']),
              ]),
            ]);
          },

          data() {
            return { message };
          },

          methods: {
            onOk() {
              this.$destroy();
              this.$modals.closeDimmer();
            },
          },
        }).$mount();

        Vue.nextTick(() => {
          this.getModal('alertModal').$show();
        });
      }

      /**
       * Create confirmation window based on vudal
       */
      confirm(params = {}) {
        const {
          message,
          onApprove,
          onCancel,
          parent,
        } = params;

        let {
          approveLabel,
          cancelLabel,
          approveBtnClass,
          cancelBtnClass,
          style,
        } = params;

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

          render(h) {
            return h(Vudal, { class: style, props: { name: 'confirmModal', parent }, on: { hide: this.closeVudal } }, [
              h('div', { class: 'header main center', domProps: { innerHTML: message } }, []),
              h('div', { class: 'actions' }, [
                h('button', { class: approveBtnClass, on: { click: this.onApprove }, style: { marginLeft: '5px' } }, [approveLabel]),
                h('button', { class: cancelBtnClass, on: { click: this.onCancel }, style: { marginLeft: '5px' } }, [cancelLabel]),
              ]),
            ]);
          },

          data() {
            return { message };
          },

          methods: {
            onApprove() {
              if (onApprove != null) {
                onApprove();
              }
              this.$modals.confirmModal.$hide();
            },

            onCancel() {
              if (onCancel != null) {
                onCancel();
              }
              this.$modals.confirmModal.$hide();
            },

            closeVudal() {
              this.$destroy();
              // this.$modals.closeDimmer();
            },
          },
        }).$mount();

        Vue.nextTick(() => {
          this.getModal('confirmModal').$show();
        });
      }
    }

    const modal = new Modal();

    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$modals = modal;
  },
};
