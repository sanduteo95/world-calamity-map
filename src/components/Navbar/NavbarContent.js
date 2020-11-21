import React from 'react'

import './NavbarContent.scss'

const NavbarContent = ({title, icon, subtitle, content}) => {
  return (
    <div className='Content'>
        <div className='Title'>
            {title}
            {icon}
        </div>
        <h3 className='Subtitle'>{subtitle}</h3>
        {content}
    </div>
  )
}

export default NavbarContent