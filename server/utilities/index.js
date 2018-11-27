const fetch = require('node-fetch');


exports.enrich = async function(incidentJson) {
    const lat = incidentJson.address.latitude;
    const lon = incidentJson.address.longitude;
    const date = new Date(incidentJson.description.event_opened); //format is "2017-05-15T20:16:18-04:00"
    const dateString = date.toISOString().substring(0, 10); 
    const hour = parseInt(date.toISOString().substring(11,2));
    
    //download extra data
    const parcelJson = await getParcel(lat, lon);
    const weatherJson = await getWeather(lat, lon, dateString, hour);

    //combine all data into a single object with nesting
    const properties = {
        location: incidentJson.address, 
        parcel: parcelJson,
        incident: incidentJson.description, 
        department: incidentJson.fire_department,
        weather: weatherJson,
        toolTip: {
            number: incidentJson.description.incident_number
        }
    };

    //return geojson format for mapbox 
    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": properties,
                "geometry": {
                    "type": "Point",
                    "coordinates": [ lon, lat ]
                }
            }
        ]
    }     
}

/*
    Query Richmond parcel service for extra info
*/
async function getParcel(lat, lon){
    
    const body = postify({
        geometry: `{x:${lon},y:${lat}}`,
        geometryType: 'esriGeometryPoint',
        inSR: 4326,
        spatialRel: 'esriSpatialRelIntersects',
        returnGeometry: true,
        outSR: 4326,
        outFields: '*',
        f: 'json'
    });
    const json = await fetch('http://gis.richmondgov.com/ArcGIS/rest/services/StatePlane4502/Ener/MapServer/0/query',
    {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: "POST",
        body: body
    });
    const parcelData = await json.json();
    return parcelData.features.length > 0 ? parcelData.features[0].attributes : {};
}


/*
    Query historical weather service for extra info
*/
async function getWeather(lat, lon, date, hour){
    const url = `https://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=509f888ccb3f47cebca162820182611&q=${lat},${lon}&date=${date}&tp=1&format=json`;
    console.log(url);
    const json = await fetch(url);
    const resp = await json.json();
    const hourString = (hour*100).toString();
    const hourly = resp.data.weather[0].hourly.find(h=>h.time === hourString);
    return hourly || {};
}

// helper function for converting json docs into post body format
function postify(obj){
    return Object.keys(obj).map(k=>`${k}=${encodeURI(obj[k])}`).join('&');
}
