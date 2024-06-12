// import React, { useState } from "react";
// import { Button, Form, Alert } from "react-bootstrap";
// import { CognitoUserPool, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
// import { useNavigate } from 'react-router-dom';
// import NavigationBar from "../../shared/components/NavigationBar";


// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
//   const [session, setSession] = useState(null);
//   const [passwordValid, setPasswordValid] = useState(false);
//   const [error, setError] = useState("");


//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     const userPool = new CognitoUserPool({
//       UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
//       ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
//     });
//     const authenticationDetails = new AuthenticationDetails({
//       Username: username,
//       Password: password,
//     });
//     const cognitoUser = new CognitoUser({
//       Username: username,
//       Pool: userPool,
//     });

//     cognitoUser.authenticateUser(authenticationDetails, {
//       onSuccess: (result) => {
//         setLoading(false);
//         const accessToken = result.getAccessToken().getJwtToken();
//         sessionStorage.setItem("accessToken", accessToken);
//         setSession(accessToken);
//         navigate('/pickups');
//         // Redirect to your authenticated route
//       },
      
//       onFailure: (err) => {
//         setLoading(false);
//        // if(err.message == )
//         console.log(err);
//         if(err.message === "Incorrect username or password.") {
//           setError("Usuário ou senha incorretos. Por favor, verifique suas credenciais e tente novamente.")
//         }
//         if (err.code === "NEW_PASSWORD_REQUIRED") {
//           setShowChangePasswordForm(true);
//         }
//       },
//       newPasswordRequired: (userAttributes, requiredAttributes) => {
//         setLoading(false);
//         setShowChangePasswordForm(true);
//         cognitoUser.completeNewPasswordChallenge(
//           newPassword,
//           requiredAttributes,
//           {
//             onSuccess: (result) => {
//               const accessToken = result.getAccessToken().getJwtToken();
//               sessionStorage.setItem("accessToken", accessToken);
//               setSession(accessToken);
//               navigate('/pickups');
//               // Redirect to your authenticated route
//             },
//             onFailure: (err) => {
//               console.log(err);
//             },
//           }
//         );
//       },
//     });
//   };

//   const handlePasswordChange = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     const userPool = new CognitoUserPool({
//       UserPoolId: process.env.COGNITO_USER_POOL_ID,
//       ClientId: process.env.COGNITO_CLIENT_ID,
//     });
//     const cognitoUser = new CognitoUser({
//       Username: username,
//       Pool: userPool,
//     });
//     cognitoUser.getSession((err, session) => {
//       if (err) {
//         console.log(err);
//         setLoading(false);
//         return;
//       }
//       cognitoUser.completeNewPasswordChallenge(
//         newPassword,
//         null,
//         {
//           onSuccess: (result) => {
//             setSession(result.getAccessToken().getJwtToken());
//             setLoading(false);
//             setShowChangePasswordForm(false);
//           },
//           onFailure: (err) => {
//             console.log(err);
//             setLoading(false);
//           },
//         },
//         { Authorization: session.getIdToken().getJwtToken() }
//       );
//     });
//   };

//   const validatePassword = (password) => {
//     const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.])[a-zA-Z0-9!@#$%^&*.]{8,}$/;
//     //const passwordRegex = /([A-Z]{1,}[0-9]{1,}[^a-zA-Z0-9]{1,}){8,}/;

//     return passwordRegex.test(password);
//   };

//   const handleNewPasswordChange = (event) => {
//     const newPasswordValue = event.target.value;
//     setNewPassword(newPasswordValue);
//     setPasswordValid(validatePassword(newPasswordValue));
//   };

//   return (
//     <>
//       <NavigationBar />
//       <main className="container">
//         <h1>Login</h1>
//         {error && (
//             <Alert variant="danger" className="mt-3">
//               {error}
//             </Alert>
//           )}
//         <Form onSubmit={handleSubmit}>
//           <Form.Group controlId="username">
//             <Form.Label>Email</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Email"
//               value={username}
//               onChange={(event) => setUsername(event.target.value)}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="password" className="mb-3">
//             <Form.Label>Senha</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="Senha"
//               value={password}
//               onChange={(event) => setPassword(event.target.value)}
//               required
//             />
//           </Form.Group>

//           {showChangePasswordForm ? (
//             <Form.Group controlId="newPassword" className="mb-3">
//               <Form.Label>Nova Senha</Form.Label>
//               <Form.Control
//                 type="password"
//                 placeholder="A sua senha deve conter no mínimo 8 caracteres, no mínimo uma letra maiúscula, um caractere especial e um número"
//                 value={newPassword}
//                 onChange={handleNewPasswordChange}
//                 required
//                 isInvalid={!passwordValid && newPassword.length > 0}
//                 isValid={passwordValid && newPassword.length > 0}
//               />
//               <Form.Control.Feedback type="invalid">
//                 A senha deve conter no mínimo 8 caracteres, pelo menos uma letra maiúscula, um caractere especial e um número.
//               </Form.Control.Feedback>
//               <Form.Control.Feedback type="valid">Senha válida.</Form.Control.Feedback>
//             </Form.Group>
//           ) : null}

