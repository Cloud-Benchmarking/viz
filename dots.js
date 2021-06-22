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
var region_speeds = [[[52.3727598, 4.8936041], "#00ff00"], [[51.5073219, -0.1276474], "#00ff00"], [[50.1106444, 8.6820917], "#04ff00"], [[48.8566969, 2.3514616], "#11ff00"], [[43.6534817, -79.3839347], "#18ff00"], [[50.1106444, 8.6820917], "#48ff00"], [[41.8755616, -87.6244212], "#48ff00"], [[51.5164, -0.093], "#59ff00"], [[53.448402, 6.846503244502397], "#60ff00"], [[33.7489924, -84.3902644], "#64ff00"], [[40.7127281, -74.0060152], "#69ff00"], [[40.0757384, -74.4041622], "#69ff00"], [[51.5073219, -0.1276474], "#6cff00"], [[34.0536909, -118.242766], "#6cff00"], [[51.5073219, -0.1276474], "#82ff00"], [[39.0437192, -77.4874899], "#83ff00"], [[37.4429964, -122.1545229], "#8aff00"], [[50.1106444, 8.6820917], "#8cff00"], [[50.1188, 8.6843], "#8cff00"], [[40.7127281, -74.0060152], "#90ff00"], [[50.1106444, 8.6820917], "#92ff00"], [[52.3727598, 4.8936041], "#93ff00"], [[43.6534817, -79.3839347], "#93ff00"], [[45.4972159, -73.6103642], "#a0ff00"], [[32.7762719, -96.7968559], "#a0ff00"], [[50.4477484, 3.8195241], "#a3ff00"], [[40.8229, -74.4592], "#a6ff00"], [[48.8566969, 2.3514616], "#a8ff00"], [[37.5666791, 126.9782914], "#aaff00"], [[25.7741728, -80.19362], "#acff00"], [[34.0536909, -118.242766], "#b0ff00"], [[51.5073219, -0.1276474], "#b2ff00"], [[52.3727598, 4.8936041], "#b3ff00"], [[38.713452, -78.159444], "#bcff00"], [[51.4816546, -3.1791934], "#c2ff00"], [[47.3744489, 8.5410422], "#c2ff00"], [[47.3744489, 8.5410422], "#c8ff00"], [[37.5625, -122.0004], "#ccff00"], [[41.2621283, -95.8613912], "#d3ff00"], [[43.6655, -79.4204], "#deff00"], [[33.1960027, -80.0131374], "#e2ff00"], [[53.3497645, -6.2602732], "#e4ff00"], [[1.357107, 103.8194992], "#e6ff00"], [[43.6534817, -79.3839347], "#e8ff00"], [[36.6676446, -78.3875054], "#ecff00"], [[41.8755616, -87.6244212], "#eeff00"], [[35.6828387, 139.7594549], "#f0ff00"], [[36.1672559, -115.1485163], "#f0ff00"], [[47.6038321, -122.3300624], "#f2ff00"], [[32.9473, -96.7028], "#fff800"], [[35.6828387, 139.7594549], "#fff800"], [[37.3361905, -121.890583], "#fff200"], [[-33.8548157, 151.2164539], "#fff000"], [[37.7790262, -122.4199061], "#fff000"], [[40.7596198, -111.8867975], "#ffea00"], [[29.4246002, -98.4951405], "#ffe800"], [[46.8259601, -71.2352226], "#ffe800"], [[45.6015056, -121.1841587], "#ffe800"], [[41.5910323, -93.6046655], "#ffe000"], [[1.3396365, 103.7073387], "#ffde00"], [[37.5666791, 126.9782914], "#ffd600"], [[47.2342997, -119.8525504], "#ffc600"], [[60.5688901, 27.1881877], "#ffc300"], [[59.9133301, 10.7389701], "#ffb300"], [[1.357107, 103.8194992], "#ffb000"], [[1.2929, 103.8547], "#ffb000"], [[1.357107, 103.8194992], "#ffae00"], [[-33.8548157, 151.2164539], "#ffac00"], [[35.6828387, 139.7594549], "#ffa800"], [[-6.1753942, 106.827183], "#ffa300"], [[34.6198813, 135.490357], "#ff9e00"], [[22.2793278, 114.1628131], "#ff9600"], [[35.685, 139.7514], "#ff9300"], [[35.1799528, 129.0752365], "#ff9200"], [[37.5666791, 126.9782914], "#ff9000"], [[22.2793278, 114.1628131], "#ff9000"], [[24.0755667, 120.5444667], "#ff8e00"], [[-33.8591, 151.2002], "#ff8a00"], [[-31.8759835, 147.2869493], "#ff7e00"], [[48.8607, 2.3281], "#ff7600"], [[18.521428, 73.8544541], "#ff7100"], [[-31.8759835, 147.2869493], "#ff7000"], [[-35.2975906, 149.1012676], "#ff6800"], [[25.0750095, 55.18876088183319], "#ff6600"], [[12.9791198, 77.5912997], "#ff6400"], [[50.1188, 8.6843], "#ff5c00"], [[51.5164, -0.093], "#ff5900"], [[-23.5324859, -46.7916801], "#ff4e00"], [[39.9653, -83.0235], "#ff4900"], [[-23.5506507, -46.6333824], "#ff4800"], [[53.3331, -6.2489], "#ff4100"], [[19.0748, 72.8856], "#ff4100"], [[39.0481, -77.4728], "#ff3e00"], [[37.3388, -121.8914], "#ff3c00"], [[45.4995, -73.5848], "#ff3800"], [[45.8491, -119.7143], "#ff2400"], [[35.685, 139.7514], "#ff2200"], [[1.2929, 103.8547], "#ff2200"], [[37.4562, 126.7288], "#ff1400"], [[-26.205, 28.049722], "#ff1200"], [[-33.8591, 151.2002], "#ff1200"], [[19.0748, 72.8856], "#ff0400"], [[-23.5475, -46.6361], "#ff0000"]];
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


