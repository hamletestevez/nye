angular.module('app.services', [])

.factory('personalList', function($firebaseArray){
    var ref = firebase.database().ref('personal/');

    return $firebaseArray(ref)
})

.service('keyBuild', function () {
    var alphaLower = 'abcdefghijklmnopqrstuvwxyz'.split('');
    var alphaUpper = [];
    var key;
    var build = function () {
      for (i = 0; i < alphaLower.length; i++) {
        var item = alphaLower[i].toUpperCase();
        alphaUpper.push(item);
      }

      for (i = 0; i < 9; i++) {
        var boxSelector = Math.round(Math.random() * 2);
        var alphaSelector = Math.round(Math.random() * 25);
        var numbersSelector = Math.round(Math.random() * 9);
        if (i == 0) {
          if (boxSelector == 1) {
            key = alphaLower[alphaSelector];
          }
          if (boxSelector == 2) {
            key = alphaUpper[alphaSelector];
          } else {
            key = String(numbersSelector);
          }
        }
        if (boxSelector == 0) {
          key = key + alphaLower[alphaSelector];
        }
        if (boxSelector == 1) {
          key = key + alphaUpper[alphaSelector];
        }
        if (boxSelector == 2) {
          key = key + String(numbersSelector);
        }
      }
      return key;
    }
    return build;
  })
  
