import React, { useContext, useRef, useEffect } from 'react';
import { Route } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import NewOrder from '../Order/NewOrder';
import Addresses from '../Address/Addresses';
import ChangePassword from '../Profiles/ChangePassword';
import Profile from '../Profiles/Profile';
import OrderStatus from '../Order/OrderStatus';
// import OrderHistory from '../Order/OrderHistory';
import AddAddress from '../Address/AddAddress';
import ManageItem from '../Items/ManageItem';
import ManageCategory from '../Category/ManageCategory';
import ItemSearchPanel from '../Items/ItemSearchPanel';
import EditCategory from '../Category/EditCategory';
import ConfirmOrder from '../Order/ChildComponent/ConfirmOrder';
import EditItem from '../Items/EditItem';
import ToastMessage from '../Common/ToastMessage/ToastMessage';
import UserDashboard from './User/UserDashboard';
import AdminDashboard from './Admin/AdminDashboard';
import { AuthContext } from '../../Context/AuthContext';
import { ROLE_ADMIN, ROLE_USER } from '../../Constant/Role';
import './laundryapp.css';
import ManageUser from './../Users/ManageUser';
import UpdateOrder from '../Order/UpdateOrdery';
import OrderTransient from './../Order/OrderTransient';

export default function LaundryApp(props) {
    const { state } = useContext(AuthContext)
    let toast = useRef();

    useEffect(() => {
        if (state.error.hasError && state.error.errorMessage?.length > 0)
            toast.current.showmessage('Alert', state.error.errorMessage, 'danger', 3000);
        if (state.error.isSuccess && state.error.successMessage?.length > 0)
            toast.current.showmessage('Success', state.error.successMessage, 'success', 3000);
        if (state.error.isWarning && state.error.warningMessage?.length > 0)
            toast.current.showmessage('Warning', state.error.warningMessage, 'warning', 3000);
        if (state.error.isInfo && state.error.infoMessage?.length > 0)
            toast.current.showmessage('Information', state.error.infoMessage, 'info', 3000);

    }, [state.error.hasError, state.error.isSuccess, state.error.isWarning, state.error.isInfo]);
    // toast.current.showmessage('Alert', state.error.errorMessage, 'danger', 3000);
    return (
        <React.Fragment>
            <Header />
            <Sidebar />
            <div className="main-content">
                <ToastMessage
                    ref={toast}
                    hideTimeout={5000}
                >
                </ToastMessage>
                <Route exact path={["/", "/dashboard"]}>
                    {
                        state.auth.user.role === ROLE_USER &&
                        <UserDashboard />
                    }
                    {
                        state.auth.user.role === ROLE_ADMIN &&
                        <AdminDashboard />
                    }
                </Route>
                <Route path="/order/neworder">
                    <NewOrder />
                </Route>
                <Route exact path="/order/confirm/:expiretime/co">
                    <ConfirmOrder />
                </Route>
                {/* <Route path="/order/orderstatus">
                    <OrderStatus orderStatus={4} />
                </Route> */}
                <Route path="/order/orderhistory">
                    <OrderStatus />
                </Route>
                <Route path="/user/profile" >
                    <Profile />
                </Route>
                <Route exact path={["/address/list", "/address"]}>
                    <Addresses />
                </Route>
                <Route path="/user/changepassword"  >
                    <ChangePassword />
                </Route>
                <Route path="/address/addnew">
                    <AddAddress />
                </Route>
                <Route path="/address/update/:id">
                    <AddAddress />
                </Route>
                {
                    state.auth.user.role === ROLE_ADMIN &&
                    <>
                        <Route exact path="/manageitems"  >
                            <ManageItem />
                        </Route>
                        <Route path="/manageitems/seacrh">
                            <ItemSearchPanel />
                        </Route>
                        <Route path="/managecategory"  >
                            <ManageCategory />
                        </Route>
                        <Route path="/manageitems/edit/:id">
                            <EditItem />
                        </Route>
                        <Route path="/category/edit/:id">
                            <EditCategory />
                        </Route>
                        <Route path="/user/manage">
                            <ManageUser />
                        </Route>
                        <Route path="/order/status">
                            <UpdateOrder />
                        </Route>
                        <Route path="/order/track">
                            <OrderTransient />
                        </Route>
                    </>
                }
            </div>
        </React.Fragment>
    )
}
