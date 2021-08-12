import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { onlyNumericField } from '../../Utils/apputils'
import CustomPanel from '../Common/Panel/CustomPanel';
import { searchItems } from './../../api/itemApi';
import { AuthContext } from './../../Context/AuthContext';
import ItemResult from './ItemResult';
import { loadItemsCategory } from './../../api/categoryApi';

export default function ItemSearchPanel() {
    const { state, dispatch } = useContext(AuthContext)
    // const history = useHistory()
    useEffect(async () => {
        await loadItemsCategory(dispatch);
    }, []);

    const {
        register,
        handleSubmit,
    } = useForm();

    const handleSearchItem = (data) => {
        searchItems(data, dispatch)
    }

    return (
        <CustomPanel headingText="Item Search">
            <div className="item-search">
                <div className="item-search-left">
                    <CustomPanel headingText="Item Search" isSubHeading={true}>
                        <form onSubmit={handleSubmit(handleSearchItem)}>
                            <div>
                                <div className="form-group">
                                    <div className="form-control-label">Select category</div>
                                    {/* <div className="oh-row"> */}
                                    <select className="form-control" name="category"
                                        defaultValue={state.item.searchfilter?.category}
                                        {...register('category')}
                                    >
                                        <option value="">Select...</option>
                                        {state.category.items?.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                    </select>
                                    {/* </div> */}
                                </div>
                                <div className="form-group">
                                    <div className="form-control-label">Enter item code</div>
                                    {/* <div className="oh-row"> */}
                                    <input type="text" name="itemcode" palceholder="Item code" maxLength="8"
                                        defaultValue={state.item.searchfilter?.itemcode}
                                        className="form-control"
                                        {...register('itemcode')}
                                    />
                                    {/* <div className="invalid-feedback">{errors.itemcode?.message}</div> */}
                                    {/* </div> */}
                                </div>
                                <div className="form-group">
                                    <div className="form-control-label">Enter item name</div>
                                    {/* <div className="oh-row"> */}
                                    <input type="text" palceholder="Item name" name="itemname" maxLength="15"
                                        defaultValue={state.item.searchfilter?.itemname}
                                        className="form-control"
                                        {...register('itemname')}
                                    />
                                    {/* <div className="invalid-feedback">{errors.itemname?.message}</div> */}
                                    {/* </div> */}
                                </div>
                                <div className="form-group">
                                    <div className="form-control-label">Enter Rate</div>
                                    <div className="item-rate-filter">
                                        <div >
                                            <select className="form-control" name="ratefilter"
                                                defaultValue={state.item.searchfilter?.ratefilter}
                                                {...register('ratefilter')}
                                            >
                                                <option value="=">{`Equal (=)`}</option>
                                                <option value="<=">{`Less Than Equal (<=)`}</option>
                                                <option value="<">{`Less Than (<)`}</option>
                                                <option value=">=">{`Greater Tthan Equal (>=)`}</option>
                                                <option value=">">{`Greater Than (>)`}</option>
                                                <option value="!=">{`Not Equal (NOT)`}</option>
                                            </select>
                                        </div>
                                        <input type="text" palceholder="Item rate" name="itemrate" maxLength="4"
                                            defaultValue={state.item.searchfilter?.itemrate}
                                            className="form-control"
                                            {...register('itemrate')}
                                            onKeyDown={onlyNumericField}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    {/* <div className="oh-row"> */}
                                    <button className="btn btn-primary" >Search</button>
                                    {/* </div> */}
                                </div>
                            </div>
                        </form>
                    </CustomPanel>
                </div>
                <div className="item-search-right">
                    <CustomPanel headingText={`Search Result: (${state.item.count}) `} isSubHeading={true}>
                        <ItemResult />
                    </CustomPanel>
                </div>
            </div>
        </CustomPanel>
    )
}
