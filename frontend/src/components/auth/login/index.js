import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { setCookie } from "../../../helpers";
import CustomAlert from "../../../ui/customerAlert";
import BackgroundImage from "../../../assets/images/background.png";
import Logo from "../../../assets/images/logo.png";
import { loginUser } from "../../../apis";

const Login = () => {
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [alertInfo, setAlertInfo] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const loginResult = await loginUser({
      username: inputUsername,
      password: inputPassword
    });

    if (loginResult.success) {
      setCookie('token', loginResult.data.token);
      navigate('/files');
    } else {
      setAlertInfo({
        show: true,
        message: Array.isArray(loginResult.message) ? loginResult.message.join('\n') : loginResult.message,
        type: 'danger'
      });
    }
  };

  // TODO: add a page to set password
  const handleForgotPassword = () => { console.log(inputPassword) };

  return (
    <div
      className="sign-in__wrapper"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      {/* Overlay */}
      <div className="sign-in__backdrop"></div>
      {/* Form */}
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        {/* Header */}
        <img
          className="img-thumbnail mx-auto d-block mb-2"
          src={Logo}
          alt="logo"
        />
        <div className="h4 mb-2 text-center">Sign In</div>
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
        {/* <Form.Group className="mb-2" controlId="checkbox">
          <Form.Check type="checkbox" label="Remember me" />
        </Form.Group> */}
        <Button className="w-100" variant="primary" type="submit">
          Log In
        </Button>
        <div className="d-grid justify-content-end">
          <Button
            className="text-muted px-0"
            variant="link"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </Button>
        </div>
      </Form>
      <div>
        <CustomAlert
          alertInfo={alertInfo}
          setAlertInfo={setAlertInfo}
        />
      </div>
      {/* Footer */}
      {/* <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
        Made by Hendrik C | &copy;2022
      </div> */}
    </div>
  );
};

export default Login;
