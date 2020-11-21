import React, {useState} from 'react'

import ZoomIn from './Zoom/ZoomIn'
import ZoomOut from './Zoom/ZoomOut'
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
    
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 })

  function handleZoomIn() {
    if (position.zoom >= 4) return
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 2 }))
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 2 }))
  }

  function handleMoveEnd(position) {
    setPosition(position)
  }

  return (
    <div>
      <ComposableMap
      className='CalamityMap'
      style={{'height': window.innerHeight - (document.getElementById('title') ? document.getElementById('title').clientHeight : 0) + 'px'}}
      data-tip=''
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 147
      }}
    >
      <ZoomableGroup 
        zoom={position.zoom}
        center={position.coordinates}
        onMoveEnd={handleMoveEnd}>
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
    <div className='MapControls'>
      <ZoomIn handleClick={handleZoomIn} />
      <ZoomOut handleClick={handleZoomOut} />
    </div>
  </div>
  )
}

export default CalamityMap