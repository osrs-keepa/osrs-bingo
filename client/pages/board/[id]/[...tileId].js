import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../../styles/Tile.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSpinner, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import BoardContext from '../../../components/_boardContext';

function FileList({ files, setFile }) {
    return (files ? files.map((file) => (
        <p key={file.Key} onClick={() => setFile(file)}>
            {`${file.Key.split('/')[2]} ${file.LastModified}`}
        </p>
    )) : (<p>No files uploaded yet</p>))
}

function XpTracker() {
    return (
        <div className={styles.xpTracker}>xp tracker goes here</div>
    )
}

export default function Tile() {
    const [tile, setTile] = useState(null);
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const router = useRouter();
    const { id, tileId } = router.query;
    const { state, setState } = useContext(BoardContext);

    const handleFileInput = (e) => setSelectedFile(e.target.files[0]);

    async function uploadFile(file) {
        if(!file || !id || !tileId) return;
        try {
            const name = `${id}/${tileId}/${file.name}`;
            const storageLinkResponse = await fetch(`/api/files/upload?fileType=${file.type}&fileName=${name}`, {headers: { Authorization: state.token }});
            const storageLink = await storageLinkResponse.json();
            await fetch(storageLink , { method:'PUT', body :file});
        } catch(err) {
            console.error('error uploading:', err);
        }
    }

    useEffect(() => {
        if(state.board && JSON.stringify(state.board) !== '{}') {
            setTile(state.board.tiles.find(t => t.id == tileId));
        } else {
            setLoading(true);
            fetch(`/api/board/${id}`, {headers: { Authorization: state.token }})
                .then((res) => res.json())
                .then((data) => {
                    const newState = {
                        token: state.token,
                        board: data,
                        lastFetch: Date.now()
                    };
                    setState(newState);
                    setTile(data.tiles.find(t => t.id == tileId));
                    setLoading(false);
                });
        }
        
        fetch(`/api/files?boardId=${id}&tileId=${tileId}`, {headers: { Authorization: state.token }})
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setFiles(data);
            })
            .catch(err => {
                console.log('err', err);
            })
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
            { tile.xpTile ? <XpTracker /> : 
            // if its an xp tile use XpTracker component
            // else use the file uploader/viewer
            <div className={styles.container}>
                {!tile.xpTile && <div className={styles.files}>
                    {files && <FileList files={files} setFile={setFile} />}
                    <label for="file-upload" className={styles.fileInput}>
                        <span>{selectedFile ? selectedFile.name : "Upload Files"}</span>
                        <FontAwesomeIcon className={styles.uploadIcon} icon={faCloudArrowUp} />
                    </label>
                    <input id="file-upload" type="file" accept="image/png, image/jpg, image/gif, image/jpeg" onChange={handleFileInput}/>
                    <button disabled={!selectedFile} onClick={() => uploadFile(selectedFile)}>Submit</button>
                </div>}
                <div className={styles.box}>
                    {file &&
                        <Image
                            src={`${process.env.S3_BUCKET_URL}/${file.Key}`}
                            width={1000}
                            height={800}
                            alt=""
                        />
                    }
                </div>
            </div>
            }
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