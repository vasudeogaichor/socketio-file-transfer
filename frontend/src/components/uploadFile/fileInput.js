import { Form, Button, Alert } from 'react-bootstrap';

const FileInput = ({
    handleUpload,
    fileInputRef,
    handleFileChange,
    isUploading,
    errorMsg
}) => {
    return (
        <div className="row justify-content-center">
            <div className="col-10">
                <div className="card text-center">
                    <div className="card-body h-235">
                        <h5 className="card-title">Upload a File</h5>
                        <Form onSubmit={handleUpload}>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Select file to upload</Form.Label>
                                <Form.Control ref={fileInputRef} multiple type="file" onChange={handleFileChange} disabled={isUploading} />
                            </Form.Group>
                            <Button className="mb-10" variant="primary" type="submit" disabled={isUploading}>Upload</Button>
                        </Form>
                        {isUploading && <p>Uploading... Do not refresh the page.</p>}
                        {(errorMsg?.length) && (<div className="mt-5"><Alert key="danger" dismissible variant="danger"> {errorMsg} </Alert></div>)}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default FileInput;