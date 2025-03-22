import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '../../components/Navbar';
import ProfileForm from '../../components/ProfileForm';
import { useSelector } from 'react-redux';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.user);
  const role = user?.role || 'guest';

  const getProfileTitle = () => {
    switch (role) {
      case 'admin':
        return 'Admin Profile';
      case 'farmer':
        return 'Farmer Profile';
      case 'consumer':
        return 'Consumer Profile';
      default:
        return 'User Profile';
    }
  };

  return (
    <>
      <Helmet>
        <title>{getProfileTitle()} | KrushiSetu</title>
      </Helmet>
      <div className="min-h-screen bg-[#1a332e]">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            {getProfileTitle()}
          </h1>
          <ProfileForm />
        </div>
      </div>
    </>
  );
};

export default ProfilePage; 