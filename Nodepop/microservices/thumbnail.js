'use strict';

const cote = require('cote');
const Jimp = require('jimp');
const path = require('path');

const responder = new cote.Responder({ name: 'Redimensionado de imagen'});

responder.on('resize', (req, done) => {


    Jimp.read(path.join(__dirname, '..', 'public', 'images', 'anuncios', req.filename ))
    .then( imagen => {
        return imagen.resize(100, 100).write(path.join(__dirname, '..', 'public', 'images', 'anuncios', 'thumbnail_'+req.filename));
    }).catch(error => {
        next(error)
    });
    done('thumbanil_'+ req.filename);
});

module.exports = responder;