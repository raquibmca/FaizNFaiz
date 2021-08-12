import React from 'react';
import './loader.css';

function Loader(props) {
    let text = props.text ? props.text : 'Loading...'
    return (
        <div className="loader">
            <div className="balls">
                <div className="ball ball1"></div>
                <div className="ball ball2"></div>
                <div className="ball ball3"></div>
            </div>
            <div className="loadtext">{text}</div>
        </div>
    );
}

export default Loader;