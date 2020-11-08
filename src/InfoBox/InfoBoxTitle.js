import React from 'react'

import './InfoBoxTitle.scss'

const InfoBoxTitle = ({open}) => {
  return (
    <div className='InfoBoxColumn InfoBoxTitle'>
        <h2>What's it like in the world today?</h2>
        {open && <p>
          Click on the map and scroll to zoom in and out. Move across the world by dragging your cursor around the map. Click on any country to see what the news are like for that day and what petitions you could help with.
        </p>}
    </div>
  )
}

export default InfoBoxTitle