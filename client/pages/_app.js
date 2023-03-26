import '../styles/global.css';
import { useState } from "react";
import BoardContext from './BoardContext';

const AppProvider = ({ children }) => {
    const initialState = {
      token: '',
      board: {},
      lastFetch: null
    }
    const [state, setState] = useState(initialState);
    return (
    <BoardContext.Provider value={{ state, setState }}>
        {children}
    </BoardContext.Provider>
    );
};

export default function App({ Component, pageProps }) {
    return (<AppProvider><Component {...pageProps} /></AppProvider>);
}