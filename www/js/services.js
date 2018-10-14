angular.module('app.services', [])

.factory('personalList', function($firebaseArray){
    var ref = firebase.database().ref('personal/');

    return $firebaseArray(ref)
})

