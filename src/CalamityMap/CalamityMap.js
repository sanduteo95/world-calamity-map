import React from 'react'

import './CalamityMap.scss'

import { scaleLinear } from 'd3-scale'
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Sphere,
  Graticule
} from 'react-simple-maps'

const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json'

const CalamityMap = ({countries, min, max, setTooltipContent, setPopupNews}) => {
  const colorScale = scaleLinear()
    .domain([min, max])
    .range(['#ff0000', '#146804'])
    
  return (
    <ComposableMap
      className='CalamityMap'
      data-tip=''
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 147
      }}
    >
      <ZoomableGroup zoom={1}>
        <Sphere stroke='#E4E5E6' strokeWidth={0.5} />
        <Graticule stroke='#E4E5E6' strokeWidth={0.5} />
        {Object.keys(countries).length > 0 && (
          <Geographies geography={geoUrl} >
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryCode = Object.keys(countries).find((s) => s === geo.properties.ISO_A2)
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={countryCode ? colorScale(countries[countryCode]) : '#ffffff'}
                    onMouseEnter={() => {
                      const { NAME } = geo.properties
                      setTooltipContent(`${NAME} (${countries[countryCode]})`)
                    }}
                    onClick={() => {
                      setPopupNews(countryCode)
                    }}
                    onMouseLeave={() => {
                      setTooltipContent('')
                    }}
                    style={{
                      default: {
                        outline: 'none'
                      },
                      hover: {
                        outline: 'none'
                      },
                      pressed: {
                        outline: 'none'
                      }
                    }}
                  />
                )
              })
            }
          </Geographies>
        )}
      </ZoomableGroup>
    </ComposableMap>
  )
}

export default CalamityMap