import { useState, useEffect } from 'react';
import styles from '../../../styles/Board.module.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { motion, m } from 'framer-motion';
import { useRouter } from 'next/router';

export default function Board() {
    const [board, setBoard] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        setLoading(true);
        fetch('/api/board')
            .then((res) => res.json())
            .then((data) => {
                setBoard(data);
                setLoading(false);
            });
    }, []);

    function getTileBackground(pct) {
        // where pct is completion %
        return `linear-gradient(#000, #000 ${(1 - pct) * 100}%, #FFF ${
            (1 - pct) * 100
        }% )`;
    }

    if (isLoading)
        return (
            <main className={styles.main}>
                <FontAwesomeIcon
                    className={styles.icon}
                    icon={faSpinner}
                    spin
                />
            </main>
        );
    if (!board) return <main className={styles.main}>Board not found</main>;

    return (
        <main className={styles.main}>
            <h1 className={styles.title}>{board.name}</h1>
            <div className={styles[`board${board.size}`]}>
                {board.tiles.map((tile) => (
                    <Link
                        key={tile.id}
                        href={`/board/${encodeURIComponent(id)}/${tile.id}`}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.25 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.74 }}
                            className={styles.box}
                            layoutId={tile.id}
                            style={{
                                background: getTileBackground(tile.completion)
                            }}
                        >
                            <FontAwesomeIcon
                                className={styles.icon}
                                icon={faWrench}
                            />
                        </motion.div>
                    </Link>
                ))}
            </div>
        </main>
    );
}
