'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const usuarioSchema = mongoose.Schema({
    email: { type: String, unique: true},
    password: String
});

usuarioSchema.statics.hashPassword = function ( passwordHaseada ) {
    return bcrypt.hash(passwordHaseada, 7);
};

usuarioSchema.methods.comparePassword = function (passwordHaseada){
    return bcrypt.compare(passwordHaseada, this.password);
}

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;