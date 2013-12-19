App.TimeTagComponent = Ember.Component.extend({
  tagName:            'time',
  attributeBindings:  ['datetime'],
  format:             'YYYY-MM-DD',

  datetime: function() {
    var time = this.get('time');

    return moment(time).format();
  }.property('time'),

  formattedTime: function() {
    var time   = this.get('time'),
        format = this.get('format');

    if ('calendar' === format)
      return moment(time).calendar();
    else
      return moment(time).format(format);
  }.property('time', 'format'),

  layout: Ember.Handlebars.compile('{{formattedTime}}')
});
