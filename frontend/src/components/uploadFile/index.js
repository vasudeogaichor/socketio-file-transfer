import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
// import ss from 'socket.io-stream';

import socket from "../../socket";

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    // const stream = ss.createStream();

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = (e) => {
        e.preventDefault();
        const fileInput = e.target.elements.fileInput.files[0];
        // ss(socket).emit('file:upload', stream, { name: 'example.txt' });
    };

    // ss(socket).on('progress', (data) => {
    //     console.log('Progress:', data.progress);
    // });

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
                                    <Form.Control type="file" />
                                </Form.Group>
                                <Button variant="primary" type="submit">Upload</Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
