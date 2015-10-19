import Ember from 'ember';
import {capitalize as capitalizeWords} from '../../../helpers/capitalize';

export default Ember.Route.extend({
  model() {
    return this.modelFor('bands.band');
  },
  actions: {
    createSong() {
      const controller = this.get('controller');
      const band = this.modelFor('bands.band');
      const song = this.store.createRecord('song', {
        title: controller.get('title'),
        band: band
      });
      song.save().then(function() {
        controller.set('title', '');
      });
    },
    didTransition() {
      const band = this.modelFor('bands.band');
      const name = capitalizeWords(band.get('name'));
      Ember.$(document).attr('title', `${name} songs - Rock & Roll`);
    },
  },
});
