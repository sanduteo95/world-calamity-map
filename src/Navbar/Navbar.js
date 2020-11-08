import React from 'react'

import NavbarContent from './NavbarContent'
import './Navbar.scss'

const Navbar = ({openTab, tabTitle, tabIcon, tabSubtitle, renderTabContent}) => {
  return (
    <div  className='Navbar'>
      <ul className='NavbarTabs'>
        <li className='about'><div onClick={() => openTab('about')}>About</div></li>
        <li className='articles'><div onClick={() => openTab('articles')}>Articles</div></li>
        <li className='petitions'><div onClick={() => openTab('petitions')}>Petitions</div></li>
        <li className='statistics'><div onClick={() => openTab('statistics')}>Statistics</div></li>
      </ul>
      <NavbarContent title={tabTitle} icon={tabIcon} subtitle={tabSubtitle} content={renderTabContent()}/>
    </div>
    
  )
}

export default Navbar