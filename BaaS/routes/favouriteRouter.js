const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

const Favourite = require('../models/favourite');

const favouriteRouter = express.Router();
favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, (req,res,next) => {
    Favourite.find({})
    .populate('user')
    .populate('dish')
    .then((favourite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favourite);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) =>{
    Favourite.findOne({'user': req.user._id })
    .then((favourite) => {
        if(favourite){
            for(var i=0;i<=req.body.length;i++){
                if(favourite.dish.indexOf(req.body[i]._id)===-1){
                    favourite.dish.push(req.body[i]._id);
                }
            }
            favourite.save()
            .then((favourite)=>{
                console.log('Favourite Created ',favourite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err)); 
        }
        else {
            Favourite.create({'user':req.user._id, 'dish': req.body})
            .then((favorite) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err));
        }
    },(err)=>next(err))
    .catch((err) => next(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Favourite.findOneAndRemove({'user':req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
    })

favouriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200);})
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.setHeader = 403;
    res.end('GET operation is not supported on /favourite/' + req.params.dishId);
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
    Favourite.findOne({'user':req.user._id})
    .then((favourite) => {
        if(favourite){
            if(favourite.dish.indexOf(req.params.dishId)===-1){
                favourite.dish.push(req.param.dishId)
                favourite.save()
                .then((favourite) => {
                    console.log('Favorite Created ', favourite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err))
            }
        }
        else{
            Favourite.create({'user':req.user._id, 'dish':[req.params.dishId]})
            .then((favourite) => {
                console.log('Favourite Created', favourite);
                res.statusCode= 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourite);
            },(err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favourite/'+ req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourite.findOne({'user':req.user._id})
    .then((favorite)=> {
        if(favorite){
            index = favorite.dish.indexOf(req.params.dishId)
            if(index>=0){
                favorite.dish.splice(index,1);
                favorite.save()
                .then((favorite) => {
                    console.log("Favourite deleted", favourite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json')
                    res.json(favorite)
                }, (err)=>next(err))
            }
            else{
                err = new Error('Dish' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err)
            }
        }
        else {
            err = new Error('Favourite not found')
            err.status = 404;
            return next(err)
        }
    }, (err) => next(err))
    .catch((err)=> next(err));
})

module.exports = favouriteRouter;