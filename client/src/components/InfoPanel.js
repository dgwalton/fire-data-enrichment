import React from 'react'
import './InfoPanel.css';

export default class Tooltip extends React.Component {

  render() {
    const feature = this.props.selectedFeature;
    if (!feature){
        return <div className='InfoPanel no-data'></div>
    }
    const properties = Object.keys(feature.properties)
    .map(k=>{
        const prop = JSON.parse(feature.properties[k]);
        return { 
        key: k.replace(/_/g,' '), 
        value: Object.keys(prop).map(k2=>({ 
            key: k2.replace(/_/g,' '), 
            value: prop[k2] 
        }
    )).filter(p=>p.value)}}).filter(p=>p.value);

      return (
      <div className='InfoPanel'>
        <button className='close-button' onClick={this.props.onClosed}>X</button>
        <ul>
          {properties.map(p=>(
            <li key={p.key}>
              <h4>{p.key}</h4>
              <table>
                <tbody>
                {p.value.map(p2=>(
                    <tr key={p2.key}>
                      <td><strong className='mr3'>{p2.key}</strong></td>
                      <td><span className='color-gray-light'>{p2.value.toString()}</span></td>              
                    </tr>
                  ))}
              </tbody>
              </table>
            </li>
          ))}
        </ul>
      </div>
      );
    };  
}