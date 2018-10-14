var cloud = {

  insert: (path, data) => {
    return new Promise((resolve, reject) => {

      console.log(data);
      var updates = {};
      updates[path] = data;
      firebase.database().ref().update(updates);
      resolve()
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
              password: data.password
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
        resolve(user);
        sessionStorage.clear();

      }, function (error) {

        reject(error)
      })


    })

  }


}