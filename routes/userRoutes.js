'use strict'

var express = require('express');
var userController = require('../controllers/userController');

var api = express.Router();
var md_auth = require('../middlewares/autenticate');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/users'});

api.get('/pruebas-del-controller', md_auth.ensureAuth, userController.pruebas);
api.post('/register', userController.saveUser);
api.post('/login', userController.login);
api.put('/update-user/:id', md_auth.ensureAuth, userController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], userController.uploadImageUser);
api.get('/get-image-file/:imageFile', userController.getImageFile);
api.get('/keepers/', userController.getKeepers);
module.exports = api;
