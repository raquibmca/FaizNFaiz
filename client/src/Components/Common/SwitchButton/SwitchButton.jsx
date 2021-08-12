import React, { useState, useImperativeHandle } from 'react'
import './switchbutton.css'
import { useEffect } from 'react';

const SwitchButton = React.forwardRef((props, ref) => {
    const [value, setValue] = useState(false);
    useImperativeHandle(ref, () => ({
        getValue: () => {
            return value;
        }
    }));

    useEffect(() => {
        setValue(props.checked);
    }, [props.checked]);

    const handleClick = () => {
        if (!props.disabled) {
            setValue(!value)
        }
    }
    const getClass = () => {
        return props.disabled
            ?
            value
                ?
                "switch-button on disabled"
                :
                "switch-button off disabled"
            :
            value
                ?
                "switch-button on"
                :
                "switch-button off"
    }

    return (
        <div className={getClass()} onClick={handleClick}>
            <div className="switch-inner" ></div>
        </div>
    )
});

export default SwitchButton;
