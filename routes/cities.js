const express = require('express');
const router = express.Router();
const db = require('../models');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodeingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_API_KEY });

router.get('/results', (req, res)=>{
  geocodeingClient.forwardGeocode({ query: req.query.name + ' ' + req.query.state })
  .send().then(response=>{
    let places = response.body.features.filter(result=>{
      if (result['place_type'][0] === 'place') {
        return true
      }
    }).map(city=>{
      return {
        name: city['place_name'].split(', ')[0],
        state: city['place_name'].split(', ')[1],
        lat: city.center[1],
        long: city.center[0]
      }
    });
    res.render('results', { results: places });
  });
});

router.post('/faves', (req, res)=>{
  console.log("Add fave to db");
  console.log(req.body);
  db.city.findOrCreate({
    where: {
      lat: req.body.lat,
      long: req.body.long
    }, defaults: {
      name: req.body.name,
      state: req.body.state
    }
  }).then(([city, created])=>{
    console.log(`City ${city.name} was ${created ? 'created' : 'found'}`);
    res.redirect('/faves');
  }).catch(err=>{
    console.log('💩 error in creating fave in DB')
    console.log(err);
    res.render('404');
  });
});

router.get('/faves', (req, res)=>{
  // get all faves from db
  db.city.findAll().then(cities=>{
    // send all faves to front end
    res.render('faves', { cities });
  }).catch(err=>{
    console.log('💩 error in finding all faves in DB')
    console.log(err);
    res.render('404');
  });
});

module.exports = router;