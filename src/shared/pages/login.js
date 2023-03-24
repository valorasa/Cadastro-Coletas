import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { useNavigate } from 'react-router-dom';
import NavigationBar from "../../shared/components/NavigationBar";
import jwtDecode from 'jwt-decode';


const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [session, setSession] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const userPool = new CognitoUserPool({
      UserPoolId: "us-east-2_jPQAfvNOU", // process.env.COGNITO_USER_POOL_ID,
      ClientId: "32ukukqocjmgtm5ubb4dbjdilk", //process.env.COGNITO_CLIENT_ID,
    });
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        setLoading(false);
        const accessToken = result.getAccessToken().getJwtToken();
        sessionStorage.setItem("accessToken", accessToken);
        setSession(accessToken);
        navigate('/pickups');
        // Redirect to your authenticated route
      },
      onFailure: (err) => {
        setLoading(false);
        console.log(err);
        if (err.code === "NEW_PASSWORD_REQUIRED") {
          setShowChangePasswordForm(true);
        }
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        setLoading(false);
        setShowChangePasswordForm(true);
        cognitoUser.completeNewPasswordChallenge(
          newPassword,
          requiredAttributes,
          {
            onSuccess: (result) => {
              const accessToken = result.getAccessToken().getJwtToken();
              sessionStorage.setItem("accessToken", accessToken);
              setSession(accessToken);
              navigate('/pickups');
              // Redirect to your authenticated route
            },
            onFailure: (err) => {
              console.log(err);
            },
          }
        );
      },
    });
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setLoading(true);
    const userPool = new CognitoUserPool({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      ClientId: process.env.COGNITO_CLIENT_ID,
    });
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });
    cognitoUser.getSession((err, session) => {
      if (err) {
        console.log(err);
        setLoading(false);
        return;
      }
      cognitoUser.completeNewPasswordChallenge(
        newPassword,
        null,
        {
          onSuccess: (result) => {
            setSession(result.getAccessToken().getJwtToken());
            setLoading(false);
            setShowChangePasswordForm(false);
          },
          onFailure: (err) => {
            console.log(err);
            setLoading(false);
          },
        },
        { Authorization: session.getIdToken().getJwtToken() }
      );
    });
  };
 

  return (
    <>
      <NavigationBar />
      <main className="container">
        <h1>Login</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </Form.Group>
  
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </Form.Group>
  
          {showChangePasswordForm ? (
            <Form.Group controlId="newPassword" className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
            </Form.Group>
          ) : null}
  
          <Button onClick={handleSubmit} variant="primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>
      </main>
    </>
  );
};

export default LoginPage;