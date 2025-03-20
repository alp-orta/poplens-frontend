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
import useAuthService from '../hooks/useAuthService';


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

const FollowButton = styled.button<{ isLoading?: boolean }>`
  float: right;
  padding: 8px 16px;
  border-radius: 20px;
  background-color: ${props => props.isLoading ? '#7d1038' : '#E91E63'};
  color: white;
  border: none;
  font-weight: bold;
  cursor: ${props => props.isLoading ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.isLoading ? 0.7 : 1};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.isLoading ? '#7d1038' : '#C2185B'};
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
  const [profileData, setProfileData] = useState<Profile>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'reviews' | 'likes'>('reviews');
  const [isFollowing, setIsFollowing] = useState(false);
  const profileService = useProfileService();
  const userAuthService = useAuthService();
  const [profileId, setProfileId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [isFollowLoading, setIsFollowLoading] = useState(false);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // First get the profileId for the username in the URL
        let currentProfileId = "";
        let currentUserId = "";
        if (user && username === user.username) {
          // If the user is viewing their own profile, use the profileId from the user object
          currentProfileId = user.profileId;
          currentUserId = user.userId;
        } else {
          // If the user is viewing someone else's profile, fetch the profileId from the username
          const profileResponse = await userAuthService.fetchIdsFromUsername(username || '');
          currentProfileId = profileResponse.data.profileId;
          currentUserId = profileResponse.data.userId;
        }
        setProfileId(currentProfileId);
        setUserId(currentUserId);

        // Then fetch the full profile data using that profileId
        const response = await profileService.getProfile(currentProfileId);
        setProfileData(response.data);

        // Check if the logged-in user is following this profile
        if (user && user.profileId) {
          setIsFollowing(response.data.followers.some(
            f => f.followerId === user.profileId
          ));
        }
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username, user?.profileId]);

  const handleFollowClick = async () => {
    if (!user?.profileId || !profileId) return;

    try {
      setIsFollowLoading(true);
      if (isFollowing) {
        await profileService.unfollowUser(user.profileId, profileId);
      } else {
        await profileService.followUser(user.profileId, profileId);
      }
      setIsFollowing(!isFollowing);

      // Update follower count in profileData
      if (profileData) {
        setProfileData((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            followers: isFollowing
              ? prev.followers.filter((f: any) => f.followerId !== user.profileId)
              : [...prev.followers, { followerId: user.profileId }]
          };
        });
      }
    } catch (error) {
      console.error('Failed to follow user:', error);
      // Optionally add error handling UI here
    } finally {
      setIsFollowLoading(false);
    }
  };

  useEffect(() => {
    // Event listener for new reviews
    const handleNewReview = (event: CustomEvent) => {
      const newReview = event.detail;
      
      if (profileData && user?.username === username) {
        setProfileData((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            detailedReviews: [newReview, ...prev.detailedReviews],
            reviews: [{ id: newReview.id }, ...prev.reviews]
          };
        });
      }
    };
  
    // Add event listener
    window.addEventListener('review-posted', handleNewReview as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('review-posted', handleNewReview as EventListener);
    };
  }, [profileData, username, user?.username]);

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
          {profileData.userId !== user?.userId && <FollowButton
            onClick={handleFollowClick}
            isLoading={isFollowLoading}
            disabled={isFollowLoading}>
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