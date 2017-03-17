import $ from 'jquery';
import 'proxy-polyfill';
import MobileDetect from 'mobile-detect';

const md = new MobileDetect(window.navigator.userAgent);

function isFunction(object) {
  return typeof object === 'function';
}

export default {
  install: (Vue) => {
    const defaultLayer = 1000;
    const dimmerSelector = '.vudal-dimmer';
    const modalSelector = '.vudal';

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

        this.modals.push(modal);
        // add modal to dimmer wrapper
        $(dimmerSelector).append($(modal.$el).detach());

        // add events as semantic ui modal

        // semantic has close button as direct child
        $(modal.$el).children('.close').on('click', () => {
          modal.hide();
        });

        // in case if close button is not a direct child (bootstrap)
        $(modal.$el).children('.header').children('.close').on('click', () => {
          modal.hide();
        });

        $(modal.$el).on('click', '.actions .cancel, .actions .deny, .actions .negative', () => {
          modal.hide();
        });
      }

      removeModal(modal) {
        // remove from array modals
        let foundModal = this.modals.filter(m => m.$el === modal.$el)[0];

        if (!foundModal && modal.$vnode) {
          foundModal = this.modals.filter(
            m => m.$vnode && m.$vnode.data.ref === modal.$vnode.data.ref
          )[0];
        }

        if (foundModal) {
          const index = this.modals.indexOf(foundModal);
          this.modals.splice(index, 1);
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

        // if exist parent, disable action on parent modal
        const parentModal = this.getParentModal(modal);
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

        // if exist parent, disable action on parent modal
        const parentModal = this.getParentModal(modal);
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

      getParentModal(modal) {
        if (modal.parentRef != null || modal.parent != null) {
          const parentModal = this.modals.filter((m) => {
            if (m.$vnode) {
              return m.$vnode.data.ref === modal.parentRef ||
                (modal.name != null && m.name === modal.parent);
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

        // close all modals on click dimmer
        $(document).on('click', dimmerSelector, () => {
          Vue.prototype.$modals.hideAll();
        });
        $(document).on('click', modalSelector, (event) => {
          event.stopPropagation();
        });

        // hide modals on click back button
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
            if (md.phone()) {
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

    }

    const modal = new Modal();
    // Define proxy for modals instance in order to get modal by name
    const proxyModal = new Proxy(modal, {
      get(target, name) {
        if (isFunction(target[name])) {
          return target[name];
        }

        const foundModal = target.getModal(name);

        if (foundModal != null) {
          return foundModal;
        }
        return target[name];
      },
    });

    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$modals = proxyModal;
  },
};
