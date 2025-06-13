import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div<{ size?: number }>`
  width: ${props => props.size || 24}px;
  height: ${props => props.size || 24}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Spinner = styled.div<{ size?: number }>`
  width: ${props => props.size || 24}px;
  height: ${props => props.size || 24}px;
  border: 2px solid transparent;
  border-top-color: #DB216D;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

interface LoadingSpinnerProps {
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size }) => {
  return (
    <SpinnerContainer size={size}>
      <Spinner size={size} />
    </SpinnerContainer>
  );
};
export default LoadingSpinner;