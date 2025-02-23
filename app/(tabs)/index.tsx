import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../hooks/store';
import RootLayout from '../_layout';

export default function App() {
  return (
    <Provider store={store}>
      <RootLayout />
    </Provider>
  );
}
