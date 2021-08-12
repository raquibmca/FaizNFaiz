import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import ItemRow from './ItemRow'
import { getTheadTdText } from './tableutil';
import './tablegrid.css'

const NewItem = (props) => {
    props.items?.map((c, index) => c.__i_d = index);
    const [selectedRow, setSelectedRow] = useState(null);
    let primary = props.gridSchema?.columns?.find(f => f.type === 'primary' || f.name === 'id')?.name || 'id';

    const selectedRowHandler = (id) => {
        setSelectedRow(id)
    }

    useEffect(() => {
        let value = null;
        if (props.selectedIndex) {
            value = props.items[props.selectedIndex];
            if (value) {
                value = value[primary]
                setSelectedRow(value)
            }
        }

        if (!props.selectedIndex && props.selectedRow) {
            value = props.selectedRow[primary];
            if (value) {
                setSelectedRow(value)
            }
        }

    }, [props.selectedIndex])

    const getMaxHeight = () => {
        if (props.pagging) {
            if (props.pageSize) {
                return `${57 * props.pageSize}px`
            }
            return `${57 * 10}px`
        }
        return ''
    }

    return (
        <div className={props.pagging ? "grid-table-body" : "grid-table-body"} style={{ maxHeight: getMaxHeight() }}>
            <table className={props.normalStyle ? "custome-grid__normal-table" : "custom-grid-table"}>
                <thead>
                    <tr>
                        {props.showAction && props.actions && props.actions?.length > 0 && <td>Action</td>}
                        {
                            props.gridSchema?.columns?.filter(f => f.render === undefined)
                                .map(c => getTheadTdText(c.text, c.type))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        props.items && props.items.map(item =>
                            <ItemRow
                                grid={props.gridSchema}
                                key={Math.ceil(Math.random() * Date.now())}
                                item={item}
                                updateSelectedRow={selectedRowHandler}
                                currentRow={selectedRow}
                                primary={primary}
                                {...props}
                            />
                        )
                    }
                </tbody>
            </table>
        </div >
    )
}

// export default NewItem;
export default withRouter(NewItem)
