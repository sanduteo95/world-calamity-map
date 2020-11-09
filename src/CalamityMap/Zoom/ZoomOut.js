import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus } from '@fortawesome/free-solid-svg-icons'
 
import './Zoom.scss'

const ZoomOut = ({handleClick}) => {
  return (
    <div className='Zoom'>
      <div onClick={handleClick}>  
        <FontAwesomeIcon icon={faMinus} />
      </div>
    </div>
  )
}

export default ZoomOut