//           <Button
//             style={{ backgroundColor: "#35a854" }}
//             onClick={handleSubmit} className="border-0" type="submit" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </Button>
//         </Form>
//       </main>
//     </>
//   );
// };

// export default LoginPage;

import React, { useState } from "react";
import { Button, Form, Alert, InputGroup } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import NavigationBar from "../../shared/components/NavigationBar";
import axiosInstance from "../../setup/axios";
import { EyeSlashFill, EyeFill } from 'react-bootstrap-icons';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(true); // Estado para controlar a exibição do formulário de login
  const [showCreateUserForm, setShowCreateUserForm] = useState(false); // Estado para controlar a exibição do formulário de criação de usuário
  const [showFirstLoginForm, setShowFirstLoginForm] = useState(false); // Estado para controlar a exibição do formulário de primeiro login
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleShowCreateUser = () => {
    setShowLoginForm(false);
    setShowCreateUserForm(true);
    setShowFirstLoginForm(false);
  };

  const handleShowFirstLogin = () => {
    setShowLoginForm(false);
    setShowCreateUserForm(false);
    setShowFirstLoginForm(true);
  };

  const handleBackToLogin = () => {
    setShowLoginForm(true);
    setShowCreateUserForm(false);
    setShowFirstLoginForm(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await axiosInstance.post('/cognito/login', {
        email: email,
        password: password,
      });
      if (data.ChallengeName === "NEW_PASSWORD_REQUIRED") {
        setShowFirstLoginForm(true)
        setShowLoginForm(false)
        setCurrentPassword(password)
      } else {
        localStorage.setItem("accessToken", data.AccessToken);
        localStorage.setItem("refreshToken", data.RefreshToken);
        navigate('/pickups'); // Redireciona para a página desejada após o login
      }
    } catch (err) {
      setError("Falha no login. Verifique suas credenciais e tente novamente. Caso seja seu primeiro login verifique o email para recuperar sua senha temporária.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post('/cognito/create-user', {
        email: email,
        name: name,
      });

      if (response.status === 200) {
        setSuccessMessage("Senha temporária foi enviada para o seu email. Por favor, verifique sua caixa de entrada ou spam.");
        setShowCreateUserForm(false);
        setShowFirstLoginForm(true);
      }
    } catch (err) {
      setError("Falha ao criar o user.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const firstLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post('/cognito/update-password', {
        email: email,
        currentPassword: currentPassword,
        newPassword: newPassword
      });

      if (response.status === 200) {
        await loginUser(email, newPassword);
      }
    } catch (err) {
      setError("Falha no login. Verifique suas credenciais e tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const loginUser = async (email, password) => {
    try {
      const { data } = await axiosInstance.post('/cognito/login', {
        email: email,
        password: password,
      });

      localStorage.setItem("accessToken", data.AccessToken);
      localStorage.setItem("refreshToken", data.RefreshToken);
      navigate('/pickups');
    } catch (err) {
      setError("Falha no login. Verifique suas credenciais e tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);

  return (
    <>
      <NavigationBar />
      <main className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <h1 className="text-center mb-4">{showLoginForm ? "Login" : showCreateUserForm ? "Criar Conta" : "Primeiro Login"}</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          {showLoginForm && (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Senha</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                    {showPassword ? <EyeSlashFill /> : <EyeFill />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Form>
          )}
          {showCreateUserForm && (
            <Form onSubmit={createUser}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nome completo"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="success" type="submit" className="w-100 mb-2" disabled={loading}>
                {loading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </Form>
          )}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {showFirstLoginForm && (
            <>
              <Form onSubmit={firstLogin}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="currentPassword" className="mb-3">
                  <Form.Label>Senha temporária</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Senha temporária"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      required
                    />
                    <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                      {showPassword ? <EyeSlashFill /> : <EyeFill />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Form.Group controlId="newPassword" className="mb-3">
                  <Form.Label>Criar Senha</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Digite a nova senha"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      isInvalid={!passwordValid && newPassword.length > 0}
                      required
                    />
                    <InputGroup.Text onClick={toggleNewPasswordVisibility} style={{ cursor: 'pointer' }}>
                      {showNewPassword ? <EyeSlashFill /> : <EyeFill />}
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      A senha deve conter no mínimo 8 caracteres, incluindo uma letra maiúscula, um número e um caractere especial.
                    </Form.Control.Feedback>


                  </InputGroup>

                </Form.Group>

                <Button variant="success" type="submit" className="w-100 mb-2" disabled={loading}>
                  {loading ? "Atualizando senha..." : "Atualizar Senha"}
                </Button>
              </Form>
            </>
          )}
          <div className="text-center">
            {showLoginForm && (
              <>
                <Button variant="success" type="submit" className="w-100 mb-2" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
                <Button variant="secondary" className="w-100 mb-2" onClick={handleShowCreateUser}>
                  Criar Conta
                </Button>
              </>
            )}
            {!showLoginForm && (
              <Button variant="primary" className="w-100" onClick={handleBackToLogin}>
                Voltar ao Login
              </Button>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;