import React from 'react'
import PropTypes from 'prop-types'

export default class Tooltip extends React.Component {

  static propTypes = {
    features: PropTypes.array.isRequired
  };

  render() {
    const { features } = this.props;

    const renderFeature = (feature, i) => {

      //convert the nested objects within the feature into key value pairs within arrays, 
      //so React can render them as children
      const tt = JSON.parse(feature.properties.toolTip);
      const properties = Object.keys(tt).map(k=>({ key: k.replace(/_/g,' '), value: tt[k]})).filter(p=>p.value);

      return (        
        <table key={i}>
          <tbody>
          {properties.map(p=>(
              <tr key={p.key}>
                <td><strong className='mr3'>{p.key}</strong></td>
                <td><span className='color-gray-light'>{p.value}</span></td>              
              </tr>
            ))}
        </tbody>
        </table>
      );
    };

    return (
      <div className="flex-parent-inline flex-parent--center-cross flex-parent--column absolute bottom">
        <div className="flex-child px12 py12 bg-gray-dark color-white shadow-darken10 round txt-s w280 clip txt-truncate">
          {features.map(renderFeature)}
        </div>
        <span className="flex-child color-gray-dark triangle triangle--d"></span>
      </div>
    );
  }
}