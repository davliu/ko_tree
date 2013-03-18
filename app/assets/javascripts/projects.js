$('form').submit(function() {
  return false;
});

function ProjectViewModel() {
  self = this;
  self.input = ko.observable("");
  self.projects = ko.mapping.fromJS([]);

  // Load projects
  self.loadProjects = function() {
    $.ajax({
      url: 'projects.json',
      type: 'GET'
    }).done(function(data) {
      ko.mapping.fromJS(data, self.projects);
    });
  };

  self.deleteProject = function(project) {
    $.ajax({
      url: 'projects/' + project.id() + '.json',
      type: 'DELETE'
    }).done(function() {
      self.loadProjects();
    });
  };

  self.submitProject = function() {
    if (self.input().length > 0) {
      $.ajax({
        url: 'projects.json',
        data: $('#projects-form').serialize(),
        type: 'POST'
      }).done(function(newProject) {
        self.input("");
        self.projects.push(ko.mapping.fromJS(newProject));
      });
    }
  };

  self.loadProjects();

  ko.bindingHandlers.droppable = {
    init: function(element, valueAccessor, allBindingsAccessor, data, context) {
      $(element).droppable({
        drop: function(event, ui) {
          var dropped = $(this).data('id');
          var dragged = $(ui.draggable).data('id');

          $(ui.draggable).remove();
          $.ajax({
            url: 'projects/' + dragged + '.json',
            type: 'PUT',
            data: {'project': {'project_id': dropped}}
          }).done(function() {
            self.loadProjects();
          });
        }
      });

      $(element).draggable({
        revert: true
      });
    }
  };

};

ko.applyBindings(new ProjectViewModel(), $("[data-bind-element='projects']")[0]);
