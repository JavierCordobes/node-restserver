const express = require('express');
const bcrypt= require('bcrypt'); // para encriptar password con hash de una sola via
const _ = require ('underscore'); //  ( pick (PARA PODER REGRESAR UNA COPIA DE UN OBJETO CON FILTRANDO))

const Usuario = require('../models/usuario'); // usuario viene desde usuarioSchema

const app = express();



//RUTAS PARA LOS USUARIOS
app.get('/usuario', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde); // trasnforma desde en un int porque viene en String desde query

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({})
            .skip(desde)
            .limit(limite)
            .exec( (err, usuarios) =>{
              
              if (err ) { 
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            
            res.json({
              ok:true,
              usuarios
            })

            } );
  
  
  }) ;
  
  
  app.post('/usuario', function (req, res) {
  
      let body = req.body;

        //creamos un obejot para guardar en la bd
      let usuario = new Usuario({
          nombre: body.nombre,
          email: body.email,
          password: bcrypt.hashSync( body.password, 10),
          role : body.role
      });

      // guardar en bd
      usuario.save ((err, usuarioDB) => {   

        if (err ) { 
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            usuario : usuarioDB
        })

      });
    


    });
  
    app.put('/usuario/:id', function (req, res) {
  
      let id = req.params.id;
      let body = _.pick( req.body, ['nombre','email','img','role','estado']);




      //actualiza por id 
      Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, }, (err, usuarioDB) =>{
        

        if (err ) { 
          return res.status(400).json({
              ok: false,
              err
          });
      }

            res.json({
                ok: true,
                usuario : usuarioDB,
            });

      })
    })
  
    
    app.delete('/usuario', function (req, res) {
      res.json('delete Usuario')
    })



    module.exports = app;
  