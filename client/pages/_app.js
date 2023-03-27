import '../styles/global.css';
import { useState } from "react";
import BoardContext from '../components/_boardContext';

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
    return (
        <AppProvider>
            <Component {...pageProps} />
        </AppProvider>
    );
}