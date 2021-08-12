import React from 'react';

import './Model.css';

const CustomModal = props => (
    <React.Fragment>
        {/* <Backdrop /> */}
        <div className="backdrop">
            <div className="custom-popup-modal"
                style={{
                    width: `${props.width}px`,
                    height: `${props.height}px`,
                    // top: `calc(50% - ${props.width / 2}px)`,
                    // left: `calc(100% - 175px)`
                }}
            >
                <div className="custom-popup-header">
                    {props.title}
                </div>
                <section className="custom-popup-content">{props.children}</section>
                {
                    (props.canCancel || props.canConfirm) &&
                    <section className="custom-popup-content-actions">
                        {props.canConfirm && (
                            <div className="cpca-item">
                                <button className="btn btn-primary" onClick={props.onConfirm}>
                                    {props.confirmText || 'Okey'}
                                </button>
                            </div>
                        )}
                        {props.canCancel && (
                            <div className="cpca-item">
                                <button className="btn btn-danger" onClick={props.onCancel}>
                                    {props.cancelText || 'Nope'}
                                </button>
                            </div>
                        )}
                    </section>
                }
            </div>
        </div>
    </React.Fragment>
);

export default CustomModal;
