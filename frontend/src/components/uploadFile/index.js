import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { socket } from "../../socket";
import FilesTable from "./filesTable";
import FileInput from "./fileInput";
import LogoutButton from "../../ui/logoutButton";
let stream = require('../../../node_modules/socket.io-stream/socket.io-stream');

class FileUploader {
    constructor(file) {
        this.file = file;
        this.uploadStream = stream.createStream();
        this.fileSize = file.size;
        this.uploadedBytes = 0;
        this.progress = 0;
        this.isUploading = false;
    }

    startUpload() {
        this.isUploading = true;
        this.toastId = toast.info(
            <div>
                <div>Uploading {this.file.name}</div>
                <progress value={this.progress} max={100} />
                <div>{this.progress}%</div>
            </div>,
            {
                autoClose: false,
                closeButton: false,
                closeOnClick: false,
                draggable: false,
                pauseOnHover: false,
                position: "bottom-right",
                toastId: this.toastId
            }
        );

        stream(socket).emit('file:upload', this.uploadStream, { name: this.file.name });
        stream.createBlobReadStream(this.file)
            .on('data', (chunk) => {
                this.uploadedBytes += chunk.length;
                this.progress = Math.round((this.uploadedBytes / this.fileSize) * 100);
                toast.update(this.toastId, {
                    render: (
                        <div>
                            <div>Uploading {this.file.name}</div>
                            <progress value={this.progress} max={100} />
                            <div>{this.progress}%</div>
                        </div>
                    )
                });
            })
            .on('end', () => {
                this.isUploading = false;
                toast.dismiss(this.toastId);
            })
            .pipe(this.uploadStream);
    }
}

const FileUpload = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef();
    const [uploadedFiles, setUploadedFiles] = useState(null);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles([...selectedFiles, ...files]);
    };

    const handleUpload = (e) => {
        e.preventDefault();

        selectedFiles.forEach((file) => {
            const uploader = new FileUploader(file);
            uploader.startUpload();
        });

        setSelectedFiles([]);
        fileInputRef.current.value = '';
    };

    useEffect(() => {
        socket.emit('file:list');
    }, []);

    useEffect(() => {
        socket.on('file:upload:complete', () => {
            socket.emit('file:list');
        });

        socket.on('file:list', (data) => {
            setUploadedFiles(data.data)
        });

        socket.on('file:delete:success', () => {
            socket.emit('file:list');
        });

        return () => {
            socket.off('file:upload:complete');
            socket.off('file:list');
            socket.off('file:delete:success');
        };
    });

    return (
        <div className="container mt-5">
            <div className='d-flex justify-content-end mb-4'>
                <LogoutButton />
            </div>
            <FileInput
                handleUpload={handleUpload}
                fileInputRef={fileInputRef}
                handleFileChange={handleFileChange}
            />
            <div className="row justify-content-center mt-5">
                <div className="col-10">
                    <FilesTable uploadedFiles={uploadedFiles} />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default FileUpload;
