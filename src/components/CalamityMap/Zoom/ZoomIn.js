import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
 
import './Zoom.scss'

const ZoomIn = ({handleClick}) => {
  return (
    <div className='Zoom'>
      <div onClick={handleClick}>  
        <FontAwesomeIcon icon={faPlus} />
      </div>
    </div>
  )
}

export default ZoomIn