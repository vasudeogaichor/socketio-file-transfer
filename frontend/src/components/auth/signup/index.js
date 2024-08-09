import React, { useState } from "react";
import {useNavigate} from 'react-router-dom';
import { Form, Button } from "react-bootstrap";
import { signupUser } from "../../../apis";
import CustomAlert from "../../../ui/customerAlert";
import BackgroundImage from "../../../assets/images/background.png";
import "./signup.css";
import { setCookie } from "../../../helpers";

const SignUp = () => {
  const [inputUsername, setInputUsername] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputConfirmPassword, setInputConfirmPassword] = useState("");
  const [alertInfo, setAlertInfo] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (inputPassword !== inputConfirmPassword) {
      setAlertInfo({
        show: true,
        message: 'Passwords do not match!',
        type: 'warning'
      });
    } else {
      const signupResult = await signupUser({
        username: inputUsername,
        email: inputEmail,
        password: inputPassword
      })

      if (signupResult.success) {
        setCookie('token', signupResult.data.token);
        navigate('/files');
      } else {
        console.log(signupResult.message)
        setAlertInfo({
          show: true,
          message: Array.isArray(signupResult.message) ? signupResult.message.join('\n') : signupResult.message,
          type: 'danger'
        });
      }
    }
  };
  console.log('alert info - ', alertInfo)
  return (
    <div className="sign-up__wrapper"
    style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        <div className="h4 mb-2 text-center">Sign Up</div>
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={inputUsername}
            placeholder="Username"
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={inputEmail}
            placeholder="Email"
            onChange={(e) => setInputEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={inputPassword}
            placeholder="Password"
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={inputConfirmPassword}
            placeholder="Confirm Password"
            onChange={(e) => setInputConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button className="w-100" variant="primary" type="submit">
          Sign Up
        </Button>
      </Form>
      <div>
        <CustomAlert
          alertInfo={alertInfo}
          setAlertInfo={setAlertInfo}
        />
      </div>
    </div>
  );
};

export default SignUp;
