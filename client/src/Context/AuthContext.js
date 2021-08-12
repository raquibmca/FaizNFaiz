import { createContext, useEffect, useReducer, useRef } from "react";
import { AuthReducer, Auth } from "./Reducers/AuthReducer";
import { ErrorReducer, Error } from "./Reducers/ErrorReducer";
import { AddressReducer, Address } from "./Reducers/AddressReducer";
import { CategoryReducer, Category } from "./Reducers/CategoryReducer";
import { ItemReducer, Item } from "./Reducers/ItemReducer";
import { OrderReducer, Order } from "./Reducers/OrderReducer";
import { DashboardReducer, Dashboard } from "./Reducers/DashboardReducer";
import { UserReducer, User } from "./Reducers/UserReducer";
import combineReducers from 'react-combine-reducers';
import { encrypt } from './../Utils/cipher';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [reducerCombined, initialStateCombined] =
        combineReducers({
            auth: [AuthReducer, Auth],
            error: [ErrorReducer, Error],
            address: [AddressReducer, Address],
            category: [CategoryReducer, Category],
            item: [ItemReducer, Item],
            order: [OrderReducer, Order],
            dashboard: [DashboardReducer, Dashboard],
            user: [UserReducer, User]

        })

    const [state, dispatch] = useReducerWithMiddleware(reducerCombined, initialStateCombined, [loggerBefore], [loggerAfter]);

    useEffect(() => {
        if (state.auth.token) {
            localStorage.setItem("token", state.auth.token)
            localStorage.setItem("ordercharge", encrypt(JSON.stringify(state.auth.orderCharges)))
        }
    }, [state.auth.token])

    return (
        <AuthContext.Provider
            value={{
                state, dispatch
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

const useReducerWithMiddleware = (
    reducer,
    initialState,
    middlewareFns,
    afterwareFns
) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const aRef = useRef();

    const dispatchWithMiddleware = (action) => {
        middlewareFns.forEach((middlewareFn) =>
            middlewareFn(action, state)
        );

        aRef.current = action;

        dispatch(action);
    };

    useEffect(() => {
        if (!aRef.current) return;

        afterwareFns.forEach((afterwareFn) =>
            afterwareFn(aRef.current, state)
        );

        aRef.current = null;
    }, [afterwareFns, state]);

    return [state, dispatchWithMiddleware];
};

const loggerBefore = (action, state) => {
    // console.log('logger before:', action, state);
};

const loggerAfter = (action, state) => {
    // console.log('logger after:', action, state);
    state.error.hasError = false
    state.error.errorMessage = null;
};
