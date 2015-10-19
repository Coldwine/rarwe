import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('band');
  },
  actions: {
    createBand() {
      const controller = this.get('controller');
      const band = this.store.createRecord('band',
        controller.getProperties('name'));
      band.save().then(() => {
        controller.set('name', '');
        this.transitionTo('bands.band.songs', band);
      });
    },
    didTransition() {
      Ember.$(document).attr('title', 'Bands - Rock & Roll');
    },
  },
});
