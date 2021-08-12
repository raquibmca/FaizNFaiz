import * as ROLE from '../Constant/Role';

export const JSONObject = (data) => {
    var text = JSON.stringify(data, function (AppKey, AppValue) {
        if (AppValue.length === 0 || AppValue === undefined) {
            return null;
        } else {
            return AppValue;
        }
    }, 0);
    return JSON.parse(text);
}

export const onlyNumericField = event => {
    // console.log(event.keyCode)
    let isPrevent = true;
    isPrevent = ([8, 9, 13, 37, 39, 46, 110, 190].indexOf(event.keyCode) < 0);
    isPrevent = isPrevent && (event.keyCode < 96 || event.keyCode > 105);
    isPrevent = isPrevent && (event.keyCode < 48 || event.keyCode > 57)
    if (isPrevent) event.preventDefault();
};

export const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
});

export const getRole = (id) => {
    switch (id) {
        case ROLE.ROLE_ADMIN: return 'Admin';
        case ROLE.ROLE_USER: return 'User';
        case ROLE.ROLE_VENDOR: return 'Vendor';
        default: return ''
    }
}

export const generateOrderCharges = (charges, amount) => {
    let newdata = [];
    try {
        if (!charges) return { array: null, netamount: amount }

        let discount = charges.filter(f => f.Multiplier < 0);
        let addcharges = charges.filter(f => f.Multiplier > 0);
        let result = fillServiceChatgesArray(newdata, discount, amount);
        let result1 = fillServiceChatgesArray(result.array, addcharges, result.netamount);
        return result1;
    } catch (error) {
        console.log(error)
    }
}

const fillServiceChatgesArray = (array, inputArray, amount) => {
    let calacval = 0;
    inputArray.forEach(c => {
        switch (c.Operator) {
            case 'MUL':
                c.CalcValue = (c.AppValue * c.Multiplier) * amount
                break
            case 'ADD':
                c.CalcValue = (c.AppValue * c.Multiplier) * (amount == 0 ? 0 : 1)
                break;
            default:
                break;
        }
        calacval += c.CalcValue;
        array.push({
            Amount: amount,
            CalcValue: c.CalcValue,
            AppKey: c.AppKey,
            DisplayName: c.DisplayName,
            AppValue: c.AppValue,
            DataType: c.DataType,
            Multiplier: c.Multiplier,
            Operator: c.Operator
        })
    });

    return { array: array, netamount: amount += calacval }
}