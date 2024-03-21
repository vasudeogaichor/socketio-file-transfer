import React, { useState, useEffect, useRef } from 'react';
import { socket } from "../../socket";
import FilesTable from "./filesTable";
import FileInput from "./fileInput";
import ProgressBarToast from "./progressBarToast";
let stream = require('../../../node_modules/socket.io-stream/socket.io-stream');

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

    const upload = async () => {
        setIsUploading(true);
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
                setIsUploading(false);
            })
            .pipe(uploadStream);

        if (uploadedBytes === fileSize) setProgress(null);
    };

    const handleUpload = (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        upload();
    };

    useEffect(() => {
        socket.emit('file:list');
    }, []);

    useEffect(() => {
        socket.on('file:upload:complete', () => {
            setEndTime(Date.now());
            fileInputRef.current.value = '';
            socket.emit('file:list');
        });

        // socket.on('file:upload:error', (data) => {
        //     setErrorMsg(data.message);
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
            socket.off('file:upload:complete');
            // socket.off('file:upload:error');
            socket.off('file:list');
            socket.off('file:delete:success');
        };
    });

    return (
        <div className="container mt-5">
            <FileInput
                  handleUpload={handleUpload}
                  fileInputRef={fileInputRef}
                  handleFileChange={handleFileChange}
                  isUploading={isUploading}
                  totalTime={totalTime}
                  errorMsg={errorMsg}
                />
            <div className="row justify-content-center mt-5">
                <div className="col-10">
                    <FilesTable uploadedFiles={uploadedFiles} />
                </div>
            </div>
            <ProgressBarToast isUploading={isUploading} progress={progress} />
        </div>
    );
};

export default FileUpload;
