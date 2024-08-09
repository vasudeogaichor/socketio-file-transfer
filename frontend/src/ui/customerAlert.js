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
          }, 5000);
    
          return () => clearTimeout(timer);
        }
      }, [show, setAlertInfo]);
    
      if (!isVisible) {
        return null;
    }

    return (
        <Alert className="my-4" variant={type}>
            {message?.split('\n')?.map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    <br />
                </React.Fragment>
            ))}
        </Alert>
    );
};

export default CustomAlert;
