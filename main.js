import 'ol/ol.css';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import Map from 'ol/Map';
import Stamen from 'ol/source/Stamen';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {Stroke, Style} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {getVectorContext} from 'ol/render';
import Point from "ol/geom/Point";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Vector from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import {fromLonLat} from "ol/proj";

var new_data = {};

var tileLayer = new TileLayer({
    source: new Stamen({
        layer: 'toner',
    }),
});

var map = new Map({
    layers: [tileLayer],
    target: 'map',
    view: new View({
        center: [0, 0],
        zoom: 2,
    }),
});

var style = new Style({
    stroke: new Stroke({
        color: 'white',
        width: 2
    }),
});

var styleColors = {
    'linode': '#02b159',
    'google': '#1a73e8',
    'aws': '#d13212',
    'azure': '#ffb900',
    'digitalocean': '#0069ff',
    'all': '#ff00b4',
    'vultr': '#ff00b4'
};

function handleData(cloudData, cloudName) {
    var color = styleColors[cloudName];
    for (var i = 0; i < cloudData.length; i++) {
        var benchmark = cloudData[i];
        var from = benchmark[0];
        var to = benchmark[1];

        // create an arc circle between the two locations
        var arcGenerator = new arc.GreatCircle(
            {x: from[1], y: from[0]},
            {x: to[1], y: to[0]}
        );

        var arcLine = arcGenerator.Arc(100, {offset: 10});
        if (arcLine.geometries.length === 2) {
            // this happens when the line crosses the view-port boundary (think SFO to AUS)
            // and so the full line is exit stage-left and enter stage-right
            // not sure if this needs to be in it's own if statement instead of just looping over
            // the geometries, but this comment can serve as a placeholder for later if special-casing needs to happen.
            plot_coords(arcLine.geometries[0].coords, color, i);
            plot_coords(arcLine.geometries[1].coords, color, i);
        }
        if (arcLine.geometries.length === 1) {
            // line fits entirely within viewport, so just plot it
            plot_coords(arcLine.geometries[0].coords, color, i);
        }
    }
}


function handleDataColored(cloudData, cloudName) {
    for (var i = 0; i < cloudData.length; i++) {
        var benchmark = cloudData[i];
        var from = benchmark[0];
        var to = benchmark[1];

        if ((to[0] == from[0]) && (to[1] == from[1])) {
            // console.log(to);
            var point = new Point(fromLonLat(to));
            // point.transform('EPSG:4326', 'EPSG:3857');
            //
            // console.log(point);
            var feature = new Feature({
                geometry: point,
                finished: false,
                color: benchmark[2],
            });
            // add the feature with a delay so that the animation
            // for all features does not start at the same time
            // console.log(feature);
            // addLater(feature, i * 50);
            // feature.setCoordinates(to);
            feature.setStyle(new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
                stroke: new Stroke({
                    color: benchmark[2],
                    width: 2,
                }),
                image: new CircleStyle({
                    radius: 5,
                    // displacement: [to[0] * 10, to[1] * 1],
                    fill: new Fill({
                        color: benchmark[2],
                    }),
                }),
            }));
            // feature.setGeometry(point);
            // pointSource.addFeature(feature);
            continue;
        }

        // create an arc circle between the two locations
        var arcGenerator = new arc.GreatCircle(
            {x: from[1], y: from[0]},
            {x: to[1], y: to[0]}
        );


        var arcLine = arcGenerator.Arc(100, {offset: 10});
        if (arcLine.geometries.length === 2) {
            // this happens when the line crosses the view-port boundary (think SFO to AUS)
            // and so the full line is exit stage-left and enter stage-right
            // not sure if this needs to be in it's own if statement instead of just looping over
            // the geometries, but this comment can serve as a placeholder for later if special-casing needs to happen.
            plot_coords(arcLine.geometries[0].coords, benchmark[2], i);
            plot_coords(arcLine.geometries[1].coords, benchmark[2], i);
        }
        if (arcLine.geometries.length === 1) {
            // line fits entirely within viewport, so just plot it
            plot_coords(arcLine.geometries[0].coords, benchmark[2], i);
        }
    }
}

