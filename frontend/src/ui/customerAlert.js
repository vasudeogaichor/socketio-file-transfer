import React, {useState, useEffect} from "react";
import { Alert } from "react-bootstrap";

const CustomAlert = ({ alertInfo, setAlertInfo }) => {
    const {type, message, show } = alertInfo;
    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        setIsVisible(show);
        if (show) {
          const timer = setTimeout(() => {
            setIsVisible(false);
            setAlertInfo({});
            // onClose(); // Optional: Call a function to handle alert dismissal
          }, 2000);
    
          return () => clearTimeout(timer);
        }
      }, [show]);
    
      if (!isVisible) {
        return null;
      }

  return (
    <Alert className="my-4" variant={type}>
      {message}
    </Alert>
  );
};

export default CustomAlert;
