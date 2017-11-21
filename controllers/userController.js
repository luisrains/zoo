'use strict'
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var pathFileComputer = require('path');
//modelos
var User = require('../models/user');

//service
var jwt = require('../service/jwt');
//acciones
function pruebas(req, res){
	res.status(200).send({
			message: 'Probando el controlador de usuarios',
			user: req.user
	});
}

function saveUser(req, res){
	var newUser = new User();
	var params = req.body;
	console.log('ingreso');

	if(params.password){
		newUser.name = params.name;
		newUser.surname = params.email;
		newUser.email = params.email;
		newUser.role = 'ROLE_USER';
		newUser.image = null;

		User.findOne({email:newUser.email.toLowerCase()}, (err, userf)=>{
			if(err){
				res.status(500).send({message: "Error al comprobar el usuario"});
			}else{
				if(!userf){
					bcrypt.hash(params.password, null, null, function (err, hash){
						newUser.password = hash;
						//el metodo save es de mongoose
						newUser.save((err, userStored)=> {
							if(err){
								res.status(500).send({message: "Error al guardar el usuario"});
							}else{
								if(!userStored){
									res.status(404).send({message: "No se ha registrado el usuario"});	
								}else{
									res.status(200).send({user: userStored});
								}
							}
						});
					});
				}else{
					res.status(500).send({message: "El usuario no puede registrarse, ya existe"});
				}
			}
		});

		
	}else{
		res.status(200).send({message: "Introduzca los datos correctamente"});
	}
}

function login(req, res){
	var params = req.body;
	var email = params.email;
	var password = params.password;

	User.findOne({email:email.toLowerCase()}, (err, userf)=>{
		if(err){
			res.status(500).send({message: "Error al comprobar el usuario"});
		}else{
			if(userf){
				bcrypt.compare(password,userf.password, (error,check)=>{
					if(check){
						if(params.gettoken){
							res.status(200).send({
								token: jwt.createToken(userf)
							});
						}else{
							res.status(200).send({userf});
						}
						
					}else{
						res.status(404).send({message: "El usuario no ha podido loguearse correctamente"});
					}
				});
			}else{
				res.status(404).send({message: "El usuario no ha podido loguearse"});
			}
		}

	});

}

function updateUser(req,res){
	var userId = req.params.id;
	var update = req.body;
	//para que no actualice la contraseña desde editar mis datos
	delete update.password;

	if(userId != req.user.sub){
		res.status(500).send({message: "No tienes permisos para actualizar el user"});
	}
	User.findByIdAndUpdate(userId,update,(err, userUpdated)=>{
		console.log('user->',userUpdated);
		if(err){
			console.log('error->500');
			res.status(500).send({message: "Error al actualizar usuario"});
		}else{

			if(!userUpdated){
				console.log('404->');
				res.status(404).send({message: "No se ha podido actulizar el usuario"});
			}else{
				console.log('200->');
				res.status(200).send({message: "El usuario se ha actualizado correctamente", user: userUpdated});
			}
		}
	});
}

function uploadImageUser(req,res){
	var userId = req.params.id;
	var file_name = "No subido..";
	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];
		var extension_split = file_name.split('\.');
		var file_ext = extension_split[1];
		if(file_ext == 'jpg' || file_ext == 'jpeg'){
			if(userId != req.user.sub){
				res.status(500).send({message: "No tienes permisos para actualizar el user"});
			}

			User.findByIdAndUpdate(userId,{image:file_name},{new:true},(err, userUpdated)=>{
				if(err){
					res.status(500).send({message: "Error al actualizar usuario"});
				}else{
					if(!userUpdated){
						res.status(404).send({message: "No se ha podido actulizar el usuario"});
					}else{
						res.status(200).send({message: "El usuario se ha actualizado correctamente", user: userUpdated, image:file_name});
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
	var pathFile = './uploads/users/'+imageFile;
	fs.exists(pathFile, function(exists){
		if(exists){
			res.sendFile(pathFileComputer.resolve(pathFile));
		}else{
			res.status(404).send({message:'La imagen no existe'});
		}
	});
	//res.status(404).send({message:'La imagen no existe d'});

}

function getKeepers(req,res){
	//es un where lo que esta dento del {}
	User.find({role:'ROLE_ADMIN'}).exec((err,users)=>{
		if(err){
			res.status(500).send({message:'Error en la peticion'});
		}else{
			if(!users){
				res.status(404).send({message:'No hay cuidadores'});
			}else{
				res.status(200).send({users: users});
			}
		}

	});
}
module.exports = {
	pruebas,
	saveUser,
	login,
	updateUser,
	uploadImageUser,
	getImageFile,
	getKeepers
};