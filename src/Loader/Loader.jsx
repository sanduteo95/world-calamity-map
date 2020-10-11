import React from 'react'
import LoadingOverlay from 'react-loading-overlay'
import PuffLoader from 'react-spinners/BounceLoader'

const Loader = ({isActive, children}) => {
    return (
        <LoadingOverlay
            active={isActive}
            spinner
            text='Loading countries...'
            spinner={<PuffLoader />}
        >
            {children}
        </LoadingOverlay>
    )
}
export default Loader