import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { useNavigate } from 'react-router-dom';
import NavigationBar from "../../shared/components/NavigationBar";


const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [session, setSession] = useState(null);
  const [passwordValid, setPasswordValid] = useState(false);
  const [error, setError] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const userPool = new CognitoUserPool({
      UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
      ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
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
       // if(err.message == )
        console.log(err);
        if(err.message === "Incorrect username or password.") {
          setError("Usuário ou senha incorretos. Por favor, verifique suas credenciais e tente novamente.")
        }
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

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.])[a-zA-Z0-9!@#$%^&*.]{8,}$/;
    //const passwordRegex = /([A-Z]{1,}[0-9]{1,}[^a-zA-Z0-9]{1,}){8,}/;

    return passwordRegex.test(password);
  };

  const handleNewPasswordChange = (event) => {
    const newPasswordValue = event.target.value;
    setNewPassword(newPasswordValue);
    setPasswordValid(validatePassword(newPasswordValue));
  };

  return (
    <>
      <NavigationBar />
      <main className="container">
        <h1>Login</h1>
        {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Email"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </Form.Group>

          {showChangePasswordForm ? (
            <Form.Group controlId="newPassword" className="mb-3">
              <Form.Label>Nova Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="A sua senha deve conter no mínimo 8 caracteres, no mínimo uma letra maiúscula, um caractere especial e um número"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
                isInvalid={!passwordValid && newPassword.length > 0}
                isValid={passwordValid && newPassword.length > 0}
              />
              <Form.Control.Feedback type="invalid">
                A senha deve conter no mínimo 8 caracteres, pelo menos uma letra maiúscula, um caractere especial e um número.
              </Form.Control.Feedback>
              <Form.Control.Feedback type="valid">Senha válida.</Form.Control.Feedback>
            </Form.Group>
          ) : null}

          <Button
            style={{ backgroundColor: "#35a854" }}
            onClick={handleSubmit} className="border-0" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>
      </main>
    </>
  );
};

export default LoginPage;