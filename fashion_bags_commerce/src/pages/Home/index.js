import { Layout } from 'antd';
import Content from './Content';

import { Fragment, useEffect, useState } from 'react';
import MainLayout from './MainLayout';

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <Content />
    </MainLayout>
  );
}

export default Home;
