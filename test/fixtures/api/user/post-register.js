'use strict';

const data = {
  body: {
    email: 'caninojories@gmail.com',
    fullName: 'Jo-Ries Canino',
    password: 'password',
    removePassword: () => {
      return {
        email: 'caninojories@gmail.com',
        fullName: 'Jo-Ries Canino',
        password: 'password'
      };
    }
  }
};

module.exports = data;
