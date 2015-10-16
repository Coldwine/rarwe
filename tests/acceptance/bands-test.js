import { test } from 'qunit';
import moduleForAcceptance from 'rarwe/tests/helpers/module-for-acceptance';
import Pretender from 'pretender';
import httpStubs from '../helpers/http-stubs';

var server;

moduleForAcceptance('Acceptance | bands');

test('List bands', (assert) => {
  server = new Pretender(function() {
    httpStubs.stubBands(this, [
      {
        id: 1,
        attributes: {
          name: 'Radiohead'
        }
      },
      {
        id: 2,
        attributes: {
          name: 'Long Distance Calling'
        }
      }
    ]);
  });

  visit('/bands');

  andThen(() => {
    assertLength(assert, '.band-link', 2, 'All band links are rendered');
    assertLength(assert, '.band-link:contains("Radiohead")', 1,
      'First band link contains the band name');
    assertLength(assert, '.band-link:contains("Long Distance Calling")', 1,
      'The other band link contains the band name');
  });
});

test('Create a new band', (assert) => {
  server = new Pretender(function() {
    httpStubs.stubBands(this, [
      {
        id: 1,
        attributes: {
          name: 'Radiohead'
        }
      }
    ]);
    httpStubs.stubCreateBand(this, 2);
  });

  visit('/bands');
  fillIn('.new-band', 'Long Distance Calling');
  click('.new-band-button');

  andThen(() => {
    assertLength(assert, '.band-link', 2, 'All band links are rendered');
    assertTrimmedText(assert, '.band-link:last', 'Long Distance Calling',
      'Created band appears at the end of the list');
    assertElement(assert, '.nav a.active:contains("Songs")',
      'The songs tab is active');
  });
});

test('Create a new song in two steps', (assert) => {
  server = new Pretender(function() {
    httpStubs.stubBands(this, [
      {
        id: 1,
        attributes: {
          name: 'Radiohead'
        }
      }
    ]);
    httpStubs.stubCreateSong(this, 1);
  });

  selectBand('Radiohead');
  click('a:contains("create one")');
  fillIn('.new-song', 'Killer Cars');
  submit('.new-song-form');

  andThen(() => {
    assertElement(assert, '.songs .song:contains("Killer Cars")',
      'Creates the song and displays it in the list');
  });
});

test('Sort songs in various ways', (assert) => {
  server = new Pretender(function() {
    httpStubs.stubBands(this, [
      {
        id: 1,
        attributes: {
          name: 'Them Crooked Vultures'
        }
      }
    ]);
    httpStubs.stubSongs(this, 1, [
      {
        id: 1,
        attributes: {
          name: 'Elephants',
          rating: 5
        }
      },
      {
        id: 2,
        attributes: {
          name: 'New Fang',
          rating: 4
        }
      },
      {
        id: 3,
        attributes: {
          name: 'Mind Eraser, No Chaser',
          rating: 4
        }
      },
      {
        id: 4,
        attributes: {
          name: 'Spinning in Daffodils',
          rating: 5
        }
      }
    ]);
  });

  selectBand('Them Crooked Vultures');

  andThen(() => {
    assert.equal(currentURL(), '/bands/1/songs');
    assertTrimmedText(assert, '.song:first', 'Elephants',
      'The first song is the highest ranked, first in the alphabet');
    assertTrimmedText(assert, '.song:last', 'New Fang',
      'The last song is the lowest ranked, last in the alphabet');
  });

  click('button.sort-title-desc');

  andThen(() => {
    assert.equal(currentURL(), '/bands/1/songs?sort=titleDesc');
    assertTrimmedText(assert, '.song:first', 'Spinning in Daffodils',
      'The first song is the one that is the last in the alphabet');
    assertTrimmedText(assert, '.song:last', 'Elephants',
      'The last song is the one that is the first in the alphabet');
  });

  click('button.sort-rating-asc');

  andThen(() => {
    assert.equal(currentURL(), '/bands/1/songs?sort=ratingAsc');
    assertTrimmedText(assert, '.song:first', 'Mind Eraser, No Chaser',
      'The first song is the lowest ranked, first in the alphabet');
    assertTrimmedText(assert, '.song:last', 'Spinning in Daffodils',
      'The last song is the highest ranked, last in the alphabet');
  });
});

test('Search songs', (assert) => {
  server = new Pretender(function() {
    httpStubs.stubBands(this, [
      {
        id: 1,
        attributes: {
          name: 'Them Crooked Vultures',
        }
      }
    ]);
    httpStubs.stubSongs(this, 1, [
      {
        id: 1,
        attributes: {
          title: 'Elephants',
          rating: 5
        }
      },
      {
        id: 2,
        attributes: {
          title: 'New Fang',
          rating: 4
        }
      },
      {
        id: 3,
        attributes: {
          title: 'Mind Eraser, No Chaser',
          rating: 4
        }
      },
      {
        id: 4,
        attributes: {
          title: 'Spinning in Daffodils',
          rating: 5
        }
      },
      {
        id: 5,
        type: 'songs',
        attributes: {
          title: 'No One Loves me & Neither Do I',
          rating: 5
        }
      }
    ]);
  });

  visit('/bands/1');
  fillIn('.search-field', 'no');

  andThen(() => {
    assertLength(assert, '.song', 2,
      'The songs matching the search term are displayed');
  });

  click('button.sort-title-desc');
  andThen(() => {
    assertTrimmedText(assert, '.song:first', 'No One Loves Me & Neither Do I',
      'A matching song that comes later in the alphabet on top');
    assertTrimmedText(assert, '.song:last', 'Mind Eraser, No Chaser',
      'A matching song that comes sooner in the alphabet appears at bottom');
  });
});
