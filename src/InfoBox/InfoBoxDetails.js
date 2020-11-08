import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './InfoBoxDetails.scss'

const InfoBoxDetails = ({icon, title, paragraph}) => {
  return (
    <div className='InfoBoxColumn InfoBoxDetails'>
      <FontAwesomeIcon icon={icon} />
      <h3>{title}</h3>
      <p>{paragraph}</p>
    </div>
  )
}

export default InfoBoxDetails