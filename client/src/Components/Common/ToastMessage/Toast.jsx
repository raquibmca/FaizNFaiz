import React, { useLayoutEffect } from 'react'

export default function Toast({ t, onClose }) {
    let isHiding = false;
    useLayoutEffect(() => {
        if (t.autoclose) {

            let timer1 = setTimeout(handleRemoveToast, t.hideTimeout);

            // this will clear Timeout
            // when component unmount like in willComponentUnmount
            // and show will not change to true
            return () => {
                clearTimeout(timer1);
            };
        }
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'info':
                return <i className="las la-info-circle"></i>
            case 'warning':
                return <i className="las la-exclamation"></i>
            case 'success':
                return <i className="las la-check-circle"></i>
            case 'danger':
                return <i className="las la-times-circle"></i>
            default:
                return ''
        }
    }

    const handleRemoveToast = () => {
        onClose(t.id)
    }

    return (
        <div
            className={`custom-toast-box custom-toast-${t.type}`}
            onClick={handleRemoveToast.bind(this, t.id)}
        >
            <div className="custom-toast-content">
                <div className="toast-head">
                    {/* <div>{`${t.id} with ${t.hideTimeout / 1000}s`}</div> */}
                    <div>{t.title}</div>
                    <div>x
                        {/* <i className="las la-times-circle"></i> */}
                    </div>
                </div>
                <div className="toast-body">
                    <div className="toast-left">{getIcon(t.type)}</div>
                    <div className="toast-right">{t.message}</div>
                </div>
            </div>
        </div>
    )
}
