import React from 'react'
import { Route } from 'react-router-dom';
import Content from '../../FaizComponent/Content'
import Footer from '../../FaizComponent/Footer'
import Header from '../../FaizComponent/Header'
import Contactus from '../../FaizComponent/Contactus';

export default function LandingPage(props) {
    return (
        <div className="faiz-main">
            <Header />
            <Route exact path="/">
                <Content />
            </Route>
            <Route path="/contactus">
                <Contactus />
            </Route>
            {/* <Footer /> */}
        </div>
    )
}
