angular.module('app.controllers', [])


  .controller('menuCtrl', function ($scope, $stateParams, $state, $timeout, $ionicPopup, $ionicLoading) {


    $scope.logoutCTA = () => {
      $ionicPopup.show({
        title: "Log Out",
        subTitle: "Are you sure you want to log out?",
        buttons: [{
          text: 'Cancel'
        }, {
          text: "Log Out",
          type: 'button-assertive',
          onTap: () => {
            $ionicLoading.show({
              template: '<ion-spinner icon="spiral"></ion-spinner>'
            })
            var user = firebase.auth().currentUser;

            cloud.setUserStatus(user, false)

            cloud.logoutAccount().then(() => {
              $ionicLoading.hide();
              $state.go('login');
              $timeout(()=>{
              location.reload();
              },1250)
            }, (error) => {
              console.log(error);
            })
          }
        }]
      })


    }
    console.log('menu');

    cloud.save.getSeccion().then((result) => {
      console.log(result);

      if (result.admin) {
        $('.adminMenuButton').css({'display': 'block'});
      }
    })
    // END of menuCtrl
  })

  .controller('loginCtrl', function ($scope, $stateParams, $state, $ionicLoading, $timeout) {

    $scope.logInUserCTA = (data) => {
      $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner>'
      })
      cloud.loginAccount(data).then((user) => {

        $timeout(() => {
          $state.go('menu.dashboard');
          $ionicLoading.hide();
        }, 1250)
      }, (error) => {
        $ionicLoading.hide();
        $ionicLoading.show({
          template: error.message,
          duration: 3000
        })
      })
    }
    // END of loginCtrl
  })

  .controller('signupCtrl', function ($scope, $stateParams, $state, $ionicLoading, $ionicPopup) {


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
    $scope.admin = {};
    $scope.createAccountCTA = function (employee) {
      console.log(employee);

      if (employee.admin) {
        $ionicPopup.show({
          title: "Admin User",
          subTitle: "Please enter the admin password",
          scope: $scope,
          template: "<div class='item item-input'><input type='password' placeholder='Password' ng-model='admin.password'></div>",
          buttons: [{
            text: 'Cancel'
          }, {
            text: "Confirm",
            type: 'button-assertive',
            onTap: () => {
              console.log($scope.admin);
              cloud.getAdminPassword().then((result) => {
                console.log(result);

                if (result != $scope.admin.password) {
                  $ionicLoading.show({
                    template: "Admin password not correct...",
                    duration: 3000
                  })
                } else {
                  $scope.saveConfirmAccount(employee);
                }
              })

            }
          }]
        })
      } else {
        employee.admin = false;
        $scope.saveConfirmAccount(employee);
      }



    };

    $scope.saveConfirmAccount = (employee) => {
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

  .controller('adminCtrl', function ($scope, $stateParams, personalList, $ionicModal) {

    $ionicModal.fromTemplateUrl('../templates/modals/adminListModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.adminListModal = modal;
    });


    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.adminListModal.remove();
    });

    $scope.viewEmployeeListCTA = () => {
      $scope.adminListModal.show();

      $scope.modalData = {
        data: personalList,
        title: 'Employee List',
        type: 'employee'
      }

    }
    // END of adminCtrl
  })