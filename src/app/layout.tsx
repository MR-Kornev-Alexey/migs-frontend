'use client';

import * as React from 'react';
import '@/styles/global.css';
import {Provider} from 'react-redux';
import {store} from '@/store/store';
import CustomProvider from "@/app/custom-provider";


interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <html lang="en">
    <body>
    <Provider store={store}>
      <CustomProvider> {/* Открыл компонент */}
        {children}
      </CustomProvider> {/* Закрыл компонент */}
    </Provider>
    </body>
    </html>
  );
};

export default Layout;
