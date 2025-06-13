import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useAuthService from '../hooks/useAuthService';

const RegisterContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #15202B;
  color: white;
`;

const LogoSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const FormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const Title = styled.h1`
  font-size: 31px;
  margin-bottom: 40px;
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
  
  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  margin-bottom: 20px;
`;

const LoginLink = styled.p`
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

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const authService = useAuthService();

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setError('');
      await authService.register({ username, email, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <LogoSection>
        <svg width="200" height="200" viewBox="0 0 24 24" fill="#DB216D">
          <path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z"/>
        </svg>
      </LogoSection>
      <FormSection>
        <Title>Create your account</Title>
        <form onSubmit={handleRegister}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>
        <LoginLink>
          Already have an account? <a href="/login">Sign in</a>
        </LoginLink>
      </FormSection>
    </RegisterContainer>
  );
};

export default Register;