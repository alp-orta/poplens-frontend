import { useState } from 'react';
import styled from 'styled-components';
import ReviewCard from '../components/ReviewCard';
import { MediaType } from '../models/MediaType';
import useAuthService from '../hooks/useAuthService';
import { useAuthContext } from '../managers/AuthContext';

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
  const mockReviews = [
    {
      user: {
        name: "John Doe",
        username: "johndoe",
        avatar: "https://via.placeholder.com/48"
      },
      media: {
        title: "Inception",
        type: MediaType.FILM
      },
      rating: 4.5,
      content: "This movie blew my mind!",
      timestamp: "2h ago",
      likes: 42,
      comments: 12
    },
    // Add more mock reviews as needed
  ];

  return (
    <>
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
        {/* {mockReviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))} */}
      </Feed>
    </>
  );
};

export default Home;