import React, { useState, useEffect, useRef } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Form, Button } from 'react-bootstrap';
import { socket } from "../../socket";

const CHUNK_SIZE = 1024 * 1024;

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef();
    const [progress, setProgress] = useState(null);
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        const reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);

        reader.onload = async () => {
            setIsUploading(true);

            const buffer = reader.result;
            const totalSize = buffer.byteLength;
            let bytesUploaded = 0;

            while (bytesUploaded < totalSize) {
                const chunk = buffer.slice(bytesUploaded, bytesUploaded + CHUNK_SIZE);
                bytesUploaded += chunk.byteLength;

                socket.emit('file:upload', { content: chunk, name: selectedFile.name });

                // Calculate and emit progress
                const progress = Math.round((bytesUploaded / totalSize) * 100);
                socket.emit('file:upload:progress', { name: selectedFile?.name, progress });

                // Optional - Add delay if needed to avoid overwhelming the server
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            socket.emit('file:upload:finished');
        };
    };

    useEffect(() => {
        socket.on('file:upload:finished', () => {
            setSelectedFile(null);
            setIsUploading(false);
            setProgress(null);
            fileInputRef.current.value = '';
        });

        socket.on('file:upload:progress', (data) => {
            setProgress(data);
        });

        return () => {
            socket.off('file:upload:finished');
            socket.off('file:upload:progress');
        };
    }, []);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-6">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Upload a File</h5>
                            <Form onSubmit={handleUpload}>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>Select file to upload</Form.Label>
                                    <Form.Control ref={fileInputRef} type="file" onChange={handleFileChange} disabled={isUploading} />
                                </Form.Group>
                                <Button variant="primary" type="submit" disabled={isUploading}>Upload</Button>
                            </Form>
                            {isUploading && <p>Uploading...</p>}
                            {progress && (
                                <ProgressBar now={progress} label={`${progress}%`} visuallyHidden />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
