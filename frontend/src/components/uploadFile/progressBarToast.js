import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProgressBarToast = ({ isUploading, progress }) => {
    const [toastId, setToastId] = useState(null);

    useEffect(() => {
        if (isUploading) {
            const newToastId = toast.info(
                <div>
                    <div className='fs-6'>Uploading...</div>
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

            const interval = setInterval(() => {
                if (progress < 100) {
                    toast.update(newToastId, {
                        render: (
                          <div>
                            <div>Uploading...</div>
                            <progress value={progress} max={100} />
                            <div>{`${progress}%`}</div>
                          </div>
                        ),
                      });
                } else {
                    clearInterval(interval);
                }
            }, 50);

            return () => clearInterval(interval);
        } else {
            if (toastId !== null) {
                toast.dismiss(toastId);
                setToastId(null);
            }
        }
    }, [isUploading, progress, toastId]);

    return <ToastContainer />;
};

export default ProgressBarToast;