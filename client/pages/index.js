import styles from '../styles/Home.module.css';
import { useState, useContext, useEffect } from 'react';
import BoardContext from './BoardContext';
import { useRouter } from 'next/router'


export default function Home() {
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { state, setState } = useContext(BoardContext);
    let router= useRouter()

    useEffect(() => {
        if(state.token == '' && localStorage.getItem('auth'))
        {
            const auth = JSON.parse(localStorage.getItem('auth'));
            setState({token: auth.key, ...state});
            router.push(`/board/${auth.boardId}`)
            return;
        }
    }, []);

    async function submitPassword(event) {
        event.preventDefault();
        setErrorMessage("");
        const a = await fetch(`/api/password?password=${password}`);
        const b = await a.json();
        if(b.message) {
            setErrorMessage(b.message);
            return;
        }
        console.log(b);
        setState({token: b.key, ...state})
        localStorage.setItem('auth', JSON.stringify(b));
        router.push(`/board/${b.boardId}`)
    }

    return (
        <div className={styles.container}>
            <main>
                <h1 className={styles.title}>Welcome to RSBingo</h1>

                <p className={styles.description}>Enter your group password</p>

                <div className={styles.inputContainer}>
                    <form onSubmit={submitPassword}>
                        <input
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className={styles.password}
                            type="text"
                            id="password"
                            name="password"
                        />
                    </form>
                </div>
                <h3>{errorMessage}</h3>
            </main>
        </div>
    );
}
