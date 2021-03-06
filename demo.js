(function($) {
  App = Ember.Application.create({
    rootElement: '#main-content'
  });
  App.deferReadiness();

  App.ApplicationController = Ember.Controller.extend({
    tags: ["kittens", "puppies", "octopuses"],
    time: moment().add('days', 1).add('hours', -2)
  });

  var templates = [
    {
      name: "application"
    }, {
      name: "demos/selectem"
    }, {
      name: "demos/calembar"
    }, {
      name: "demos/time-tag"
    }, {
      name: "components/selectem-input"
    }, {
      name: "components/calembar-input"
    }
  ];

  App.set('templateCode', Ember.Object.create());

  var loadTemplate = function(template) {
    var templateName = template.name;
    var sourceName   = template.sourceName;
    var path         = templateName + ".handlebars";

    return $.get(path).then(function(text) {
      Ember.TEMPLATES[templateName] = Ember.Handlebars.compile(text);
      if (sourceName) {
        App.set('templateCode.' + sourceName, text);
      }
    });
  }

  var templatePromises = templates.map(function(templateName) {
    return loadTemplate(templateName);
  });

  $.when.apply($, templatePromises).then(function() {
    App.advanceReadiness();
  });
})(jQuery);
