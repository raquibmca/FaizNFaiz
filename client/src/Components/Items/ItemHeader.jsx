import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { onlyNumericField } from '../../Utils/apputils';
// import { AuthContext } from '../../Context/AuthContext';
import * as Yup from 'yup';
import NewItem from '../CustomeTable/NewItem';
import { itemgridschema, saveBulkItem } from './../../api/itemApi';
import { loadItemsCategory } from './../../api/categoryApi';
import { useContext } from 'react';
import { AuthContext } from './../../Context/AuthContext';
import Loader from '../Common/loader/Loader';
import CustomPanel from './../Common/Panel/CustomPanel';

export default function ItemHeader() {
    const [addedItems, setAddedItems] = useState([]);
    const [updateId, setUpdateId] = useState(0);
    const [isUpdateButton, setIsUpdateButton] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { state, dispatch } = useContext(AuthContext)

    useEffect(async () => {
        setIsLoading(true);
        await loadItemsCategory(dispatch);
        setIsLoading(false)
    }, []);

    const schema = Yup.object().shape({
        itemcode: Yup.string().required('Code is required'),
        itemname: Yup.string().required('Name is required'),
        rate: Yup.string().required('Rate is required')
    });

    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        setValue,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema) });

    const handleAddItem = (item) => {
        let cat = state.category.items.find(f => f.id == item.category);
        if (isUpdateButton) {
            let items = [...addedItems];
            let index = items.map(m => m.id).indexOf(updateId);
            if (index > -1) {
                items[index].category = item.category;
                items[index].categoryname = cat?.name;
                items[index].itemcode = item.itemcode;
                items[index].itemname = item.itemname;
                items[index].rate = item.rate;
                setAddedItems(items)
            }
            setUpdateId(0);
            setIsUpdateButton(false);
        }
        else {
            item.id = Date.now();
            item.category = item.category.length === 0 ? "1" : item.category;
            item.categoryname = cat?.name;
            setAddedItems((prev) => [...prev, item]);
        }
        reset({ itemname: '', itemcode: '', rate: '' });
        setFocus("itemcode");
    }

    const handleEditItem = (id) => {
        let item = addedItems.find(f => f.id === id);
        if (item) {
            setUpdateId(id)
            setValue('category', item.category);
            setValue('itemcode', item.itemcode, { shouldValidate: true });
            setValue('itemname', item.itemname, { shouldValidate: true });
            setValue('rate', item.rate, { shouldValidate: true });
            setIsUpdateButton(true);
        }
    }

    const handleRemoveItem = (id) => {
        let result = addedItems.filter(f => f.id !== id);
        setAddedItems(result);
    }

    const handleSaveItems = async () => {
        setIsLoading(true);
        const detail = addedItems.map(o => (
            {
                id: o.category,
                itemcode: o.itemcode,
                itemname: o.itemname,
                rate: o.rate
            })).map(d => Object.values(d));
        await saveBulkItem({ data: detail }, dispatch);
        setAddedItems([]);
        setIsLoading(false);
    }

    const handleCancel = () => {
        setUpdateId(0);
        setIsUpdateButton(false);
        reset({ itemname: '', itemcode: '', rate: '' });
        // setFocus("itemcode");
    }

    return (
        <CustomPanel headingText={"Add Bulk Item"}>
            {isLoading && <Loader />}
            <form onSubmit={handleSubmit(handleAddItem)}>
                <div className="item-header-context">
                    <div className="form-group">
                        <div className="form-control-label">Select category</div>
                        <div className="oh-row">
                            <select className="form-control" name="category"
                                {...register('category')}
                            >
                                <option value="1">Select...</option>
                                {state.category.items?.map(i => <option value={i.id}>{i.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-control-label">Enter item code <span className="req-field">*</span></div>
                        <div className="oh-row">
                            <input type="text" name="itemcode" palceholder="Item code" maxLength="8"
                                {...register('itemcode', { required: true, pattern: /^[A-Z0-9]+$/ })}
                                className={`form-control ${errors.itemcode ? 'is-invalid' : ''}`}
                            /><div className="invalid-feedback">{errors.itemcode?.message}</div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-control-label">Enter item name <span className="req-field">*</span></div>
                        <div className="oh-row">
                            <input type="text" palceholder="Item name" name="itemname" maxLength="15"
                                {...register('itemname', { required: true })}
                                className={`form-control ${errors.itemname ? 'is-invalid' : ''}`}
                            /><div className="invalid-feedback">{errors.itemname?.message}</div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-control-label">Enter Rate <span className="req-field">*</span></div>
                        <div className="oh-row">
                            <input type="text" palceholder="Item rate" name="rate" maxLength="5"
                                {...register('rate', { required: true })}
                                className={`form-control ${errors.rate ? 'is-invalid' : ''}`}
                                onKeyDown={onlyNumericField}
                            /><div className="invalid-feedback">{errors.rate?.message}</div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="oh-row">
                            <button className="btn btn-primary" >{isUpdateButton ? 'Update' : 'Add'}</button>
                        </div>
                        {isUpdateButton &&
                            <div className="oh-row">

                                <input type="button" className="btn btn-info" value={"Cancel"} onClick={handleCancel} />
                            </div>}
                    </div>
                </div>
            </form>
            <NewItem
                disabled={state.item.isFetching}
                gridSchema={itemgridschema}
                showAction={true}
                items={addedItems}
                handleRemoveItem={handleRemoveItem}
                handleEditItem={handleEditItem}
                actions={[
                    { action: 'edit', bindwith: 'id' },
                    { action: 'delete', bindwith: 'id' }
                ]}
            />

            {addedItems.length > 0 &&
                <div className="form-group">
                    <div className="button-panel">
                        <div>
                            <button
                                disabled={isLoading}
                                className="btn btn-primary"
                                disabled={addedItems.length === 0}
                                onClick={handleSaveItems}
                            >Save Bulk Item</button></div>
                        <div>
                            <input
                                disabled={isLoading}
                                type="button"
                                className="btn btn-info"
                                value={"Clear All"}
                                onClick={e => { setAddedItems([]) }}
                            /></div>
                    </div>
                </div>
            }
        </CustomPanel>
    )
}
