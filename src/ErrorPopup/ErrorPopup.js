import React from 'react'

import Popup from 'reactjs-popup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
 
import './ErrorPopup.scss'

const ErrorPopup = ({message, handleClose}) => {
  return (
    <Popup className='ErrorPopup' open onClose={handleClose} position='right center'>
      <h2 className='Title'>
        <FontAwesomeIcon className='ErrorIcon' icon={faExclamationTriangle} />
         Something went wrong
      </h2>
      <div className='Content'>
        <p>There was a problem performing the requested operation. The error was: </p>
        <p className='ErrorMessage'>{message}</p>
      </div>
    </Popup>
  )
}

export default ErrorPopup