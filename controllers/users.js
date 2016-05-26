var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../utility/key');
var mypassport = require('../utility/mypassport');
var common = require('../utility/common-func');
var User = require('../models/user-models');
var moment = require('moment');

router.get('/', function (req, res) {
    User.find({}, function (err, docs) {
        if (err)
            return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
        
        return res.json(docs);
    });
});

router.post('/search', mypassport.verifyToken, function (req, res) {
    var username = (req.body.username == undefined) ? "" : req.body.username;
    var role = [true, false];
    if (req.body.role == 1) role = [true];
    if (req.body.role == 2) role = [false];
    var fromDate = moment(req.body.fromDate, 'DD/MM/YYYY HH:mm:ss:Z').toString();
    var toDate = moment(req.body.toDate, 'DD/MM/YYYY HH:mm:ss:Z').toString();

    User.find({
        username: new RegExp(username, "i"),
        admin: { $in: role }
    }, function (err, docs) {
        if (err)
            return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
        
        return res.json(docs);
    });
});

router.post('/signup', function (req, res) {
    var admin = (req.body.isAdmin == 1) ? true : false;
    var newUser = new User({
        username: req.body.username, 
        password: common.encryptPassword(req.body.password),
        admin: admin,
        created_at: Date(),
    });
    
    if (newUser.validateSync()) {
        return res.status(400).json({ error: true, message: 'Invalidate input.' });
    }
    
    newUser.save(function (err) {
        if (err)
            return res.status(500).json({ error: true, message: 'Something went wrong. Please try again later.' });
        
        res.json({ error: false, message: 'User saved successfully' });
    });
});

router.post('/signin', function (req, res) {
    if (!req.body.username || !req.body.password)
        return res.status(400).json({ message: 'Please provide username or password.' });
    
    User.findOne({
        username: req.body.username, 
        password: common.encryptPassword(req.body.password)
    }, function (err, docs) {
        if (err) throw err;
        
        if (!docs)
            return res.status(401).json({ error: true, message: 'Authentication failed. User not found.' });
        
        var token = jwt.sign(docs, config.secret, {
            expiresInMinutes: 1440
        });
        return res.json({
            id: docs.id,
            username: docs.username, 
            token: token,
        });
    });
});

module.exports = router;