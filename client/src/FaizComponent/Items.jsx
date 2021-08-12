import React, { useContext, useEffect } from 'react'
import Item from './Item';
import { AuthContext } from './../Context/AuthContext';
import { loadItems, toggleSelectItem } from './../api/itemApi';

import './faizapp.css'

export default function Items() {
    const { state, dispatch } = useContext(AuthContext);

    useEffect(() => {
        loadItems(dispatch);
    }, []);


    const handleItemRequestClick = (id) => {
        toggleSelectItem(id, dispatch);
    }

    // let data = Array.from(Array(20).keys()).map(i => ({ id: i, itempic: `f_ring${i + 1}.jpg` }));
    return (
        <div className="faiz-items">
            {state.item.items?.map(item =>
                <Item key={item.id}
                    item={item}
                    handleItemRequestClick={handleItemRequestClick}
                />
            )}
        </div>
    )
}