function plot_coords(coords, color, i) {
    var line = new LineString(coords);
    line.transform('EPSG:4326', 'EPSG:3857');

    var feature = new Feature({
        geometry: line,
        finished: false,
        color: color
    });
    // add the feature with a delay so that the animation
    // for all features does not start at the same time
    addLater(feature, i * 50);
}

function handleJson(json) {
    if (false) {
        handleData(json.linode, 'linode');
        handleData(json.digitalocean, 'digitalocean');
    }
    if (false) {
        handleData(json.google, 'google');
        handleData(json.aws, 'aws');
        handleData(json.azure, 'azure');
    }
    // handleData(json.all, 'all');
    // handleDataColored(linode_colored);
    handleDataColored(json, 'all');
    tileLayer.on('postrender', animateFlights);
}

var flightsSource = new VectorSource({
    wrapX: false,
    attributions:
        'Flight data by ' +
        '<a href="http://openflights.org/data.html">OpenFlights</a>,',
    loader: function () {
        var url = 'http://127.0.0.1:5000/';
        fetch(url, {
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin':'*'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                handleJson(json['working']);
            });
        // handleJson(new_data);
    },
});
/*
var pointSource = new Vector({
    url: 'https://openlayers.org/en/latest/examples/data/geojson/world-cities.geojson',
    format: new GeoJSON(),
});
*/
/*
var pointSource = new VectorSource({
    wrapX: false,
    attributions:
        'Flight data by ' +
        '<a href="http://openflights.org/data.html">OpenFlights</a>,',
    loader: function () {
        // var url = 'https://openlayers.org/en/latest/examples/data/openflights/flights.json';
        // fetch(url)
        //     .then(function (response) {
        //         return response.json();
        //     })
        //     .then(function (json) {
        //         handleJson(json);
        //     });
        // handleJson(new_data);
    },
});
*/

var flightsLayer = new VectorLayer({
    source: flightsSource,
    style: function (feature) {
        // if the animation is still active for a feature, do not
        // render the feature with the layer style
        return new Style({
            stroke: new Stroke({
                color: feature.get('color'),
                // color: feature.get('color'),
                width: 1
            }),
        })
        // return styles[feature.get('cloud')];
    },
});
map.addLayer(flightsLayer);
/*
var pointsLayer = new VectorLayer({
    source: pointSource,
    style: new Style({
        image: new CircleStyle({
            radius: 2,
            fill: new Fill({color: 'red'})
        })
    })
});
*/

setInterval(function(){
    console.log('yolo');
    flightsSource.clear();
    var url = 'http://127.0.0.1:5000/map';
    fetch(url, {
        mode: 'cors',
        headers: {
            'Access-Control-Allow-Origin':'*'
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            handleJson(json['working']);
        });
    // handleJson(new_data);

    // map.removeLayer(flightsLayer);
    // flightsLayer.source.loader();
    // map.addLayer(flightsLayer);
    map.render();
}, 2000);

// map.addLayer(pointsLayer);

// var pointsPerMs = 0.1;
var pointsPerMs = 1;

function animateFlights(event) {
    var vectorContext = getVectorContext(event);
    var frameState = event.frameState;
    vectorContext.setStyle(style);

    var features = flightsSource.getFeatures();
    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        if (!feature.get('finished')) {
            var coords = feature.getGeometry().getCoordinates();
            /*
            // only draw the lines for which the animation has not finished yet
            var elapsedTime = frameState.time - feature.get('start');
            var elapsedPoints = elapsedTime * pointsPerMs;

            if (elapsedPoints >= coords.length) {
                feature.set('finished', true);
            }

            var maxIndex = Math.min(elapsedPoints, coords.length);
            var currentLine = new LineString(coords.slice(0, maxIndex));
            */
            var currentLine = new LineString(coords);

            // directly draw the line with the vector context
            vectorContext.drawGeometry(currentLine);
        }
    }
    // tell OpenLayers to continue the animation
    map.render();
}

function addLater(feature, timeout) {
    window.setTimeout(function () {
        feature.set('start', new Date().getTime());
        flightsSource.addFeature(feature);
    });
}