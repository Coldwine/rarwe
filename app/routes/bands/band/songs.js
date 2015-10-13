import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.modelFor('bands.band');
  },
  actions: {
    createSong: function() {
      var controller = this.get('controller');
      var band = this.modelFor('bands.band');
      var song = this.store.createRecord('song', {
        title: controller.get('title'),
        band: band
      });
      song.save().then(function() {
        controller.set('title', '');
      });
    },
    didTransition: function() {
      var band = this.modelFor('bands.band');
      Ember.$(document)
        .attr('title', `${band.get('name')} songs - Rock & Roll`);
    },
  },
});
