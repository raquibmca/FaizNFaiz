import React, { useEffect, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import { itemgridschema, loadItems, loadItemsById } from '../../api/itemApi';
import NewItem from '../CustomeTable/NewItem';
import { AuthContext } from './../../Context/AuthContext';
import { deleteItem } from './../../api/itemApi';
import Loader from '../Common/loader/Loader';
import CustomModal from './../Common/model-popup/Model';

export default function ItemResult(props) {
    const history = useHistory();
    const { state, dispatch } = useContext(AuthContext)
    const [isDelete, setIsDelete] = useState(false)
    const [selectedId, setSelectedId] = useState({})
    useEffect(() => {
        loadItems(dispatch);
    }, []);

    const handleRemoveItem = (id) => {
        let name = state.item.items.find(f => f.id == id).itemname;
        setSelectedId({ id: id, name: name });
        setIsDelete(true)
    }

    const handleEditItem = async (id) => {
        await loadItemsById(id, dispatch);
        history.push(`/manageitems/edit/${id}`)
    }

    const handlePopupCancel = () => {
        setIsDelete(false);
        setSelectedId({});
    }

    const handlePopupConfirm = () => {
        setIsDelete(false)
        deleteItem(selectedId, dispatch);
        setSelectedId({})
    }
    return (
        // <CustomPanel headingText={'Existing Items'} >
        <>
            {isDelete && <CustomModal
                title={`Delete Item (${selectedId.name})`}
                width={300}
                height={200}
                canCancel={true}
                onCancel={handlePopupCancel}
                canConfirm={true}
                onConfirm={handlePopupConfirm}
            >
                <div>Are you sure<br />
                    {`want to to delete "${selectedId.name}" Item?`}<br /><br />
                    <strong></strong>
                </div>
            </CustomModal>}
            {state.item.isFetching && <Loader />}
            <NewItem
                gridSchema={itemgridschema}
                showAction={true}
                items={state.item?.items}
                handleRemoveItem={handleRemoveItem}
                handleEditItem={handleEditItem}
                actions={[
                    { action: 'edit', bindwith: 'id' },
                    { action: 'delete', bindwith: 'id' }
                ]}
            />
        </>
        // </CustomPanel>
    )
}
