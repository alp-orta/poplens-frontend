import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ReviewCard from '../components/ReviewCard';
import { MediaType } from '../models/MediaType';
import useAuthService from '../hooks/useAuthService';
import { useAuthContext } from '../AuthContext';

const HomeContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #15202B;
  color: white;
`;

const Sidebar = styled.div`
  width: 275px;
  padding: 20px;
  position: sticky;
  top: 0;
  height: 100vh;
  border-right: 1px solid #38444d;
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 600px;
  border-right: 1px solid #38444d;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: white;
  text-decoration: none;
  font-size: 20px;
  border-radius: 25px;
  margin: 4px 0;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(233, 30, 99, 0.1);
  }

  svg {
    margin-right: 15px;
  }
`;

const FeedToggle = styled.div`
  display: flex;
  border-bottom: 1px solid #38444d;
`;

const TabButton = styled.button<{ active?: boolean }>`
  flex: 1;
  padding: 16px;
  background: none;
  border: none;
  color: ${props => props.active ? '#E91E63' : 'white'};
  font-size: 16px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: #E91E63;
    display: ${props => props.active ? 'block' : 'none'};
  }
`;

const Feed = styled.div`
  padding: 20px;
`;

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('for-you');
  const { user } = useAuthContext();
  

  return (
    <HomeContainer>
      <Sidebar>
        <NavItem to="/home">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/>
          </svg>
          Home
        </NavItem>
        <NavItem to={`/profile/${user?.username}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          Profile
        </NavItem>
        <NavItem to="/films">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
          </svg>
          Films
        </NavItem>
        <NavItem to="/books">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
          </svg>
          Books
        </NavItem>
        <NavItem to="/games">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
          Games
        </NavItem>
      </Sidebar>

      <MainContent>
        <FeedToggle>
          <TabButton 
            active={activeTab === 'for-you'} 
            onClick={() => setActiveTab('for-you')}
          >
            For You
          </TabButton>
          <TabButton 
            active={activeTab === 'following'} 
            onClick={() => setActiveTab('following')}
          >
            Following
          </TabButton>
        </FeedToggle>
        <Feed>
          {/* Feed content will go here */}
          {/* We'll need to create a ReviewCard component next */}
          <ReviewCard
            user={{
              name: "John Doe",
              username: "johndoe",
              avatar: "https://via.placeholder.com/48"
            }}
            media={{
              title: "Inception",
              type: MediaType.MOVIE
            }}
            rating={4.5}
            content="This movie blew my mind! The visual effects and storyline are incredible..."
            timestamp="2h ago"
            likes={42}
            comments={12}
          />
        </Feed>
      </MainContent>
    </HomeContainer>
  );
};

export default Home;