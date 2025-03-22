import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ConsumerDashboard from './Dashboard';
import ConsumerShop from './ConsumerShop';
import ProfilePage from '../profile/ProfilePage';
import NotFound from '../NotFound';

const ConsumerRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ConsumerDashboard />} />
            <Route path="/shop" element={<ConsumerShop />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/*" element={<NotFound />} />
        </Routes>
    );
};

export default ConsumerRoutes;