function handleDots(region_speeds) {
    for (var i = 0; i < region_speeds.length; i++) {
        var benchmark = region_speeds[i];

        var to = [19.0748, 72.8856]; //benchmark[0];
        var color = benchmark[1];

        var point = new Point(fromLonLat(to));
            geometry: point,
            finished: false,
            color: color,
        });
        // add the feature with a delay so that the animation
        // for all features does not start at the same time
        feature.setStyle(new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)',
            }),
            stroke: new Stroke({
                color: color,
                width: 2,
            }),
            image: new CircleStyle({
                radius: 5,
                // displacement: [to[0] * 10, to[1] * 1],
                fill: new Fill({
                    color: color,
                }),
            }),
        }));
        feature.setGeometry(point);
        addLater(feature);

    }
}

var pointSource = new VectorSource({
    wrapX: false,
    attributions:
        'Flight data by ' +
        '<a href="http://openflights.org/data.html">OpenFlights</a>,',
    loader: function () {
        handleDots(region_speeds);
    },
});
var pointsLayer = new VectorLayer({
    source: pointSource,
    style: new Style({
        image: new CircleStyle({
            radius: 2,
            fill: new Fill({color: 'red'})
        })
    })
});
map.addLayer(pointsLayer);

map.render();

// tileLayer.on('postrender', animateFlights);
// var pointsPerMs = 0.1;
var pointsPerMs = 1;

function animateFlights(event) {
    console.log('animateFlights');
    var vectorContext = getVectorContext(event);
    var frameState = event.frameState;
    vectorContext.setStyle(style);

    var features = pointSource.getFeatures();
    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        console.log(feature);
            var coords = feature.getGeometry().getCoordinates();
            var currentLine = new LineString(coords);

            // directly draw the line with the vector context
            vectorContext.drawGeometry(currentLine);
    }
    // tell OpenLayers to continue the animation
    map.render();
}

function addLater(feature, timeout) {
    window.setTimeout(function () {
        feature.set('start', new Date().getTime());
        pointSource.addFeature(feature);
    });
}