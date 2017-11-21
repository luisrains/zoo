'use strict'
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var pathFileComputer = require('path');
//modelos
var Producto = require('../models/producto');
var User = require('../models/user');

//acciones
function pruebas(req, res){
	res.status(200).send({
			message: 'Probando el controlador de producto',
	});
}

function saveProducto(req,res){
	var producto = new Producto();
	var params = req.body;
	console.log(!params.name != undefined);

	if(params.name != undefined){
		producto.name = params.name;
		producto.description = params.description;
		producto.modelo = params.modelo;
		producto.image = null;
		producto.number = params.number;
		producto.save((err,productoStored)=>{
			if(err){
				res.status(500).send({message: 'Error en el servidor'});
			}else{
				if(!productoStored){
					res.status(404).send({message: 'Error al guardar el producto'});
				}else{
					res.status(200).send({message: 'Producto guardado correctamente',producto: productoStored});
				}
			}

		});
	}else{
		res.status(500).send({message: 'El nombre del producto es obligatorio'});
	}
	
}

function getProductos(req,res){
	//con populate,va a usar el id de user al que hace referencia y va a cargar todo el json de usuario referenciado a el
	Producto.find({}).populate({path: 'user'}).exec((err,productos)=>{
		if(err){
			res.status(500).send({message:'Error en la peticion'});
		}else{
			if(!productos){
				res.status(404).send({message:'No hay productos'});
			}else{
				res.status(200).send({productos: productos});
			}
		}

	});
}

function getProducto(req,res){
	var productoId = req.params.id;
	Producto.findById(productoId).exec((err,animal)=>{
		if(err){
			res.status(500).send({message:'Error en la peticion'});
		}else{
			if(!animal){
				res.status(404).send({message:'No existe el animal'});
			}else{
				res.status(200).send({animal: animal});
			}
		}
	});
}

function updateAnimal(req,res){
	var productoId = req.params.id;
	var updateAnimal = req.body;
	var aniamlAnterior = updateAnimal;
	Animal.findByIdAndUpdate(productoId, updateAnimal, {new:true}).populate({path:'user'}).exec((err,animalUpdate)=>{
		if(err){
			res.status(500).send({message:'Error en la peticion'});
		}else{
			if(!animalUpdate){
				res.status(404).send({message:'El animal no se pudo actulizar'});
			}else{
				res.status(200).send({animal_actualizado: animalUpdate});
			}
		}
	});
}


function uploadImageAnimal(req,res){
	var productoId = req.params.id;
	var file_name = "No subido..";
	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];
		
		var extension_split = file_name.split('\.');
		var file_ext = extension_split[1];

		if(file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'png' || file_ext == 'JPG' || file_ext == 'JPEG'){

			Animal.findByIdAndUpdate(animalId,{image:file_name},{new:true},(err, animalUpdated)=>{
				if(err){
					res.status(500).send({message: "Error al actualizar el animal"});
				}else{
					if(!animalUpdated){
						res.status(404).send({message: "No se ha podido actulizar el animal"});
					}else{
						res.status(200).send({message: "El animal se ha actualizado correctamente", animal: animalUpdated, image:file_name});
					}
				}
			});
		}else{
			fs.unlink(file_path,(err)=>{
				if(err){
					res.status(200).send({message:'Extension no valida pero no eliminado'});
				}else{
					res.status(200).send({message:'Fichero eliminado'});
				}

			});
		}

	}
}

function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var pathFile = './uploads/animals/'+imageFile;
	fs.exists(pathFile, function(exists){
		if(exists){
			res.sendFile(pathFileComputer.resolve(pathFile));
		}else{
			res.status(404).send({message:'La imagen no existe'});
		}
	});
	//res.status(404).send({message:'La imagen no existe d'});

}

function deleteAnimal(req,res){
	var animalId = req.params.id;
	Animal.findByIdAndRemove(animalId, (err, animalRemoved)=>{
		if(err){
			res.status(500).send({message: "Error en la peticion"});
		}else{
			if(!animalRemoved){
				res.status(404).send({message: "No se ha podido borrar el animal"});
			}else{
				res.status(200).send({message: "El animal se ha borrado correctamente", animal: animalRemoved});
			}
		}
	});
}
module.exports= {
	pruebas,
	saveAnimal,
	getAnimals,
	getAnimal,
	updateAnimal,
	getImageFile,
	uploadImageAnimal,
	deleteAnimal
}