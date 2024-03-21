import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import streamSaver from 'streamsaver';
import 'react-circular-progressbar/dist/styles.css';
import { Table, Alert } from 'react-bootstrap';
import { socket } from '../../socket';
import { ReactComponent as TrashIcon } from "../../assets/icons/trash.svg";
import { ReactComponent as DownloadIcon } from "../../assets/icons/download.svg";
let ss = require('../../../node_modules/socket.io-stream/socket.io-stream');

const FilesTable = ({ uploadedFiles: files }) => {
    const [errorMsg, setErrorMsg] = useState(null);
    const [downloadingFile, setDownloadingFile] = useState(null);
    const [progress, setProgress] = useState(null);
    const deleteFile = (file) => {
        socket.emit('file:delete', { name: file.name });
    };

    const downloadFile = async (file) => {
        try {
            let writtenSize = 0;
            let totalFileSize = file.size * 1024;
            const stream = ss.createStream();
            const writableStream = streamSaver.createWriteStream(file.name);
            const writer = writableStream.getWriter()
            ss(socket).emit('file:download', stream, { name: file.name });

            stream.on('data', (chunk) => {
                writtenSize += chunk.length;
                setProgress(Math.ceil((writtenSize / totalFileSize) * 100));
                writer.write(chunk);
            });

            stream.on('end', () => {
                writer.close();
                console.log('File downloaded successfully');
                setDownloadingFile(null);
            });

            setDownloadingFile(file);

        } catch (error) {
            console.error('Error downloading file:', error);
            setErrorMsg('Error downloading file');
            setDownloadingFile(null);
            setProgress(null);
        }
    };

    return (
        <div>
            <Table hover bordered>
                <thead>
                    <tr>
                        <th colSpan={5}>
                            <h5 className="text-dark text-center w-100">Uploaded Files</h5>
                        </th>

                    </tr>
                    <tr>
                        <th>File Name</th>
                        <th>Created At</th>
                        <th colSpan={3}>Size (kB)</th>
                    </tr>
                </thead>
                <tbody>
                    {files?.map(file => (
                        <tr key={file.name}>
                            <td>{file.name}</td>
                            <td>{new Date(file.created_at).toLocaleString()}</td>
                            <td>{file.size}</td>
                            <td>
                                <div role="button" onClick={() => deleteFile(file)}>
                                    <TrashIcon />
                                </div>
                            </td>
                            <td>
                                {(downloadingFile && downloadingFile.name === file.name) ? (
                                    <div style={{ width: 20, height: 20 }}>
                                        <CircularProgressbar value={progress} />
                                    </div>
                                ) : (
                                    <div role="button" onClick={() => downloadFile(file)}>
                                        <DownloadIcon />
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {(errorMsg?.length) && (<div className="mt-5"><Alert key="danger" dismissible variant="danger"> {errorMsg} </Alert></div>)}
        </div>
    )
};

export default FilesTable;