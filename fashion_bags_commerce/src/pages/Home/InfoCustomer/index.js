import { Fragment, useEffect, useState } from 'react';
import ProfileView from './ProfileView/ProfileView';
import MainLayout from '../MainLayout';

function CustomerProfile() {
  useEffect(() => {
    document.title = 'Thông tin cá nhân';
  });
  return (
    <MainLayout>
      <ProfileView />
    </MainLayout>
  );
}

export default CustomerProfile;
