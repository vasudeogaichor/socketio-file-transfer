import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = () => {
        // Perform upload logic here
        console.log('Selected file:', selectedFile);
    };

    return (
        <>
            <Form.Group controlId="formFileLg" className="mb-3">
                <Form.Label>Large file input example</Form.Label>
                <Form.Control type="file" size="lg" />
            </Form.Group>
        </>
    );
};

export default FileUpload;
