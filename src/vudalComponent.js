import $ from 'jquery';
import modalMixin from './modalMixin';

export default {

  props: {
    stickyHeader: {
      type: Boolean,
      default: false,
    },
    stickyActions: {
      type: Boolean,
      default: false,
    },
  },

  mixins: [modalMixin],

  mounted() {
    // add events as semantic ui modal

    // semantic has close button as direct child
    $(this.$el).children('.close').on('click', () => {
      this.hide();
    });

    // in case if close button is not a direct child (bootstrap)
    $(this.$el).children('.header').children('.close').on('click', () => {
      this.hide();
    });

    $(this.$el).on('click', '.actions .cancel, .actions .deny, .actions .negative, .close-modal', () => {
      this.hide();
    });

    // sticky blocks
    if ($(this.$el).has('.header') && this.stickyHeader) {
      $(this.$el).children('.header').addClass('sticky-header');
    }

    if ($(this.$el).has('.actions') && this.stickyActions) {
      $(this.$el).children('.actions').addClass('sticky-actions');
    }
  },

  watch: {
    isVisible(newVal) {
      if (newVal) {
        $(this.$el).removeClass('vudal-fade-out').addClass('vudal-fade-in');
      }
      else {
        $(this.$el).removeClass('vudal-fade-in').addClass('vudal-fade-out');
      }
    },
  },

};
