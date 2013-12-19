App.SelectemInputComponent = Ember.Component.extend({
  // The HTML class for  styling.
  classNames: ["selectem"],

  // The selected values. Cute default for the purpose of the demo.
  values: [],

  // The new tag the user is in the process of typing in.
  newTagInput: "",

  // Add a tag to the list if it is a nonempty string.
  addTag: function(name) {
    var values = this.get('values');

    if (name && name.length > 0) {
      if (values && values.constructor === Array)
        this.get('values').pushObject(name);
      else
        this.set('values', [name]);
    }
  },

  // Add an array of tags to the list.
  addTags: function(names) {
    var component = this;

    names.forEach(function(name) {
      component.addTag(name)
    });
  },

  // Extract and add new tags based on the user's input, split by commas.
  extractNewTag: function() {
    var inputValue = this.get('newTagInput'),
        tagNames   = inputValue.split(",");

    this.set('newTagInput', '');
    this.addTags(tagNames);
  },

  // Extract a new tag whenever a comma is added to the text.
  extractNewTagIfHasComma: function() {
    var inputValue = this.get('newTagInput');

    if (inputValue.match(/,/))
      this.extractNewTag();
  }.observes("newTagInput"),

  keyDown: function(e) {
    var keyCode     = e.keyCode,
        inputLength = this.get('newTagInput.length');

    // If the user pressed enter, extract a new tag.
    if (keyCode == 13) {
      this.extractNewTag();
    }

    // If the input is empty and the user pressed backspace, delete a tag.
    if (keyCode == 8 && inputLength == 0) {
      this.get('values').popObject();
    }
  },

  click: function() {
    this.$().find('input').focus();
  }
});
