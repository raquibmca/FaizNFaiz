import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import NewItem from '../CustomeTable/NewItem';
import { AuthContext } from './../../Context/AuthContext';
import { categorygridschema, loadItemsCategory, deleteItemCategory, loadCategoryById } from '../../api/categoryApi';
import Loader from '../Common/loader/Loader';
import CustomPanel from './../Common/Panel/CustomPanel';
import CustomModal from '../Common/model-popup/Model';

export default function CategoryResult(props) {
    const history = useHistory();
    const { state, dispatch } = useContext(AuthContext);
    const [isDelete, setIsDelete] = useState(false)
    const [selectedId, setSelectedId] = useState({})

    useEffect(async () => {
        await loadItemsCategory(dispatch);
    }, []);

    const handleRemoveItem = (id) => {
        // setSelectedId(id);
        let cat = state.category.items.find(f => f.id == id).name;
        setSelectedId({ id: id, name: cat });
        setIsDelete(true)
    }

    const handleEditItem = async (id) => {
        await loadCategoryById(id, dispatch);
        history.push(`/category/edit/${id}`)
    }

    const handlePopupCancel = () => {
        setIsDelete(false);
        setSelectedId({});
    }

    const handlePopupConfirm = () => {
        setIsDelete(false)
        deleteItemCategory(selectedId.id, dispatch)
        setSelectedId({})
    }
    return (
        <CustomPanel headingText={"Existing Category"}>
            {isDelete && <CustomModal
                title={'Are you sure?'}
                width={300}
                height={200}
                canCancel={true}
                onCancel={handlePopupCancel}
                canConfirm={true}
                onConfirm={handlePopupConfirm}
            >
                <div>Are you sure<br />
                    {`want to to delete "${selectedId.name}" category?`}<br /><br />
                    <strong></strong>
                </div>
            </CustomModal>}
            {

                state.category.isFething ? (<Loader />) : (

                    <NewItem
                        key={Math.ceil(Math.random() * Date.now())}
                        gridSchema={categorygridschema}
                        items={state?.category.items}
                        showAction={true}
                        actions={[
                            { action: 'edit', bindwith: 'id' },
                            { action: 'delete', bindwith: 'id' }
                        ]}
                        handleRemoveItem={handleRemoveItem}
                        handleEditItem={handleEditItem}
                    />
                )
            }
        </CustomPanel>
    )
}
