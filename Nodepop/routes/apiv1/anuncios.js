'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');
const path = require('path');
const jwtAuth = require('../../lib/jwtAuth');
const cote = require('cote');
const multer = require('multer');
const Requester = new cote.Requester({ name: 'Redimensionado de imagen'});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'images', 'anuncios'));
    },
    filename: (req, file, cb) => {
        cb(null, file.filename + '-' + Date.now() + file.originalname);
    }
});

var upload = multer({ storage: storage })




router.get('/', (req, res, next) => {

  const start = parseInt(req.query.start) || 0;
  const limit = parseInt(req.query.limit) || 1000; // nuestro api devuelve max 1000 registros
  const sort = req.query.sort || '_id';
  const includeTotal = req.query.includeTotal === 'true';
  const filters = {};
  if (typeof req.query.tag !== 'undefined') {
    filters.tags = req.query.tag;
  }

  if (typeof req.query.venta !== 'undefined') {
    filters.venta = req.query.venta;
  }

  if (typeof req.query.precio !== 'undefined' && req.query.precio !== '-') {
    if (req.query.precio.indexOf('-') !== -1) {
      filters.precio = {};
      let rango = req.query.precio.split('-');
      if (rango[0] !== '') {
        filters.precio.$gte = rango[0];
      }

      if (rango[1] !== '') {
        filters.precio.$lte = rango[1];
      }
    } else {
      filters.precio = req.query.precio;
    }
  }

  if (typeof req.query.nombre !== 'undefined') {
    filters.nombre = new RegExp('^' + req.query.nombre, 'i');
  }

  Anuncio.list(filters, start, limit, sort, includeTotal, function (err, anuncios) {
    if (err) return next(err);
    res.json({ ok: true, result: anuncios });
  });
});

// Return the list of available tags
router.get('/tags', function (req, res) {
  res.json({ ok: true, allowedTags: Anuncio.allowedTags() });
});

//Crear anuncio

router.post('/', upload.single('photo'), async(req, res, next) => {
    try {
        const anuncioData = req.body;

        const anuncio = new Anuncio(anuncioData)

        const nuevoAnuncio = await anuncio.save();

        if(req.file) {
          anuncioData.foto = req.file.filename;

          Requester.send({
            type: 'resize',
            filename: req.file.filename,
            destination:req.file.destination
          }, resized => {
            anuncio.data.thumbnail = resized;
            Anuncio.findByIdAndUpdate(nuevoAnuncio._id, anuncioData, {new: true}, (err, nuevoAnuncio) => {
              if (error) {
                next(error)
              }
            })
          })
        }

        res.status(201).json({result: nuevoAnuncio});
    } catch(err) {
        next(err);
    }
})



module.exports = router;
