import React from 'react'

import './Legend.scss'

const Legend = ({min, max}) => {
  let values = []
  for(let i=min; i<=max; i+= (max-min)/4) {
    values.push(Math.ceil(i))
  }

  return (
    <div className='Legend'>
      <div className='Scale'></div>
      <ul className='Markings'>
        {values.map((value, index) => {
          return (<li id={value} key={value}></li>)
        })}
      </ul>
      <ul className='Values'>
        {values.map((value, index) => {
          return (<li id={index+1} key={value}>{value}</li>)
        })}
      </ul>
    </div>
  )
}

export default Legend