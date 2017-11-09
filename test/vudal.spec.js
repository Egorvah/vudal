import Vue from 'vue';
import $ from 'jquery';
import Vudal, { VudalPlugin } from './../src/index';

describe('vudal', () => {
  let root;
  let vm;
  Vue.use(VudalPlugin);

  it('plugin default values without modals', () => {
    const vueComponent = new Vue();
    expect(vueComponent.$modals.modals).toEqual([]);
    expect(vueComponent.$modals.lastLayer).toEqual(1000);
  });

  describe('with modal', () => {
    beforeEach(() => {
      if (root) { // remove modals if exist
        root.$modals.removeAll();
      }

      root = new Vue({
        template: '<vudal name="testModal"></vudal>',
        components: { Vudal },
      }).$mount();
      vm = root.$children[0];
    });


    it('add modal', () => {
      expect(vm.$modals.modals).toEqual([vm]);
    });

    it('is show modal', (done) => {
      spyOn(vm.$modals, 'onShow');
      vm.$show();
      Vue.nextTick(() => {
        expect(vm.$isActive).toEqual(true);
        expect(vm.$modals.onShow).toHaveBeenCalledWith(vm);
        done();
      });
    });

    it('is hidden modal', (done) => {
      spyOn(vm.$modals, 'onHide');
      vm.$show();
      vm.$hide();
      Vue.nextTick(() => {
        expect(vm.$isActive).toEqual(false);
        expect(vm.$modals.onHide).toHaveBeenCalledWith(vm);
        done();
      });
    });

    it('change layout', (done) => {
      const secondModalRoot = new Vue({
        template: '<vudal name="secondModal"></vudal>',
        components: { Vudal },
      }).$mount();
      const secondModal = secondModalRoot.$children[0];

      vm.$show();
      secondModal.$show();

      Vue.nextTick(() => {
        expect(vm.$modals.lastLayer).toEqual(1002);
        done();
      });
    });

    it('restore layout number after hide modals', (done) => {
      const secondModalRoot = new Vue({
        template: '<vudal name="secondModal"></vudal>',
        components: { Vudal },
      }).$mount();
      const secondModal = secondModalRoot.$children[0];

      vm.$show();
      secondModal.$show();

      vm.$modals.hideAll();

      Vue.nextTick(() => {
        expect(vm.$modals.lastLayer).toEqual(1000);
        done();
      });
    });

    it('hide all modals', (done) => {
      const secondModalRoot = new Vue({
        template: '<vudal name="secondModal"></vudal>',
        components: { Vudal },
      }).$mount();
      const secondModal = secondModalRoot.$children[0];

      vm.$show();
      secondModal.$show();
      secondModal.$hide();

      vm.$modals.hideAll();

      Vue.nextTick(() => {
        expect(vm.$isActive).toEqual(false);
        expect(secondModal.$isActive).toEqual(false);
        done();
      });
    });

    it('close child after close parent modal', (done) => {
      const childModalRoot = new Vue({
        template: '<vudal name="childModal" parent="testModal"></vudal>',
        components: { Vudal },
      }).$mount();
      const childModal = childModalRoot.$children[0];

      spyOn(vm, '$emit');
      spyOn(childModal, '$emit');

      vm.$show();
      childModal.$show();

      vm.$hide();

      Vue.nextTick(() => {
        expect(vm.$isActive).toEqual(false);
        expect(childModal.$isActive).toEqual(false);
        expect(vm.$emit).toHaveBeenCalledWith('hide');
        expect(childModal.$emit).toHaveBeenCalledWith('hide');
        done();
      });
    });

    it('open modal with two parents', (done) => {
      const secondModalRoot = new Vue({
        template: '<vudal name="secondModal"></vudal>',
        components: { Vudal },
      }).$mount();
      const secondModal = secondModalRoot.$children[0];

      const childModalRoot = new Vue({
        template: '<vudal name="childModal" :parent="[\'testModal\', \'secondModal\']"></vudal>',
        components: { Vudal },
      }).$mount();
      const childModal = childModalRoot.$children[0];

      secondModal.$show();
      childModal.$show();

      Vue.nextTick(() => {
        expect(vm.$isActive).toEqual(false);
        expect(secondModal.$isActive).toEqual(true);
        expect(childModal.$isActive).toEqual(true);
        expect($(vm.$el).hasClass('child-active')).toEqual(false);
        expect($(secondModal.$el).hasClass('child-active')).toEqual(true);
        done();
      });
    });
  });
});
