import $ from 'jquery';
import modalMixin from './modalMixin';

export default {

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
