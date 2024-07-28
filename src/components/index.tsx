// index.tsx
// import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App'; // Main App component
import WheelComponent from './wheel/WheelComponent';
import './index.css'; // Main CSS file

const rootElement = document.getElementById('root');

if (rootElement) {
    // Check if the window contains wheel data
    const wheelData = (window as any).wheelData;
    if (wheelData) {
        ReactDOM.render(
            <WheelComponent title={wheelData.title} items={wheelData.items} />,
            rootElement
        );
    } else {
        ReactDOM.render(<App />, rootElement);
    }
}
