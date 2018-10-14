angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    

      .state('menu.dashboard', {
    url: '/page1',
    views: {
      'side-menu21': {
        templateUrl: 'templates/dashboard.html',
        controller: 'dashboardCtrl'
      }
    }
  })

  .state('menu.demos', {
    url: '/page2',
    views: {
      'side-menu21': {
        templateUrl: 'templates/demos.html',
        controller: 'demosCtrl'
      }
    }
  })

  .state('menu.stats', {
    url: '/page3',
    views: {
      'side-menu21': {
        templateUrl: 'templates/stats.html',
        controller: 'statsCtrl'
      }
    }
  })

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

  .state('menu.admin', {
    url: '/page4',
    views: {
      'side-menu21': {
        templateUrl: 'templates/admin.html',
        controller: 'adminCtrl'
      }
    }
  })

  .state('login', {
    url: '/page5',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup_personal', {
    url: '/page6',
    templateUrl: 'templates/signup_personal.html',
    controller: 'signupCtrl'
  })

  .state('signup_empoyee', {
    url: '/page7',
    templateUrl: 'templates/signup_empoyee.html',
    controller: 'signupCtrl'
  })

$urlRouterProvider.otherwise('/page5')


});