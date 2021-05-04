var express = require('express');
const router = require('express').Router();

/* GET /change-locale/:locale */

router.get('/:locale', function(req, res, next) {
    const locale = req.params.locale;

    res.cookie('nodeapi-locale', locale, { maxAge: 1000*60*60*24*20 });

    res.redirect(req.get('referer'));
});

module.exports = router;