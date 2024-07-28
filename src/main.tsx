// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AllWheels from './components/wheel_page/AllWheels';
import Error from './components/Error';
import WheelControl from './components/single_wheel_page/WheelControl'
import WheelComponent from './components/wheel/WheelComponent';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <AllWheels />,
      },
      {
        path: '/wheel/:id',
        element: <WheelControl />,
      },
      {
        path: '/wheelComponent/:id', 
        element: <WheelComponent />
      }
      

    ],
  },
]);



ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)


