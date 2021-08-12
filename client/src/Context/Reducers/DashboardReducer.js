import * as _ from 'lodash';
import { decrypt } from '../../Utils/cipher';

const Dashboard = {
    admin: {
        userCount: 0,
        OrderCount: 0,
        NetAmount: 0,
        ServiceCharge: 0,
        ReferalDiscount: 0,
        DeliveryCharges: 0,
        ReferalCount: 0,
        ReferalUserCount: 0,
        topItems: [],
        orders: [],
        primeCustomer: [],
        topReferals: []
    },
    user: {
        completeOrderCount: 0,
        inprocessOrderCount: 0,
        userRefCount: 0,
        currentBill: 0,
    },
    isFetching: false,
}

const DashboardReducer = (state, action) => {
    let result = null;
    switch (action.type) {
        case "DASHBOARD_LOADING":
            return {
                ...state,
                isFetching: true,
            };
        case "ADMIN_DASHBOARD_DATA":
            let adminRes = JSON.parse(decrypt(action.payload.result));
            state.admin.OrderCount = adminRes.order.reduce((a, b) => ({ OrderCount: a.OrderCount + b.OrderCount })).OrderCount;
            state.admin.NetAmount = adminRes.order.reduce((a, b) => ({ NetAmount: a.NetAmount + b.NetAmount })).NetAmount;
            state.admin.ServiceCharge = adminRes.order.reduce((a, b) => ({ ServiceCharge: a.ServiceCharge + b.ServiceCharge })).ServiceCharge;
            state.admin.ReferalDiscount = adminRes.order.reduce((a, b) => ({ RefDiscount: a.RefDiscount + b.RefDiscount })).RefDiscount;
            state.admin.DeliveryCharges = adminRes.order.reduce((a, b) => ({ DeliveryCharge: a.DeliveryCharge + b.DeliveryCharge })).DeliveryCharge;
            state.admin.ReferalCount = adminRes.order.reduce((a, b) => ({ ReferalCount: a.ReferalCount + b.ReferalCount })).ReferalCount;
            let topItems = groupResult(adminRes.hotItem, 'ItemId', ['ItemName', 'Count', 'Amount', 'TotalQty', 'Amount']);
            let primecustomer = groupResult(adminRes.hotItem, 'UserId', ['UserName', 'ProfilePicture', 'Count', 'Amount', 'TotalQty', 'Amount']);
            state.admin.topItems = topItems;
            state.admin.primeCustomer = primecustomer;
            return {
                ...state,
                admin: {
                    ...state.admin,
                    ReferalUserCount: adminRes.refUserCount
                }
            };
        case "USER_DASHBOARD_DATA":
            let userRes = JSON.parse(decrypt(action.payload.result));
            let userCompleteOrder = userRes.order.find(f => f.StatusId === 21);
            let userBookedOrder = userRes.order.find(f => f.StatusId === 4);
            return {
                ...state,
                user: {
                    completeOrderCount: userCompleteOrder ? userCompleteOrder?.OrderCount : 0,
                    inprocessOrderCount: userBookedOrder ? userBookedOrder.OrderCount : 0,
                    currentBill: userBookedOrder ? userBookedOrder.NetAmount : 0,
                    userRefCount: userRes.refCount
                }
            };
        case "DASHBOARD_FAILURE":
            return {
                ...state,
                isFetching: false,
            };
        default:
            return state;
    }
};

const groupResult = (data, field, calcField) => {
    let tempobj = {};
    let array = [];
    var output = _(data).groupBy(field).value();
    let keys = Object.keys(output);
    for (let i = 0; i < keys.length; i++) {
        tempobj = Object.assign({}, tempobj)
        tempobj[field] = keys[i];
        for (let j = 0; j < calcField.length; j++) {
            let type = typeof output[keys[i]][0][calcField[j]];
            if (type === 'string')
                tempobj[calcField[j]] = output[keys[i]][0][calcField[j]];
            if (type === 'number')
                tempobj[calcField[j]] = _.sumBy(output[keys[i]], calcField[j]);
        }
        array.push(tempobj)
    }
    return array;
    // var output =
    //     _(data)
    //         .groupBy(field)
    //         .map((objs, key) => ({
    //             [field]: key,
    //             [calcField[0]]: _.sumBy(objs, calcField[0]),
    //             [calcField[1]]: _.sumBy(objs, calcField[1]),
    //             [calcField[2]]: _.sumBy(objs, calcField[2]),
    //         }))
    //         .value();
}

export {
    Dashboard,
    DashboardReducer
}
