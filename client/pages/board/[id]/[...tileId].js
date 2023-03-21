import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../../styles/Tile.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

export default function Tile() {
    const [tile, setTile] = useState(null);
    const [file, setFile] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        setLoading(true);
        fetch('/api/tile')
            .then((res) => res.json())
            .then((data) => {
                setTile(data);
                setLoading(false);
            });
    }, []);

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
    if (!tile) return <main className={styles.main}>Tile not found</main>;

    return (
        <main className={styles.main}>
            <div className={styles.header}>
                <Link href={`/board/${encodeURIComponent(id)}`}>
                    <FontAwesomeIcon
                        className={styles.icon}
                        icon={faArrowLeft}
                    />
                </Link>
            </div>
            <h1 className={styles.title}>{tile.name}</h1>
            <p className={styles.description}>{tile.description}</p>
            <div className={styles.container}>
                <div className={styles.files}>
                    {tile.files.map((file) => (
                        <p key={tile.id} onClick={() => setFile(file)}>
                            {file.id} - {file.date}
                        </p>
                    ))}
                </div>
                <div className={styles.box}>
                    {file ? (
                        <Image
                            src={file.name}
                            width={file.width}
                            height={file.height}
                            alt=""
                        />
                    ) : (
                        <p>Select a file</p>
                    )}
                </div>
            </div>
        </main>
    );
}
