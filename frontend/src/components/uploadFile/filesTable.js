import { useEffect, useState, useRef } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Table, Alert } from 'react-bootstrap';
import { socket } from '../../socket';

const FilesTable = ({ uploadedFiles: files }) => {
    const [errorMsg, setErrorMsg] = useState(null);
    // const fileWriterRef = useRef(null);
    const [downloadingFile, setDownloadingFile] = useState(null);
    const [progress, setProgress] = useState(null);

    const deleteFile = (file) => {
        socket.emit('file:delete', { name: file.name });
    };

    // const downloadFile = async (file) => {
    //     try {
    //         const handle = await window.showSaveFilePicker({
    //             suggestedName: file.name,
    //             types: [{
    //                 description: 'Text Files',
    //                 accept: {
    //                     'text/plain': ['.txt'],
    //                     'application/octet-stream': ['.bin']
    //                 }
    //             }]
    //         });

    //         fileWriterRef.current = await handle.createWritable();
    //         console.log('fileWriterRef - ', fileWriterRef)
    //         socket.emit('file:download:start', { name: file.name });
    //         setDownloadingFile(file);
    //     } catch (error) {
    //         setDownloadingFile(null);
    //         console.error('Error downloading file:', error);
    //     }
    // };

    const downloadFile = async (file) => {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: file.name,
                types: [{
                    description: 'Text Files',
                    accept: {
                        'text/plain': ['.txt'],
                        'application/octet-stream': ['.bin']
                    }
                }]
            });
    
            const writable = await handle.createWritable();
            console.log('Downloading file:', file.name);
    
            socket.emit('file:download:start', { name: file.name });
    
            socket.on('file:download:chunk', ({ data, progress }) => {
                console.log('progress - ', progress)
                writable.write(data);
                setProgress(progress);
            });
    
            socket.on('file:download:end', () => {
                writable.close();
                console.log('File download complete:', file.name);
                setProgress(null);
                setDownloadingFile(null);
            });
    
            socket.on('file:download:error', ({ message }) => {
                console.error('File download error:', message);
                setErrorMsg(message);
                setProgress(null);
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

    useEffect(() => {
        // socket.on('file:download:chunk', )
        // socket.on('file:download:end', (data) => {
        //     console.log('file downloaded.. - ', data)
        //     // TODO - do not close writer when chunk emit ended from server
        //     // close it after client has written last chunk
        //     if (fileWriterRef.current) {
        //         fileWriterRef.current.close();
        //         fileWriterRef.current = null;
        //     }
        //     setDownloadingFile(null);
        //     setProgress(null);
        // });

        // socket.on('file:download:chunk', (chunk) => {
        //     console.log('chunk - ', chunk)
        //     if (fileWriterRef.current) {
        //         fileWriterRef?.current?.write(chunk.data);
        //     }
        //     console.log('progress - ', chunk.progress)
        //     setProgress(chunk.progress);
        // });

        // socket.on('file:download:error', ({ message }) => {
        //     console.log('error - ', message)
        //     setDownloadingFile(null);
        //     setErrorMsg(message);
        // });


        // return () => {
        //     socket.off('file:download:end');
        //     socket.off('file:download:chunk');
        //     socket.off('file:download:error');
        //     if (fileWriterRef.current) {
        //         fileWriterRef.current.close();
        //         fileWriterRef.current = null;
        //     }
        // }
    });

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
                            {/* TODO - move the svgs to separate components */}
                            <td>
                                <div role="button" onClick={() => deleteFile(file)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                    </svg>
                                </div>
                            </td>
                            <td>
                                {(downloadingFile && downloadingFile.name === file.name) ? (
                                    <div style={{ width: 20, height: 20 }}>
                                        <CircularProgressbar value={progress} />
                                    </div>
                                ) : (
                                        <div role="button" onClick={() => downloadFile(file)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                                                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                                            </svg>
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