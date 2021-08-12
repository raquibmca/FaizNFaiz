import React, { useImperativeHandle, useState, useEffect } from 'react'
import Toast from './Toast';
import './toastmessage.css';

const ToastMessage = React.forwardRef((props, ref) => {
    const [toastList, setToatsList] = useState([]);
    useImperativeHandle(ref, () => ({
        showmessage: (title, message, type, timeout, autoclose = true) => {
            let id = Math.ceil(Math.random() * Date.now());
            let to = (timeout === undefined || timeout === null)
                ?
                (props.hideTimeout === undefined || props.hideTimeout === null)
                    ? 5000
                    : props.hideTimeout
                : timeout;
            let toastItem = { title, message, type, hideTimeout: to, id: id, autoclose: autoclose };
            setToatsList((prev) => [...prev, toastItem]);
        }
    }));

    const remove = (id) => {
        let toasts = toastList.filter(f => f.id !== id);
        setToatsList(toasts);
    }

    return (
        <div className="custome-toast-container">{
            toastList.map(t => <Toast key={t.id} t={t} onClose={remove} />)
        }</div>
    )

})

export default ToastMessage;
