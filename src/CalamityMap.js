import React from 'react'
import { VectorMap } from 'react-jvectormap'

const CalamityMap = ({countries, handleSelectCountry}) => {
  return (
    <div>
      <h1>World map of calamities</h1>
      <VectorMap
        map='world_mill'
        backgroundColor='transparent'
        zoomOnScroll={false}
        containerStyle={{
          width: '100%',
          height: '640px' // TODO: responsiveness
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
          selected: {
            fill: '#2938bc' //TODO: remove colour for selected country
          },
          selectedHover: {}
        }}
        regionsSelectable={true}
        series={{
          regions: [
            {
              values: countries,
              scale: ['#146804', '#ff0000'], // TODO: figure out how to do colours better
              normalizeFunction: 'polynomial'
            }
          ]
        }}
      />
    </div>
  )
}
export default CalamityMap