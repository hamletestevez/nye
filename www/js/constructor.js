

var cloud = {

  insert: (path, data) => {
    return new Promise((resolve, reject) => {

      console.log(data);
      var updates = {};
      updates[path] = data;
      firebase.database().ref().update(updates, function (error) {
        if (error) {
          reject(error)
        } else {
          resolve("Data saved successfully.")
        }
      });

    })
  },

  getAdminPassword: () => {
    return new Promise((resolve, reject) => {
      firebase.database().ref('/adminPassword/').once('value').then(function (snapshot) {
        resolve(snapshot.val())
      })

    })
  },

  setUserStatus: (user, status) => {
    var updates = {};
    updates['personal/' + user.uid + '/status/'] = status;
    firebase.database().ref().update(updates);
  },

  getCloudUser: (user) => {
    return new Promise((resolve, reject) => {
      firebase.database().ref('personal/' + user.uid).once('value').then(function (snapshot) {
        resolve(snapshot.val())
      })

    }, (error) => {
      reject(error)
    })
  },

  temp: {
    tempSave: (data) => {
      return new Promise((resolve, reject) => {
        sessionStorage.setItem('NYE_temp', JSON.stringify(data))
        resolve()

      })
    },
    tempGet: () => {
      return new Promise((resolve, reject) => {
        resolve(JSON.parse(sessionStorage.getItem('NYE_temp')));

      })
    }
  },
  save: {
    saveSeccion: (data) => {
      return new Promise((resolve, reject) => {
        sessionStorage.setItem('NYE_save', JSON.stringify(data))
        resolve()

      })
    },
    getSeccion: () => {
      return new Promise((resolve, reject) => {
        resolve(JSON.parse(sessionStorage.getItem('NYE_save')));

      })
    }
  },

  savePersonal: (data) => {
    return new Promise((resolve, reject) => {
      var per = {
        init: () => {
          !data ? reject("No data provided") : per.name()
        },
        name: () => {
          !data.name ? reject("No name provided") : per.address()
        },
        address: () => {
          !data.address ? reject("No address provided") : per.phone()
        },
        phone: () => {
          !data.phone ? reject("No phone provided") : per.saveToTemp()
        },
        saveToTemp: () => {
          cloud.temp.tempSave(data).then(() => {
            resolve(data)
          })
        }
      }
      per.init();

    })
  },

  saveEmployee: (data) => {

    return new Promise((resolve, reject) => {
      var emp = {
        init: () => {
          !data ? reject('No data provided') : emp.account();
        },
        account: () => {
          if (!data.account) {
            data.account = 0;
            emp.email();
          } else {
            emp.email();
          }
        },
        email: () => {
          !data.email ? reject('No Email provided') : emp.password();
        },
        password: () => {
          !data.password ? reject('No password provided') : emp.conPassword();
        },
        conPassword: () => {
          data.password != data.conPassword ? reject('Password not confirm correctly...') : emp.saveToTemp();
        },
        saveToTemp: () => {

          cloud.temp.tempGet().then((personal) => {
            var b = Object.assign(personal, {
              account: data.account,
              email: data.email,
              password: data.password,
              admin: data.admin,
              status: 'active'
            });
            cloud.temp.tempSave(b).then(() => {
              cloud.createAccount(b).then((user) => {
                b.uid = user.uid;
                cloud.insert('personal/' + user.uid + '/', b).then(() => {
                  resolve(user)
                })
              }, (error) => {
                console.log(error);
                reject(error.message)
              })
            })
          })
        }
      }
      emp.init()

    })
  },

  createAccount: (data) => {

    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(data.email, data.password).then(function () {
        var user = firebase.auth().currentUser;
        user.updateProfile({
          displayName: data.name
        })
        data.uid = user.uid;
        resolve(user);
        sessionStorage.removeItem('NYE_temp');
        cloud.save.saveSeccion(data)

      }, function (error) {

        reject(error)
      })


    })

  },
  loginAccount: (user) => {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(() => {
        var user = firebase.auth().currentUser;
        cloud.setUserStatus(user, 'active');
        cloud.getCloudUser(user).then((result) => {
          cloud.save.saveSeccion(result).then(() => {
            console.log('done');
          })
        }, (error) => {
          console.log(error);
        })
        resolve(user);
      }, (error) => {
        reject(error)
      })
    })
  },

  logoutAccount: () => {
    return new Promise((resolve, reject) => {
      firebase.auth().signOut().then(function () {

        resolve()
      }).catch(function (error) {
        reject(error)
      });


    })
  },

  data: {
    defaultDemoOptions: [{
      name: null,
      place: 1
    }, {
      name: null,
      place: 2
    }, {
      name: null,
      place: 3
    }]
  }


}