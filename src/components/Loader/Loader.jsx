import React from 'react'
import LoadingOverlay from 'react-loading-overlay'
import PuffLoader from 'react-spinners/BounceLoader'

const Loader = ({isActive, text, children}) => {
    return (
        <LoadingOverlay
            active={isActive}
            text={text}
            spinner={<PuffLoader />}
        >
            {children}
        </LoadingOverlay>
    )
}
export default Loader