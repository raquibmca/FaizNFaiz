import React from 'react'
import { withRouter } from 'react-router-dom';
import { getTdText, getValueByKey } from './tableutil';

const ItemRow = (props) => {
    let id = getValueByKey(props.primary, props.item);

    const getActiveClass = () => {
        return id && props.currentRow && id == props.currentRow ? 'active' : '';
    }

    return (
        <tr
            onClick={() => {
                if (props.onRowClick) props.onRowClick(id);
                if (props.updateSelectedRow) props.updateSelectedRow(id);
            }}
            className={getActiveClass()}
        >
            {props.showAction && props.actions && props.actions.length > 0 &&
                <td style={{ overflow: 'unset', paddingLeft: 0 }}>
                    <div className="custome-grid__order-action">
                        <div className="custome-grid__orderdelete">
                            {
                                props.actions?.map(a => {
                                    return (a.action === 'delete' &&
                                        <button
                                            key={+ new Date()}
                                            disabled={props.disabled}
                                            className="btn btn-danger"
                                            onClick={props.handleRemoveItem?.bind(this, getValueByKey(a.bindwith, props.item))}
                                        >
                                            X
                                        </button>
                                    )
                                })
                            }
                            {
                                props.actions?.map(a => {
                                    return (a.action === 'edit' &&
                                        <button
                                            key={+ new Date()}
                                            disabled={props.disabled}
                                            className="btn btn-info"
                                            onClick={props.handleEditItem?.bind(this, getValueByKey(a.bindwith, props.item))}
                                        >
                                            <i className="las la-pen-fancy"></i>
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>
                </td>
            }
            {
                props.gridSchema?.columns
                    .filter(f => f.render === undefined)
                    .map(c => { return getTdText(c.name, c.type, props.item) })
            }
        </tr>
    )
}

// export default ItemRow;
export default withRouter(ItemRow)
