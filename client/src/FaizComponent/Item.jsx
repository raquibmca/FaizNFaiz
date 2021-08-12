import React from 'react';
import { useContext } from 'react';
import { AuthContext } from './../Context/AuthContext';

export default function Item(props) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const PFI = process.env.REACT_APP_PUBLIC_FOLDER_ITEM
    const { state } = useContext(AuthContext);

    const isSelected = () => {
        return state.item.selected?.indexOf(props.item.id) > -1;
        // return true
    }

    return (
        <div className="faiz-item">
            <div className="faiz-item-body">
                <div className="faiz-item-img-container">
                    <img className="faiz-item-img" src={props.item.itempic !== null ? `${PFI}/${props.item.itempic}` : `${PF}/noAvatar.png`} />
                </div>
            </div>
            <div className="faiz-item-body-name">
                <div className="">{props.item.name}</div>
            </div>
            <div className="faiz-item-request">
                <button className={`btn ${isSelected() ? "btn-warning" : "btn-success"}`} onClick={props.handleItemRequestClick.bind(this, props.item.id)}>
                    {!isSelected() ? `Add To Request` : `Remove From Request`}
                </button>
            </div>
            {isSelected() &&
                <div className="faiz-item-selected">
                    <i className="las la-check-circle"></i>
                </div>
            }
        </div>
    )
}
