'use strict';

const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');



class LoginController {

  /**
   * POST /V1/AUTHENTICATE
   */
   async postAuthenticate(req, res, next) {
    try {
      const { email, password } = req.body;
  
      const user = await Usuario.findOne({ email })
      
      
      if (!user || !(await Usuario.comparePassword(password)) ) {

        const error = new Error('invalid credentials');
        error.status = 401;
        next(error);
        return;
      }
      jwt.sign({ _id: Usuario._id }, process.env.JWT_SECRET, { expiresIn: '2h' }, (err, jwtToken) => {
        if (err) {
          next(err);
          return;
        }
        res.json({ token: jwtToken });
      });
    
    } catch(err) {
      next(err);
    }
  }
}
module.exports = new LoginController();

