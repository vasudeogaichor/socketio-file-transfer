import { Form, Button, Alert, ProgressBar } from 'react-bootstrap';

const FileInput = ({
    handleUpload,
    fileInputRef,
    handleFileChange,
    isUploading,
    progress,
    totalTime,
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
                                <Form.Control ref={fileInputRef} type="file" onChange={handleFileChange} disabled={isUploading} />
                            </Form.Group>
                            <Button className="mb-10" variant="primary" type="submit" disabled={isUploading}>Upload</Button>
                        </Form>
                        {isUploading && <p>Uploading... Do not refresh the page.</p>}
                        {(progress > 0) && (
                            <div className="m-5"><ProgressBar now={progress} label={`${progress}%`} visuallyHidden /></div>
                        )}
                        {(totalTime > 0 && !errorMsg) && <p>Total time taken: {totalTime} milliseconds (~ {Math.ceil(totalTime / 60000)} minute(s))</p>}
                        {(errorMsg?.length) && (<div className="mt-5"><Alert key="danger" dismissible variant="danger"> {errorMsg} </Alert></div>)}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default FileInput;