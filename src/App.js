// import React from 'react'
// import { VectorMap } from 'react-jvectormap'
// const mapData = {
//   CN: 100000,
//   IN: 9900,
//   SA: 86,
//   EG: 70,
//   SE: 0,
//   FI: 0,
//   FR: 0,
//   US: 20
// }
// const handleClick = (e, countryCode) => {
//   console.log(countryCode);
// };
// const App = () => {
//   return (
//     <div>
//       <h1>World map of calamities</h1>
//       <VectorMap
//         map='world_mill'
//         backgroundColor='transparent'
//         zoomOnScroll={false}
//         containerStyle={{
//           width: '100%',
//           height: '640px'
//         }}
//         onRegionClick={handleClick} //gets the country code
//         containerClassName='map'
//         regionStyle={{
//           initial: {
//             fill: '#e4e4e4',
//             'fill-opacity': 0.9,
//             stroke: 'none',
//             'stroke-width': 0,
//             'stroke-opacity': 0
//           },
//           hover: {
//             'fill-opacity': 0.8,
//             cursor: 'pointer'
//           },
//           selected: {
//             fill: '#2938bc' //color for the clicked country
//           },
//           selectedHover: {}
//         }}
//         regionsSelectable={true}
//         series={{
//           regions: [
//             {
//               values: mapData, //this is your data
//               scale: ['#146804', '#ff0000'], //your color game's here
//               normalizeFunction: 'polynomial'
//             }
//           ]
//         }}
//       />
//     </div>
//   )
// }
// export default App

import React from 'react'
import CalamityMapContainer from './CalamityMapContainer'

const App = () => {
  return (
    <CalamityMapContainer />
  )
}
export default App