import React from 'react'

import './ScoredList.scss'

const ScoredList = ({items, scoreKey, emptyListMessage}) => {
  return (
    <div className='ScoredList'>
      {items.length > 0 && (
        <ul>
          {items.map((item, index) => {
            return (<li key={item.title}>{index + 1}. <a target='__blank' href={item.link}>{item.title}</a><span className={scoreKey === 'count' ? '' : (item[scoreKey] < 0 ? 'Bad' : 'Good')}>{item[scoreKey]}</span></li>)
          })}
        </ul>)}
      {items.length === 0 && (<p>{emptyListMessage}</p>)}
    </div>
    
  )
}

export default ScoredList