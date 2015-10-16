import Ember from 'ember';
import {capitalize as capitalizeWords} from '../../../helpers/capitalize';

export default Ember.Route.extend({
  model() {
    return this.modelFor('bands.band');
  },
  actions: {
    createSong() {
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
    didTransition() {
      var band = this.modelFor('bands.band');
      var name = capitalizeWords(band.get('name'));
      Ember.$(document).attr('title', `${name} songs - Rock & Roll`);
    },
  },
});
