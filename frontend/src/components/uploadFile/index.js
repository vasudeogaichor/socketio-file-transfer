import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { socket } from "../../socket";
import FilesTable from "./filesTable";
let stream = require('../../../node_modules/socket.io-stream/socket.io-stream');

const CHUNK_SIZE = 1024 * 1024;

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(null);
    const fileInputRef = useRef();
    const [progress, setProgress] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        if (errorMsg) setErrorMsg(null);
        setStartTime(null);
    };

    let totalTime = endTime && startTime ? endTime - startTime : null;
    console.log('startTime - ', startTime)
    console.log('endTime - ', endTime)

    const upload = async () => {
        const uploadStream = stream.createStream();
        const fileSize = selectedFile.size;
        let uploadedBytes = 0;
        stream(socket).emit('file:upload', uploadStream, { name: selectedFile.name });
        setStartTime(Date.now());
        stream.createBlobReadStream(selectedFile)
            .on('data', (chunk) => {
                uploadedBytes += chunk.length;
                const progressPercentage = Math.round((uploadedBytes / fileSize) * 100);
                setProgress(progressPercentage);
            })
            .on('end', () => {
                console.log('Upload complete');
                setProgress(null);
                setSelectedFile(null);
                setEndTime(Date.now());
              })
            .pipe(uploadStream);
        console.log('File uploaded');

        if (uploadedBytes === fileSize) setProgress(null);
        // while (start < selectedFile.size) {
        //     const chunk = selectedFile.slice(start, end);

        //     // Emit the chunk to the server
        //     socket.emit('file:upload', { content: chunk, name: selectedFile.name });

        //     // Calculate and emit progress
        //     const progress = Math.round((end / selectedFile.size) * 100);
        //     socket.emit('file:upload:progress', { name: selectedFile.name, progress });

        //     // Update start and end for the next chunk
        //     start = end;
        //     end = Math.min(start + CHUNK_SIZE, selectedFile.size);

        //     // Optional - Add delay if needed to avoid overwhelming the server
        //     await new Promise(resolve => setTimeout(resolve, 100));
        // }

        // let uploader = new SocketIOFileUpload(socket);

        // uploader.addEventListener('complete', (event) => {
        //     console.log('File uploaded:', event.detail);
        //   });

        //   uploader.addEventListener('error', (event) => {
        //     console.error('Error uploading file:', event.detail);
        //   });

        //   uploader.addEventListener("progress", function(event){
        //     var percent = event.bytesLoaded / event.file.size * 100;
        //     console.log("File is", percent.toFixed(2), "percent loaded");
        // });

        //   uploader.dir = 'uploads/';

        //   uploader.upload(selectedFile);

        // socket.emit('file:upload:finished');
    };

    const handleUpload = (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        upload();

        // socket.emit('file:upload:start', { name: selectedFile.name });
    };

    useEffect(() => {
        socket.emit('file:list');
    }, []);

    useEffect(() => {
        socket.on('file:upload:finished', () => {
            setEndTime(Date.now());
            setSelectedFile(null);
            setIsUploading(false);
            setProgress(null);
            fileInputRef.current.value = '';
            socket.emit('file:list');
        });

        socket.on('file:upload:progress', (data) => {
            setProgress(data);
        });

        socket.on('file:upload:error', (data) => {
            setErrorMsg(data.message);
        });

        // socket.on('file:upload:start', () => {
        //     upload();
        // });

        socket.on('file:list', (data) => {
            if (data?.error) {
                setErrorMsg(data.error)
            }
            setUploadedFiles(data.data)
        });

        socket.on('file:delete:success', () => {
            socket.emit('file:list');
        });

        return () => {
            socket.off('file:upload:finished');
            socket.off('file:upload:progress');
            socket.off('file:upload:error');
            socket.off('file:upload:start');
            socket.off('file:list');
            socket.off('file:delete:success');
        };
    });

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-10">
                    <div className="card text-center">
                        <div className="card-body h-235">
                            <h5 className="card-title">Upload a File</h5>
                            <Form onSubmit={handleUpload}>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>Select file to upload</Form.Label>
                                    <Form.Control ref={fileInputRef} type="file" onChange={handleFileChange} disabled={isUploading} />
                                </Form.Group>
                                <Button className="mb-10" variant="primary" type="submit" disabled={isUploading}>Upload</Button>
                            </Form>
                            {isUploading && <p>Uploading... Do not refresh the page.</p>}
                            {(progress > 0) && (
                                <div className=""><ProgressBar now={progress} label={`${progress}%`} visuallyHidden /></div>
                            )}
                            {(totalTime > 0 && !errorMsg) && <p>Total time taken: {totalTime} milliseconds (~ {Math.ceil(totalTime / 60000)} minute(s))</p>}
                            {(errorMsg?.length) && (<div className="mt-5"><Alert key="danger" dismissible variant="danger"> {errorMsg} </Alert></div>)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center mt-5">
                <div className="col-10">
                    <FilesTable uploadedFiles={uploadedFiles} />
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
