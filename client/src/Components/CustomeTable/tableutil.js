import moment from 'moment';
import { formatter } from '../../Utils/apputils';

export const getValueByKey = (key, item) => {
    try {
        let values = Object.values(item);
        let keys = Object.keys(item);
        return values[keys.indexOf(key)];
    } catch (error) {
        return 'Error'
    }
}

export const getTdText = (key, type, item) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    let val = getValueByKey(key, item);
    switch (type) {
        case 'string':
            return <td>{val}</td>
        case 'float':
        case 'int':
            return <td style={{ textAlign: 'right', marginRight: '20px' }}>{val}</td>
        case 'money':
            return <td style={{ textAlign: 'right', marginRight: '20px' }}>{formatter.format(Math.round(val, 2))}</td>
        case 'date':
            return <td>{moment(val).format('DD/MM/YYYY')}</td>
        case 'datetime':
            return <td>{moment(val).format('DD/MM/YYYY HH:MM:SS')}</td>
        case 'image':
            return <td>{<img className="custom-grid__table-img" src={`${PF}/${val !== null ? val : 'noAvatar.png'}`} alt={"img"} />}</td>
    }
}

export const getTheadTdText = (val, type) => {
    switch (type) {
        case 'date':
        case 'datetime':
        case 'image':
        case 'string':
            return <td>{val}</td>
        case 'float':
        case 'int':
            return <td style={{ textAlign: 'right', marginRight: '20px' }}>{val}</td>
        case 'money':
            return <td style={{ textAlign: 'right', marginRight: '20px' }}>{val}</td>
    }
}