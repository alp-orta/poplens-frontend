import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ReviewCard from '../components/ReviewCard';
import { MediaType } from '../models/MediaType';
import { useParams } from 'react-router-dom';


const ProfileContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #15202B;
  color: white;
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 600px;
  border-right: 1px solid #38444d;
`;

const ProfileHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #38444d;
`;

const CoverImage = styled.div`
  height: 200px;
  background-color: #192734;
  position: relative;
`;

const Avatar = styled.img`
  width: 134px;
  height: 134px;
  border-radius: 50%;
  border: 4px solid #15202B;
  position: absolute;
  bottom: -66px;
  left: 16px;
`;

const ProfileInfo = styled.div`
  margin-top: 66px;
  padding: 16px;
`;

const UserName = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const UserHandle = styled.div`
  color: #8899a6;
  margin-bottom: 12px;
`;

const Stats = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 12px;
`;

const StatItem = styled.div`
  color: #8899a6;
  
  span {
    color: white;
    font-weight: bold;
    margin-right: 4px;
  }
`;

const FollowButton = styled.button`
  float: right;
  padding: 8px 16px;
  border-radius: 20px;
  background-color: #E91E63;
  color: white;
  border: none;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background-color: #C2185B;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #38444d;
`;

const Tab = styled.button<{ active?: boolean }>`
  flex: 1;
  padding: 16px;
  background: none;
  border: none;
  color: ${props => props.active ? '#E91E63' : 'white'};
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

interface ProfileData {
    name: string;
    username: string;
    avatar: string;
    following: number;
    followers: number;
    reviews: number;
  }

const Profile: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const [activeTab, setActiveTab] = useState<'reviews' | 'likes'>('reviews');
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
  
  const mockReviews = [
    {
      user: {
        name: "John Doe",
        username: "johndoe",
        avatar: "https://via.placeholder.com/48"
      },
      media: {
        title: "Inception",
        type: MediaType.MOVIE
      },
      rating: 4.5,
      content: "This movie blew my mind!",
      timestamp: "2h ago",
      likes: 42,
      comments: 12
    },
    // Add more mock reviews as needed
  ];

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        const mockData: ProfileData = {
          name: "John Doe",
          username: username || "",
          avatar: "https://via.placeholder.com/134",
          following: 542,
          followers: 1234,
          reviews: 89
        };
        setProfileData(mockData);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profileData) {
    return <div>Profile not found</div>;
  }

  return (
    <ProfileContainer>
      <MainContent>
        <ProfileHeader>
          <CoverImage>
            <Avatar src="https://via.placeholder.com/134" alt="Profile" />
          </CoverImage>
          <ProfileInfo>
            <FollowButton 
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </FollowButton>
            <UserName>John Doe</UserName>
            <UserHandle>@johndoe</UserHandle>
            <Stats>
              <StatItem><span>542</span> Following</StatItem>
              <StatItem><span>1,234</span> Followers</StatItem>
              <StatItem><span>89</span> Reviews</StatItem>
            </Stats>
          </ProfileInfo>
        </ProfileHeader>

        <TabsContainer>
          <Tab 
            active={activeTab === 'reviews'} 
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </Tab>
          <Tab 
            active={activeTab === 'likes'} 
            onClick={() => setActiveTab('likes')}
          >
            Likes
          </Tab>
        </TabsContainer>

        {mockReviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </MainContent>
    </ProfileContainer>
  );
};

export default Profile;