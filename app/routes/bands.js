import Ember from 'ember';
import wait from '../utils/wait';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('band');
  },
  actions: {
    createBand() {
      var controller = this.get('controller');
      var band = this.store.createRecord('band',
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
