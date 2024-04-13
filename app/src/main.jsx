import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { userRoutes } from './routes';
import { store, persistor } from './redux/store';
import './global.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { ConfigProvider, theme } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const router = createBrowserRouter(userRoutes);
const { darkAlgorithm } = theme;

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ConfigProvider theme={{ algorithm: darkAlgorithm, token: { colorLink: '#fff' } }}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ConfigProvider>
    </PersistGate>
  </Provider>
);
