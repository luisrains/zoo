'use strict'

var express = require('express');
var animalsController = require('../controllers/animalsController');

var api = express.Router();
var md_auth = require('../middlewares/autenticate');
var md_admin = require('../middlewares/is_admin');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/animals'});

api.get('/pruebas-animales', md_auth.ensureAuth, animalsController.pruebas);
api.get('/get-image-animal/:imageFile', animalsController.getImageFile);
api.get('/animales',animalsController.getAnimals);
api.get('/animal/:id',animalsController.getAnimal);
api.put('/animal-update/:id',[md_auth.ensureAuth,md_admin.isAdmin], animalsController.updateAnimal);
api.post('/animal', [md_auth.ensureAuth,md_admin.isAdmin], animalsController.saveAnimal);
api.post('/upload-image-animal/:id', [md_auth.ensureAuth, md_upload,md_admin.isAdmin], animalsController.uploadImageAnimal);
api.delete('/animal/:id',[md_auth.ensureAuth,md_admin.isAdmin],animalsController.deleteAnimal);

module.exports = api;


