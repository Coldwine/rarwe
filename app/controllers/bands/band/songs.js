import Ember from 'ember';

export default Ember.Controller.extend({
  songCreationStarted: false,
  title: '',
  isAddButtonDisabled: Ember.computed('title', function() {
    return Ember.isEmpty(this.get('title'));
  }),
  canCreateSong: Ember.computed('songCreationStarted', function() {
    return this.get('songCreationStarted') || this.get('model.songs.length');
  }),
  actions: {
    updateRating: function(params) {
      var song = params.item;
      var rating = params.rating;
      song.set('rating', rating);
    },
    enableSongCreation: function() {
      this.set('songCreationStarted', true);
    }
  },
});
