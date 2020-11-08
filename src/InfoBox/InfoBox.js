import React, { useState } from 'react'

import { faNewspaper, faSignature, faQuestion } from '@fortawesome/free-solid-svg-icons'

import InfoBoxDetails from './InfoBoxDetails'
import InfoBoxTitle from './InfoBoxTitle'
import InfoBoxOpen from './InfoBoxOpen'
import InfoBoxClose from './InfoBoxClose'

import './InfoBox.scss'

const InfoBox = () => {
  const [open, setOpen] = useState(true)

  return (
    <div className={'InfoBox' + (open ? ' InfoBoxOpened' : ' InfoBoxClosed')}>
      <div className='InfoBoxRow'>
        <InfoBoxTitle open={open} />
        {open && <InfoBoxDetails icon={faNewspaper} title='News' paragraph='Retrieves the top 50 news published about a country in the past day.' />}
        {open && <InfoBoxDetails icon={faSignature} title='Petitions' paragraph='Curates a list of country-specific petitions from https://petition.parliament.uk.' />}
        {open && <InfoBoxDetails icon={faQuestion} title='Sentiment Analysis' paragraph='Analyses news articles and computes a measure of how bad they are in the selected country.' />}
      </div>
      <InfoBoxOpen visible={open} handleOnClick={() => setOpen(false)} />
      <InfoBoxClose visible={!open} handleOnClick={() => setOpen(true)} />
    </div>
  )
}

export default InfoBox