import React from 'react'
import CalamityMapContainer from './CalamityMap/CalamityMapContainer'

import { Route } from 'react-router-dom'

const App = () => {
  return (
    <Route exact path={'/'} render={ (routerProps) => < CalamityMapContainer  />} />
  )
}
export default App