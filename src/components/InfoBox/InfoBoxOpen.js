import React from 'react'

import './InfoBoxOpen.scss'

const InfoBoxOpen = ({visible, handleOnClick}) => {
  return (visible && <div onClick={handleOnClick} className='InfoBoxClose'></div>)
}

export default InfoBoxOpen