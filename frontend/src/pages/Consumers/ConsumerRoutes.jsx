import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ConsumerDashboard from './Dashboard';
import ConsumerShop from './ConsumerShop';

const ConsumerRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ConsumerDashboard />} />
            <Route path="/shop" element={<ConsumerShop />} />
        </Routes>
    );
};

export default ConsumerRoutes;