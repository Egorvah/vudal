import $ from 'jquery';
import isMobile from 'ismobilejs';
import Vudal from './vudal.vue';

function isFunction(object) {
  return typeof object === 'function';
}

export default {
  install: (Vue, options = {}) => {
    const defaultLayer = 1000;
    const dimmerSelector = '.vudal-dimmer';
    const modalSelector = '.vudal';
    const hideModalsOnDimmerClick = options.hideModalsOnDimmerClick != null
      ? options.hideModalsOnDimmerClick
      : true;

    class Modal {
      constructor() {
        this.modals = [];
        this.refreshOnResize = true;
        this.lastLayer = defaultLayer;
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
        const name = this.getModalName(modal);
        // remove from array modals
        const foundModal = this.getModal(name);

        if (foundModal) {
          const index = this.modals.indexOf(foundModal);
          this.modals.splice(index, 1);
          delete this[name];
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
        $('body').addClass('no-scroll');
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
            $(parentModal.$el).bind('click', modal.hide);
          }, 150);
        }

        modal.internalOptions.onVisible();
      }

      onHide(modal) {
        // remove all setted styles
        $(modal.$el).removeAttr('style');
        modal.internalOptions.onHidden();

        const activeModal = this.modals.filter(m => m.isVisible)[0];
        // hide dimmer if all modals hidden
        if (!activeModal) {
          this.closeDimmer();
        }

        // if parent exists then remove blur
        const parentModal = this.getActiveParentModal(modal);
        if (parentModal) {
          $(parentModal.$el).removeClass('child-active');
          $(parentModal.$el).unbind('click', modal.hide);
        }

        this.getChildrenModals(modal).forEach(childModal => childModal.hide());
      }

      hideAll() {
        this.modals.forEach((modal) => {
          if (modal.isVisible) {
            modal.hide();
          }
        });
        this.closeDimmer();
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
        console.log(modal.parents);
        return modal.parents.map((parent) => {
          return this.modals.filter((m) => {
            if (m.$vnode) {
              return m.$vnode.data.ref === parent ||
                (modal.name != null && m.name === parent);
            }
            return modal.name != null && m.name === parent;
          })[0];
        }).filter(m => m != null);
      }

      closeDimmer() {
        $('body').removeClass('no-scroll');
        $(dimmerSelector).removeClass('show');
        // set to default layer value
        this.lastLayer = defaultLayer;
      }

      static camelCase(string) {
        const find = /(-\w)/g;
        const convert = matches => matches[1].toUpperCase();
        return string.replace(find, convert);
      }

      // eslint-disable-next-line class-methods-use-this
      setPosition(modal) {
        setTimeout(() => {
          const marginTop = ($(window).height() - 50) < $(modal.$el).height()
            ? ($(window).height() / 2) - 50
            : $(modal.$el).height() / 2;
          const marginLeft = $(modal.$el).width() / 2;
          $(modal.$el).css('margin', `-${marginTop}px 0 50px -${marginLeft}px`);
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
          $(document).on('click', dimmerSelector, () => {
            Vue.prototype.$modals.hideAll();
          });
        }

        $(document).on('click', modalSelector, (event) => {
          event.stopPropagation();
        });

        // hide modals when clicking on back button
        $(window).on('popstate', () => {
          if ($(dimmerSelector).hasClass('show')) {
            event.stopPropagation();
            event.preventDefault();
            Vue.prototype.$modals.hideAll();
          }
        });

        // hide modals on esc
        $(window).on('keyup', (event) => {
          if ($(dimmerSelector).hasClass('show') && event.keyCode === 27) {
            Vue.prototype.$modals.hideAll();
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
      alert(message) {
        new Vue({

          render(h) {
            return h(Vudal, { props: { name: 'alertModal' }, on: { hide: this.onOk } }, [
              h('div', { class: 'header' }),
              h('div', { class: 'content' }, [message]),
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
    }

    const modal = new Modal();

    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$modals = modal;
  },
};
