import React from 'react'

import './Label.scss'

const Label = ({isBad}) => {
  return (
    <div>
      <div className={'Label' + (isBad ? ' Bad' : ' Good')}></div><span className='LabelName'>{isBad ? 'Negative' : 'Positive'}</span>
    </div>
  )
}

export default Label