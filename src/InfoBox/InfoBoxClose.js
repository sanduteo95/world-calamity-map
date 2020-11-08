import React from 'react'

import './InfoBoxClose.scss'

const InfoBoxClose = ({visible, handleOnClick}) => {
  return (visible && <div onClick={handleOnClick} className='InfoBoxOpen'></div>)
}

export default InfoBoxClose