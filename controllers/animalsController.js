'use strict'
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var pathFileComputer = require('path');
//modelos
var Animal = require('../models/animal');
var User = require('../models/user');

//acciones
function pruebas(req, res){
	res.status(200).send({
			message: 'Probando el controlador de animales',
			usuario: req.user
	});
}

function saveAnimal(req,res){
	var animal = new Animal();
	var params = req.body;
	console.log(!params.name != undefined);

	if(params.name != undefined){
		animal.name = params.name;
		animal.description = params.description;
		animal.year = params.year;
		animal.image = null;
		animal.user = req.user.sub;
		animal.save((err,animalStored)=>{
			if(err){
				res.status(500).send({message: 'Error en el servidor'});
			}else{
				if(!animalStored){
					res.status(404).send({message: 'Error al guardar el animal'});
				}else{
					res.status(200).send({message: 'Animal guardado correctamente',animal: animalStored});
				}
			}

		});
	}else{
		res.status(500).send({message: 'El nombre del animal es obligatorio'});
	}
	
}

function getAnimals(req,res){
	//con populate,va a usar el id de user al que hace referencia y va a cargar todo el json de usuario referenciado a el
	Animal.find({}).populate({path: 'user'}).exec((err,animals)=>{
		if(err){
			res.status(500).send({message:'Error en la peticion'});
		}else{
			if(!animals){
				res.status(404).send({message:'No hay animales'});
			}else{
				res.status(200).send({animales: animals});
			}
		}

	});
}

function getAnimal(req,res){
	var animalId = req.params.id;
	Animal.findById(animalId).populate({path:'user'}).exec((err,animal)=>{
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
	var animalId = req.params.id;
	var updateAnimal = req.body;
	var aniamlAnterior = updateAnimal;
	Animal.findByIdAndUpdate(animalId, updateAnimal, {new:true}).populate({path:'user'}).exec((err,animalUpdate)=>{
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
	var animalId = req.params.id;
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