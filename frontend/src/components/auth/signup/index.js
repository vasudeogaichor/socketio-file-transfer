import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { signupUser } from "../../../apis";
import CustomAlert from "../../../ui/customerAlert";
import BackgroundImage from "../../../assets/images/background.png";
import "./signup.css";

const SignUp = () => {
  const [inputUsername, setInputUsername] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputConfirmPassword, setInputConfirmPassword] = useState("");
  const [alertInfo, setAlertInfo] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (inputPassword !== inputConfirmPassword) {
      setAlertInfo({
        show: true,
        message: 'Passwords do not match!',
        type: 'warning'
      });
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
