import React from 'react'
import { VectorMap } from 'react-jvectormap'

import './CalamityMap.scss'

const CalamityMap = ({countries, min, max, handleSelectCountry}) => {
  return (
    <div>
      <VectorMap
        map='world_mill'
        backgroundColor='transparent'
        zoomOnScroll={false}
        containerStyle={{
          width: '100%',
          height: (window.innerHeight - (document.getElementById('title') ? document.getElementById('title').clientHeight : 0)) + 'px' // TODO: responsiveness
        }}
        onRegionClick={handleSelectCountry}
        containerClassName='map'
        regionStyle={{
          initial: {
            fill: '#e4e4e4',
            'fill-opacity': 0.9,
            stroke: 'none',
            'stroke-width': 0,
            'stroke-opacity': 0
          },
          hover: {
            'fill-opacity': 0.8,
            cursor: 'pointer'
          },
          selected: {},
          selectedHover: {}
        }}
        regionsSelectable={true}
        onRegionTipShow={(e, el, code) => {
          el.html(el.html()+' ('+code+': '+countries[code]+')');
        }}
        series={{
          regions: [
            {
              values: countries,
              scale: ['#ff0000', '#146804'],
              legend: {
                vertical: true
              },
              normalizeFunction: 'linear',
              min: min,
              max: max
            }
          ]
        }}
      />
    </div>
  )
}
export default CalamityMap