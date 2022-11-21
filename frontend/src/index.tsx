import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { MantineProvider } from '@mantine/core';
import reportWebVitals from './reportWebVitals';
import Index from './pages/index/Index';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <MantineProvider
      withNormalizeCSS
      withGlobalStyles
      theme={{
        colors: {
          hike: ['#e5fde4', '#bdf3be', '#95ea99', '#6ce175', '#45d853', '#2dbf3f', '#219534', '#156a27', '#094013', '#001700',]
        },
        primaryColor: 'hike'
      }}>
      <Index />
    </MantineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
