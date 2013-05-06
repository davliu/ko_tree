'use strict';
var TreeApp = angular.module('TreeApp', []);

TreeApp.directive('ngtree', function($compile) {
  return {
    restrict: 'E',
    terminal: true,
    scope: { val: '=', parentData:'=' },
    link: function (scope, element, attrs) {
      var template = '<span>{{val.name}}</span><button ng-click="deleteMe()" ng-show="val.name">delete</button>';
      if (angular.isArray(scope.val.items)) {
          template += '<ul class="indent"><li ng-repeat="project in val.projects"><tree val="project" parent-data="val.projects"></tree></li></ul>';
      }
      scope.deleteMe = function(index) {  
        if(scope.parentData) {               
            var itemIndex = scope.parentData.indexOf(scope.val);
          scope.parentData.splice(itemIndex,1);                 
        }
        scope.val = {};                
      };
      var newElement = angular.element(template);
      $compile(newElement)(scope);
      element.replaceWith(newElement);            
    }
  };
});
// Credits: http://stackoverflow.com/questions/14430655/recursion-in-angular-directives

TreeApp.controller('ProjectsController', ['$scope', '$http', function ($scope, $http) {
  $scope.projects = [];

  $http.get('projects.json/?grouping=Angular').then(function(response) {
    $scope.projects = response.data;
  });

  $scope.submitProject = function() {
    $('#angular-projects-form').serialize();

    if ($scope.projectText != null && $scope.projectText.length > 0) {
      $.ajax({
        url: 'projects.json',
        data: $('#angular-projects-form').serialize(),
        type: 'POST',
        success: function(newProject) {
          $scope.projectText = "";
          $scope.projects.push(newProject);
          $scope.$apply();
        },
        error: function(response) {
        }
      });
    };
  };

  $scope.deleteProject = function(index) {
    var person = $scope.projects[index];
    $.ajax({
      url: 'projects/' + person.id + '.json',
      type: 'DELETE'
    }).done(function() {
      $scope.projects.splice(index, 1);
      $scope.$apply();
    });
  };
}]);
