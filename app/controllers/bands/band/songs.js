import Ember from 'ember';
import {capitalize} from '../../../helpers/capitalize';

const {Controller, computed} = Ember;

export default Controller.extend({
  songCreationStarted: false,
  title: '',
  isAddButtonDisabled: computed.empty('title'),
  hasSongs: computed.bool('model.songs.length'),
  canCreateSong: computed.or('songCreationStarted', 'hasSongs'),
  newSongPlaceholder: computed('model.name', function() {
    const bandName = this.get('model.name');
    return `New ${capitalize(bandName)} song`;
  }),

  // query params: search and sort
  queryParams: {
    sortBy: 'sort',
    searchTerm: 's'
  },
  sortBy: 'ratingDesc',
  searchTerm: '',
  sortProperties: computed('sortBy', function() {
    const options = {
      'ratingDesc': 'rating:desc,title:asc',
      'ratingAsc': 'rating:asc,title:asc',
      'titleDesc': 'title:desc',
      'titleAsc': 'title:asc'
    };
    return options[this.get('sortBy')].split(',');
  }),
  sortedSongs: computed.sort('matchingSongs', 'sortProperties'),
  matchingSongs: computed('model.songs.@each.title', 'searchTerm',
    function() {
      return this.get('model.songs').filter((song) => {
        const searchTerm = this.get('searchTerm').toLowerCase();
        return song.get('title').toLowerCase().indexOf(searchTerm) !== -1;
      });
    }),

  // controller actions
  actions: {
    updateRating(params) {
      let {item: song, rating} = params;
      if (song.get('rating') === rating) {
        rating = null;
      }
      song.set('rating', rating);
      song.save();
    },
    enableSongCreation() {
      this.set('songCreationStarted', true);
    }
  }
});
