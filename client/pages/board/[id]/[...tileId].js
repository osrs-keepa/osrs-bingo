import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../../styles/Tile.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import BoardContext from '../../BoardContext';

export default function Tile() {
    const [tile, setTile] = useState(null);
    const [file, setFile] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const router = useRouter();
    const { id, tileId } = router.query;
    const { state, setState } = useContext(BoardContext);

    const handleFileInput = (e) => setSelectedFile(e.target.files[0]);

    async function uploadFile(file) {
        if(!file) {
            console.log('no file selected');
            return;
        }
        try {
            const storageLinkResponse = await fetch(`/api/files/upload?fileType=${file.type}&fileName=${file.name}`);
            const storageLink = await storageLinkResponse.json();
            await fetch(storageLink , { method:'PUT', body :file});
        } catch(err) {
            console.error('error uploading:', err);
        }
    }

    useEffect(() => {
        if(state.board && JSON.stringify(state.board) !== '{}')
        {
            setTile(state.board.tiles.find(t => t.id == tileId));
            return;
        }
        setLoading(true);
        fetch(`/api/board/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setState({token: state.token, board: data, lastFetch: Date.now()});
                setTile(data.tiles.find(t => t.id == tileId));
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
                    { tile.files ? tile.files.map((file) => (
                        <p key={tile.id} onClick={() => setFile(file)}>
                            {file.id} - {file.date}
                        </p>
                    )) : (<p>no files</p>)}
                    <input type="file" onChange={handleFileInput}/>
                    <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>
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

export async function getServerSideProps(context) {
    // res.setHeader(
    //     'Cache-Control',
    //     'public, s-maxage=10, stale-while-revalidate=59'
    // )

    return {
        props: {},
    };
}