import React from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
// import { BsBoxArrowRight } from 'react-icons'; // Assuming you're using react-icons for the logout icon
import { removeCookie } from '../helpers';

const LogoutButton = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        removeCookie('token');
        navigate('/');
    };

    return (
        <Button variant="outline-dark" onClick={handleLogout}>
            Logout
        </Button>
    );
};

export default LogoutButton;
