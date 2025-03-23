import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ConsumerDashboard from './Dashboard';
import ProfilePage from '../profile/ProfilePage';
import NotFound from '../NotFound';
import ConsumerProductList from './ConsumerProductList';
import ConsumerShop from './ConsumerShop';
import Cart from '../Cart';
import Checkout from './Checkout';
// import Cart from './Cart';

const ConsumerRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ConsumerDashboard />} />
            <Route path="/shop" element={<ConsumerShop />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/*" element={<NotFound />} />
        </Routes>
    );
};

export default ConsumerRoutes;