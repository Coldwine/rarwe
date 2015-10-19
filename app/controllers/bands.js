import Ember from 'ember';

const {Controller, computed} = Ember;

export default Controller.extend({
  name: '',
  isAddButtonDisabled: computed.empty('name'),
});
