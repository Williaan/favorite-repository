import React from 'react';
import { ToastContainer } from 'react-toastify';

import Routes from './routes';
import GlobalStyle from './styles/globals';

function App() {
    return (
        <>
            <ToastContainer />
            <GlobalStyle />
            <Routes />
        </>
    );
}

export default App;
