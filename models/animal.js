'use strict'

//usamos mongoose como orm
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var animalSchema = Schema({
	name: String,
	description: String,
	year: String,
	image: String,
	user: { type: Schema.ObjectId, ref: 'user'}
});

module.exports = mongoose.model('animal', animalSchema);