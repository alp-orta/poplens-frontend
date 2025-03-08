import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ReviewCard from '../components/ReviewCard';
import { MediaType } from '../models/MediaType';
import { useParams } from 'react-router-dom';
import { Review } from '../models/profile/Review';
import { useAuthContext } from '../managers/AuthContext';
import { Profile } from '../models/profile/Profile';
import useProfileService from '../hooks/useProfileService';
import LoadingSpinner from '../components/LoadingSpinner';


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
const ReviewsContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuthContext();
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'reviews' | 'likes'>('reviews');
  const [isFollowing, setIsFollowing] = useState(false);
  const profileService = useProfileService();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await profileService.getProfile(user?.profileId || '');
        setProfileData(response.data);
        setIsFollowing(response.data.followers.some(
          f => f.followerId === user?.profileId
        ));
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.profileId) {
      fetchProfile();
    }
  }, [user?.profileId]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>{error}</div>;
  if (!profileData) return <div>No profile data found</div>;


  return (
    <>
      <ProfileHeader>
        <CoverImage>
          <Avatar src="https://secure.gravatar.com/avatar/?s=134&d=identicon" alt="Profile" />
        </CoverImage>
        <ProfileInfo>
          {profileData.userId !== user?.userId  && <FollowButton 
            onClick={() => setIsFollowing(!isFollowing)}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </FollowButton>}
          <UserName>{username}</UserName>
          <UserHandle>@{username}</UserHandle>
          <Stats>
            <StatItem>
              <span>{profileData.following.length}</span> Following
            </StatItem>
            <StatItem>
              <span>{profileData.followers.length}</span> Followers
            </StatItem>
            <StatItem>
              <span>{profileData.reviews.length}</span> Reviews
            </StatItem>
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
      </TabsContainer>

      {activeTab === 'reviews' && (
        <ReviewsContainer>
          {profileData.detailedReviews.map(review => (
            <ReviewCard
              key={review.id}
              user={{
                name: username || '',
                username: username || '',
                avatar: "https://secure.gravatar.com/avatar/?s=134&d=identicon"
              }}
              media={{
                title: review.mediaTitle,
                type: review.mediaType as MediaType,
                cachedImagePath: review.mediaCachedImagePath,
                creator: review.mediaCreator,
              }}
              rating={review.rating}
              content={review.content}
              timestamp={new Date(review.createdDate).toLocaleDateString()}
              likes={0} // TODO: Add likes to review model
              comments={0} // TODO: Add comments to review model
            />
          ))}
        </ReviewsContainer>
      )}
    </>
  );
};

export default UserProfile;