import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProgressBarToast = ({ isUploading, progress }) => {
    const [toastId, setToastId] = useState(null);

    useEffect(() => {
        let newToastId = null;
        if (isUploading) {
            const newToastId = toast.info(
                <div>
                    <div>Uploading...</div>
                    <progress value={progress} max={100} />
                    <div>{`${progress}%`}</div>
                </div>,
                {
                    autoClose: false,
                    closeButton: false,
                    closeOnClick: false,
                    draggable: false,
                    pauseOnHover: false,
                    position: "bottom-right",
                    toastId: toastId
                }
            );
            setToastId(newToastId);
        } else {
            if (toastId !== null) {
                if (toastId !== null) {
                    dismissToast();
                }
            }
        }

        function dismissToast() {
            toast.dismiss(newToastId);
            setToastId(null);
        }
    }, [isUploading, progress, toastId]);

    return <ToastContainer />;
};

export default ProgressBarToast;