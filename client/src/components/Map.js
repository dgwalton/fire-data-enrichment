import React from 'react';
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import Tooltip from './Tooltip'

mapboxgl.accessToken = 'pk.eyJ1IjoiZGFud2FsbGllIiwiYSI6ImNqb3lwdG4ydjE3eGgzcG8zdGJkdnJnMHAifQ.GgPVuZU253kgxKYB7Al_Ww';

class Map extends React.Component {

  tooltipContainer;

  setTooltip(features) {

    ReactDOM.unmountComponentAtNode(this.tooltipContainer);

    if (features.length) {

      ReactDOM.render(
        React.createElement(
          Tooltip, {
            features
          }
        ),
        this.tooltipContainer
      );
    } else {
      this.tooltipContainer.innerHTML = '';
    }
  }

  componentDidMount() {

    // Container to put React generated content in.
    this.tooltipContainer = document.createElement('div');
    

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [-77.5, 37.5],
      zoom: 10
    });

    const tooltip = new mapboxgl.Marker(this.tooltipContainer, {
      offset: [-120, 0]
    }).setLngLat([0,0]).addTo(map);

    //once map is loaded, add geojson from the enrichment service
    map.on('load', (e)=> {
      map.loadImage('images/pin.png', function(error, image) {
        if (error) throw error;
        map.addImage('pin', image);
        fetch('/api/data').then(data=>data.json()).then(data=>{
            map.addLayer( {
              id: 'incidents',
              type: 'symbol',
              source: { type: 'geojson', data: data },
              layout: { 'icon-image': 'pin', "icon-size": 0.6, visibility: 'visible' }              
            }); 
        });
      });    
    })

    //on click, center map and show a side info panel
    map.on('click', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['incidents'] });
      const feature = features.length ? features[0] : null;
      this.props.selectionChanged(feature);           
    });
    
    //show a maptip on hover
    map.on('mousemove', (e) => {
      const features = map.queryRenderedFeatures(e.point)
        .filter(f=>{
          return f.layer.id === "incidents";
        });
      tooltip.setLngLat(e.lngLat);
      map.getCanvas().style.cursor = features.length ? 'pointer' : '';
      this.setTooltip(features);
    });
  }

  render() {
    return (
      <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
    );
  }
}

export default Map;