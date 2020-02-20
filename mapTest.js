require('dotenv').config();

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_API});

geocodingClient.forwardGeocode({
    query: 'Seattle, WA'
}).send().then(response=> {
    console.log(response.body);
});