// import { useState } from 'react'
// import Wheel from "./components/wheel/WheelComponent"
// import WheelForm from './components/wheel_page/WheelForm'
// import BackendTest from "./components/BackendTest"
// import './App.css'
// import AllWheels from "./components/wheel_page/AllWheels"
import { Outlet } from 'react-router-dom';
import { WheelProvider } from "./components/context/WheelContext"
// import Test from './components/Test'

import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
function App() {


  return (
    <>
    <WheelProvider>
    <MantineProvider>
      {/* <Wheel /> */}
    <Outlet />
    </MantineProvider>
    </WheelProvider>
     </>
  )
}

export default App
