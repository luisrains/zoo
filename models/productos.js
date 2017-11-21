'use strict'

//usamos mongoose como orm
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productoSchema = Schema({
	name: String,
	description: String,
	modelo: String,
	image: String,
	precio:number
});

module.exports = mongoose.model('producto', productoSchema);