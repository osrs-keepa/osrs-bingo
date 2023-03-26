import { useState, useEffect, useContext } from 'react';
import styles from '../../../styles/Board.module.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Image from 'next/image';
import BoardContext from '../../BoardContext';

export default function Board() {
    const [board, setBoard] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();
    const { id } = router.query;
    const { state, setState } = useContext(BoardContext);

    useEffect(() => {
        if(state.board && JSON.stringify(state.board) !== '{}')
        {
            setBoard(state.board);
            return;
        }
        setLoading(true);
        fetch(`/api/board/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setBoard(data);
                setState({ token: state.token, board: data, lastFetch: Date.now() })
                setLoading(false);
            });
    }, []);

    function getTileBackground(pct) {
        // where pct is completion %
        // TODO: make a progress bar on the side of the tile
        return `linear-gradient(#000 ${(1 - pct) * 100}%, #fff)`;
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
                        href={`/board/${encodeURIComponent(id)}/${encodeURIComponent(tile.id)}`}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.25 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.74 }}
                            className={styles.box}
                            layoutId={tile.id}
                            style={{
                                backgroundColor: "black"
                            }}
                        >
                            <div className={styles.tile}>
                                <p className={styles.tileTitle}>{tile.name}</p>
                                {/* TODO: add custom icons with good sizing */}
                                <Image
                                    src={`/${tile.icon}.png`}
                                    width="60"
                                    height="80"
                                    alt=""
                                    className={styles.icon}
                                />
                            </div>
                            
                        </motion.div>
                    </Link>
                ))}
            </div>
        </main>
    );
}

export async function getServerSideProps(context) {
    // res.setHeader(
    //     'Cache-Control',
    //     'public, s-maxage=10, stale-while-revalidate=59'
    // )

    return {
        props: {},
    };
}