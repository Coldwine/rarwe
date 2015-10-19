import Ember from 'ember';

export default Ember.Route.extend({
  afterModel(band) {
    const description = band.get('description');
    if (Ember.isEmpty(description)) {
      this.transitionTo('bands.band.songs');
    } else {
      this.transitionTo('bands.band.details');
    }
  },
});
