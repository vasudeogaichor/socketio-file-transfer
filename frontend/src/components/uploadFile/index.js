import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { socket } from "../../socket";

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState('');
    const [progress, setProgress] = useState(null);
    console.log('isUploading - ', isUploading)
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        console.log('selectedFile - ', e.target.files[0])
    };

    const handleUpload = () => {
        if (!selectedFile) {
          alert("Please select a file to upload.");
          return;
        }
    
        const chunkSize = 5 * 1024 * 1024; // 5MB (adjust based on your requirements)
        const totalChunks = Math.ceil(selectedFile.size / chunkSize);
        const chunkProgress = 100 / totalChunks;
        let chunkNumber = 0;
        let start = 0;
        let end = 0;
    
        const uploadNextChunk = async () => {
          if (end <= selectedFile.size) {
            const chunk = selectedFile.slice(start, end);
            socket.emit('file:upload', { 
              name: selectedFile.name, 
              content: chunk,
              chunkNumber: chunkNumber,
              totalChunks: totalChunks,
              originalname: selectedFile.name
            });
    
            const temp = `Chunk ${chunkNumber + 1}/${totalChunks} uploaded successfully`;
            setStatus(temp);
            setProgress(Number((chunkNumber + 1) * chunkProgress));
            console.log(temp);
            chunkNumber++;
            start = end;
            end = start + chunkSize;
            uploadNextChunk();
          } else {
            setProgress(100);
            setSelectedFile(null);
            setStatus("File upload completed");
          }
        };
    
        uploadNextChunk();
      };
    
    useEffect(() => {
        socket.on('file:upload:finished', () => {
            setIsUploading(false);
        })

        return () => socket.off('file:upload:finished');
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
                                    <Form.Control type="file" onChange={handleFileChange} disabled={isUploading} />
                                </Form.Group>
                                <Button variant="primary" type="submit" disabled={isUploading}>Upload</Button>
                            </Form>
                            {isUploading && <p>Uploading...</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
