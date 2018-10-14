angular.module('app.controllers', [])


  .controller('menuCtrl', function ($scope, $stateParams) {

    // END of menuCtrl
  })

  .controller('loginCtrl', function ($scope, $stateParams) {

    // END of loginCtrl
  })

  .controller('signupCtrl', function ($scope, $stateParams, $state, $ionicLoading) {


    $scope.signContinueCTA = function (personal) {
      $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner>'
      })

      cloud.savePersonal(personal).then(() => {
        $ionicLoading.hide();
        $state.go('signup_empoyee');
      }, (error) => {
        console.log(error);
        $ionicLoading.hide();
        $ionicLoading.show({
          template: error,
          duration: 3000
        })
      })

    }

    $scope.createAccountCTA = function (employee) {
      $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner>'
      })
      cloud.saveEmployee(employee).then((result) => {
        console.log(result);
        $ionicLoading.hide();
        $state.go('menu.dashboard');
      }, (error) => {
        $ionicLoading.hide();
        $ionicLoading.show({
          template: error,
          duration: 3000
        })
      })


    }

    // END of signupCtrl
  })

  .controller('dashboardCtrl', function ($scope, $stateParams) {

    // END of dashboardCtrl
  })

  .controller('demosCtrl', function ($scope, $stateParams) {

    // END of demosCtrl
  })

  .controller('statsCtrl', function ($scope, $stateParams) {

    // END of statsCtrl
  })

  .controller('adminCtrl', function ($scope, $stateParams, personalList) {

    $scope.personalList = personalList;
    // END of adminCtrl
  })