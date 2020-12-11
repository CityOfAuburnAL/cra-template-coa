import React, { useState, useEffect } from 'react';
import { Snackbar } from '@material-ui/core';

//ew, sorry for global var
let fnNotifier

/** System to display notifications on the app screen */
const Notifier = (props) => {
    let [ open, setOpen ] = useState(false);
    let [ message, setMessage ] = useState(props.message);
    /** Merge original props and defaults */
    let mergedProps = {
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        onClose: () => { setOpen(false); },
        ...props
    };
    delete mergedProps.open; //should not be given
    delete mergedProps.message; //can be included but will be handled seperately
    /** Sets the global variable (eck) to allow control of react component props */
    fnNotifier = ({ message }) => {
        setMessage(message || props.message);
        setOpen(true);
    }
    
    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    useEffect(() => {
        setMessage(props.message);
    }, [props.message]);

    /** Render */
    return (
        <Snackbar {...mergedProps} open={open} message={message}></Snackbar>
    )
}
/**
 * Use example: showNotifier({ message: 'This is a test' })
 *
 * @export
 * @param {*} { message }
 */
export function showNotifier({ message }) {
    fnNotifier({ message });
}

/**
 * Use example: import Notifier, { showNotifier } <Notifier/>
 */
export default Notifier;