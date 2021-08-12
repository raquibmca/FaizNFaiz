import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import NewItem from '../CustomeTable/NewItem';
import { categorygridschema, saveBulkCategory } from './../../api/categoryApi';
import { AuthContext } from './../../Context/AuthContext';
import { useContext } from 'react';
import Loader from '../Common/loader/Loader';
import CustomPanel from './../Common/Panel/CustomPanel';

export default function CategoryHeader() {
    const { state, dispatch } = useContext(AuthContext);
    const [addedItems, setAddedItems] = useState([]);
    const [isUpdateButton, setIsUpdateButton] = useState(false);
    const [updateId, setUpdateId] = useState(0);

    const schema = Yup.object().shape({
        code: Yup.string().required('Code is required'),
        name: Yup.string().required('Name is required'),
    });
    const toast = useRef();
    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        setValue,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema) });

    const handleEditItem = (id) => {
        let item = addedItems.find(f => f.id === id);
        if (item) {
            setUpdateId(id)
            setValue('code', item.code, { shouldValidate: true });
            setValue('name', item.name, { shouldValidate: true });
            setIsUpdateButton(true);
        }
    }

    const handleRemoveItem = (id) => {
        let result = addedItems.filter(f => f.id !== id);
        setAddedItems(result);
    }

    const handleSaveItems = async () => {
        const detail = addedItems.map(o => (
            {
                code: o.code,
                name: o.name
            })).map(d => Object.values(d));
        await saveBulkCategory({ data: detail }, dispatch)
        setAddedItems([])
        setFocus("code");

    }

    const handleAddItem = (item) => {
        if (isUpdateButton) {
            let items = [...addedItems];
            let index = items.map(m => m.id).indexOf(updateId);
            if (index > -1) {
                items[index].code = item.code;
                items[index].name = item.name;
                setAddedItems(items)
            }
            setUpdateId(0);
            setIsUpdateButton(false);

        }
        else {
            item.id = Date.now();
            setAddedItems((prev) => [...prev, item]);
        }

        reset({ name: '', code: '' });
        setFocus("code");
    }

    const handleCancel = () => {
        setUpdateId(0);
        setIsUpdateButton(false);
        reset({ name: '', code: '' });
    }

    return (
        <CustomPanel headingText={"Add New Category"}>
            {
                state.category.isFethcing && <Loader />
            }
            <form onSubmit={handleSubmit(handleAddItem)}>
                <div className="item-header-context">
                    <div className="form-group">
                        <div className="form-control-label">Category code <span className="req-field">*</span></div>
                        <div className="oh-row">
                            <input type="text" name="code" palceholder="Item code" maxLength="10"
                                {...register('code', { required: true, pattern: /^[A-Z0-9]+$/ })}
                                className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                            /><div className="invalid-feedback">{errors.code?.message}</div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-control-label">Category name <span className="req-field">*</span></div>
                        <div className="oh-row">
                            <input type="text" palceholder="Item name" name="name" maxLength="15"
                                {...register('name', { required: true })}
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            /><div className="invalid-feedback">{errors.name?.message}</div>
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
                gridSchema={categorygridschema}
                items={addedItems}
                showAction={true}
                actions={[
                    { action: 'edit', bindwith: 'id' },
                    { action: 'delete', bindwith: 'id' }
                ]}
                handleEditItem={handleEditItem}
                handleRemoveItem={handleRemoveItem}
            />

            {addedItems.length > 0 &&
                <div className="form-group">
                    <div className="button-panel">
                        <div>
                            <button
                                className="btn btn-primary"
                                disabled={addedItems.length === 0}
                                onClick={handleSaveItems}
                            >Save Bulk Category</button></div>
                        <div>
                            <input
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
