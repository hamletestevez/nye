angular.module('app.controllers', [])


  .controller('menuCtrl', function ($scope, $stateParams, $state, $timeout, $ionicPopup, $ionicLoading) {

    var windowBlurTime = 0,
      windowBlurCounter;
    $scope.inactiveLogIn = {};
    var inactiveTime = 15, logoutTime = 30;
    $(window).blur(function () {
      //your code here
      console.log('blur');
      windowBlurCounter = setInterval(() => {
        windowBlurTime++;
        console.log(windowBlurTime);
        if (windowBlurTime >= inactiveTime) {
          cloud.save.getSeccion().then((user) => {
            console.log(user);
            cloud.setUserStatus(user, 'inactive')

            if (windowBlurTime >= logoutTime) {
              $scope.inactiveLogIn.name = user.name;
              $scope.inactiveLogIn.email = user.email;
              $scope.promptForInactiveLogIn(user);
              clearInterval(windowBlurCounter);
            }
          })
        }
      }, 1000)
    });
    $(window).focus(function () {
      //your code
      console.log('focus');
      if (windowBlurTime < logoutTime) {
        cloud.save.getSeccion().then((user) => {
        
          console.log(user);
          cloud.setUserStatus(user, 'active');
          clearInterval(windowBlurCounter);
         
        })
      }


      console.log('time', windowBlurTime);
      windowBlurTime = 0
    });



    $scope.promptForInactiveLogIn = (user) => {
      $ionicPopup.show({
        title: "Log In",
        subTitle: "You must log back in!<br> <b>" + user.name + "<br>" + user.email + "</b>",
        scope: $scope,
        template: "<ion-item class='item-input'> <input type='password' placeholder='Password' ng-model='inactiveLogIn.password'></ion-item>",
        buttons: [{
          text: "Cancel"
        }, {
          text: "OK",
          type: "button-assertive",
          onTap: function (e) {
            if(!$scope.inactiveLogIn.password){
              e.preventDefault();
              $ionicLoading.show({
                template: "Password must be provided...",
                duration: 3000
              })
              
            }
            var log = {
              email: user.email,
              password:$scope.inactiveLogIn.password
            }
            cloud.loginAccount(log).then(()=>{
              console.log('log in');
            }, (error)=>{
            console.log(error);
            $ionicLoading.show({
              template: error.message,
              duration: 3000
            })
            $timeout(()=>{
              $scope.promptForInactiveLogIn(user);
            },3000)
            })
          }
        }]
      })
    }
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

            cloud.setUserStatus(user, 'inactive')

            cloud.logoutAccount().then(() => {
              $ionicLoading.hide();
              $state.go('login');
              sessionStorage.removeItem('NYE_save');
              $timeout(() => {
                location.reload();
              }, 1250)
            }, (error) => {
              console.log(error);
            })
          }
        }]
      })
    }

    cloud.save.getSeccion().then((result) => {
      console.log(result);
      $timeout(() => {
        $scope.currentUser = result;
      }, 250)
      if (result.admin) {
        $('.adminMenuButton').css({
          'display': 'block'
        });
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

  .controller('demosCtrl', function ($scope, $stateParams, demoList) {

    $scope.demoList = demoList;



    // END of demosCtrl
  })

  .controller('statsCtrl', function ($scope, $stateParams) {

    // END of statsCtrl
  })

  .controller('adminCtrl', function ($scope, $stateParams, personalList, demoList, $ionicModal, keyBuild, $timeout, $ionicLoading, $state, $ionicHistory) {

    $ionicLoading.show({
      template: '<ion-spinner icon="spiral"></ion-spinner>'
    })

    cloud.save.getSeccion().then((results) => {
      if (results.admin) {
        $ionicLoading.hide();

      } else {
        $ionicLoading.hide();
        $ionicHistory.goBack();
      }
    })


    $scope.keyBuild = keyBuild;

    $scope.newDemoOptions = false;

    $ionicModal.fromTemplateUrl('../templates/modals/adminListModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.adminListModal = modal;
    });

    $ionicModal.fromTemplateUrl('../templates/modals/adminFormModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.adminFormModal = modal;
    });


    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.adminListModal.remove();
      $scope.adminFormModal.remove();
    });

    $scope.viewEmployeeListCTA = () => {
      $scope.adminListModal.show();

      $scope.modalData = {
        data: personalList,
        title: 'Employee List',
        type: 'employee'
      }

    }

    $scope.viewDemoListCTA = () => {
      $scope.adminListModal.show();
      $scope.modalData = {
        data: demoList,
        title: 'Demo List',
        type: 'demos'
      }
    }

    // create demo functions

    $scope.createNewDemoCTA = () => {
      $scope.adminFormModal.show();

      $scope.modalData = {
        data: null,
        title: 'New Demo',
        type: 'demo'
      }

      cloud.temp.tempGet().then((results) => {
        if (results) {
          if (results.item == 'demo') {
            $scope.newDemo = results;
          }
        }
      })
    }

    $scope.createDemoOptionCTA = () => {
      $scope.newDemoOptions = cloud.data.defaultDemoOptions;
    }
    $scope.cancelDemoOptionCTA = () => {
      $scope.newDemoOptions = false;
    };

    $scope.demoOptionAddOptionCTA = () => {
      $scope.newDemoOptions.push({
        name: null,
        place: $scope.newDemoOptions.length + 1
      })
    }

    $scope.removeFromDemoOptionsCTA = ($index) => {

      $scope.newDemoOptions.splice($index, 1);
    }

    $scope.nextDemoOptionsCTA = (demoData) => {
      $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner>'
      })

      var q = [];
      var o = [];

      for (var i = 0; $scope.newDemoOptions.length > i; i++) {

        o.push($scope.newDemoOptions[i].name)
      };

      q.push({
        name: demoData.question,
        type: 'options',
        options: o
      })

      var a = {
        item: 'demo',
        name: demoData.name,
        id: $scope.keyBuild(),
        questions: q
      };

      cloud.temp.tempGet().then((result) => {
        if (result) {
          result.questions.push({
            name: demoData.question,
            type: 'options',
            options: o
          });
          cloud.temp.tempSave(result).then(() => {
            $timeout(() => {
              console.log(result);
              $scope.newDemo = result;
              $scope.newDemoOptions = false;
              demoData.question = null;
              $ionicLoading.hide();
            }, 1500)
          })
        } else {
          cloud.temp.tempSave(a).then(() => {
            $timeout(() => {
              $scope.newDemo = a;
              $scope.newDemoOptions = false;
              demoData.question = null;
              $ionicLoading.hide();
            }, 1500)
          })
        }
      })


    }

    $scope.createDemoTypeCTA = (type, demoData) => {
      $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner>'
      })
      console.log(type);
      var q = [];
      cloud.temp.tempGet().then((results) => {
        if (results) {
          if (results.item == 'demo') {

            if (type === 'number') {
              results.questions.push({
                name: demoData.question,
                type: 'number'
              });
            } else if (type === 'text') {
              results.questions.push({
                name: demoData.question,
                type: 'text'
              });
            } else if (type === 'yes/no') {
              results.questions.push({
                name: demoData.question,
                type: 'yes/no'
              });
            }
            cloud.temp.tempSave(results).then(() => {
              $timeout(() => {
                $scope.newDemo = results;
                $scope.newDemoOptions = false;
                demoData.question = null;
                $ionicLoading.hide();
              }, 1500)
            })
          }
        } else {

          var a = {
            item: 'demo',
            name: demoData.name,
            id: $scope.keyBuild()
          };

          if (type === 'number') {
            q.push({
              name: demoData.question,
              type: 'number'
            })
            a.questions = q;
          } else if (type === 'text') {
            q.push({
              name: demoData.question,
              type: 'text'
            })
            a.questions = q;
          } else if (type === 'yes/no') {
            q.push({
              name: demoData.question,
              type: 'yes/no'
            })
            a.questions = q;
          }

          cloud.temp.tempSave(a).then(() => {
            $timeout(() => {
              console.log(a);
              $scope.newDemo = a;
              $scope.newDemoOptions = false;
              demoData.question = null;
              $ionicLoading.hide();
            }, 1500)
          })
        }
      })
    }

    $scope.completeDemoFormCTA = (demoData) => {

      $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner><br>Creating Demo...'
      })
      demoData = null;

      cloud.temp.tempGet().then((results) => {
        var now = new Date();
        var humanDate = dateFormat(now, "dd mmm dS yyyy, h:MM TT");

        cloud.save.getSeccion().then((user) => {
          results.created_by = user.name;
          results.created_email = user.email;
          results.created_uid = user.uid;
          results.created_on = humanDate;
          cloud.insert('demos/' + results.id, results).then((result) => {
            $timeout(() => {
              $ionicLoading.hide();
              sessionStorage.removeItem('NYE_temp');
              $scope.newDemo = false;
              $scope.adminFormModal.hide();

            }, 1000)

          }, (error) => {
            console.log(error);
            $ionicLoading.show({
              template: error,
              duration: 3000
            })
          })
        })



      })
    }

    $scope.employeeListStatus = (item) => {

      if (item.status == 'inactive') {
        return 'dark'
      } else {
        return 'positive'
      }
    }

    // END of create demo functions


    // END of adminCtrl
  })