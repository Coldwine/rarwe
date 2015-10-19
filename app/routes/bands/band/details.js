import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    willTransition(transition) {
      const controller = this.get('controller');
      let leave;

      if (controller.get('isEditing')) {
        leave = window.confirm(
          'You have unsaved changes. Are you sure you want to leave?'
        );
        if (leave) {
          controller.set('isEditing', false);
        } else {
          transition.abort();
        }
      }
    },
    save() {
      const controller = this.get('controller');
      const band = controller.get('model');
      return band.save();
    }
  },
});
