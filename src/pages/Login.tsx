import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthService from '../hooks/useAuthService';
import styled from 'styled-components';
import { useAuthContext } from '../managers/AuthContext';
import { User } from '../models/User';
import logo from '../assets/PopLensLogo.png';



const LogoSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;


const Input = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 4px;
  border: 1px solid #333;
  background-color: #192734;
  color: white;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #DB216D;
  }
`;

const Button = styled.button`
  width: 100%;
  max-width: 400px;
  padding: 12px;
  border-radius: 25px;
  border: none;
  background-color: #DB216D;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #C2185B;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  margin-bottom: 20px;
`;

const SignUpLink = styled.p`
  margin-top: 20px;
  color: #657786;
  
  a {
    color: #DB216D;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #15202B;
  color: white;
  justify-content: center;   // Center horizontally
  align-items: center;       // Center vertically
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;       // Center form content
  padding: 40px;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 31px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
`;

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const authService = useAuthService();
  const { login } = useAuthContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      setIsLoading(true);
      setError("");
      const response = await authService.login({ username, password });
      //const response = { data: { token: 'fake-token' } };
      const { token, userId, profileId } = response.data;
      const user: User = { username, token, userId, profileId };
      login(user);
      navigate("/home");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <FormSection>
        <Title>Sign in to <img
          src={logo}
          alt="PopLens Logo"
          style={{ height: "36px", width: "auto", verticalAlign: "middle", marginBottom: "-10px"  }}
        /></Title>
        <form onSubmit={handleLogin}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <SignUpLink>
          Don't have an account? <a href="/register">Sign up</a>
        </SignUpLink>
      </FormSection>
    </LoginContainer>
  );
};

export default Login;