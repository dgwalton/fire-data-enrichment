import React, { Component } from 'react';
import Map from './components/Map';
import InfoPanel from './components/InfoPanel';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedFeature: null
    };
  }

  selectionChanged(feature){
    this.setState({
      selectedFeature: feature
    });
  }

  render() {

    const selectedFeature = this.state.selectedFeature;

    return (
      <div className='App'>
        <Map 
          selectionChanged={(f)=>this.selectionChanged(f)} 
          selectedFeature={selectedFeature} />
        <InfoPanel 
          selectedFeature={selectedFeature}
          onClosed={()=>this.selectionChanged(null)} />
      </div>

    );
  }
}

export default App;
