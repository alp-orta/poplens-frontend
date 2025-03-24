import styled from 'styled-components';
import { MediaType } from '../models/MediaType';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import useReviewService from '../hooks/useReviewService';
import { useAuthContext } from '../managers/AuthContext';

const Card = styled.div`
  border-bottom: 1px solid #38444d;
  padding: 16px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.03);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 18px;
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const DisplayName = styled.span`
  font-weight: bold;
  color: white;
`;

const Username = styled.span`
  color: #8899a6;
`;

const Rating = styled.div`
  color: #E91E63;
  font-weight: bold;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 12px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #8899a6;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #E91E63;
  }
`;

const Timestamp = styled.span`
  color: #8899a6;
  font-size: 14px;
`;

const MediaSection = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
`;

const MediaCover = styled.img`
  width: 80px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
`;

const MediaTitle = styled.strong`
  color: white;
  font-size: 16px;
`;

const MediaContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;             // Add this
  overflow: hidden;         // Add this
`;

const MediaInfo = styled.div`
  color: #8899a6;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
`;

const ReviewContent = styled.p`
  color: white;
  margin: 8px 0;
  line-height: 1.5;
  word-wrap: break-word;      // Add this
  overflow-wrap: break-word;  // Add this
  max-width: 100%;           // Add this
  white-space: pre-wrap;     // Add this
`;

const DisplayLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  
  &:hover {
    text-decoration: underline;
  }
`;

const UsernameLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const AvatarLink = styled(Link)`
  display: block;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: relative;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  color: white;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: rgba(233, 30, 99, 0.1);
    color: #E91E63;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

// Update the ThreeDotButton to have less bottom padding
const ThreeDotButton = styled.button`
  background: none;
  border: none;
  color: #8899a6;
  cursor: pointer;
  padding: 8px 8px 8px 8px; // Reduced bottom padding
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;

  ${Card}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: rgba(233, 30, 99, 0.1);
    color: #E91E63;
  }
`;
const DropdownContainer = styled.div`
  position: relative;
  
  &:hover > div {
    display: block;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 60%; // Changed from 100% to bring it closer
  right: 0;
  background-color: #192734;
  border-radius: 8px;
  border: 1px solid #38444d;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 10;
  min-width: 150px;
  display: none;
  margin-top: -5px; // Added negative margin to move it up
`;

interface MediaInfoProps {
  type: MediaType;
  title: string;
  creator: string;
  cachedImagePath: string;
}
interface ReviewCardProps {
  id: string;
  mediaId: string;
  profileId: string; // Add this for permission checking
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  media: MediaInfoProps;
  rating: number;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  onDelete?: () => void; // Add callback for when review is deleted
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  id,
  mediaId,
  profileId,
  user,
  media,
  rating,
  content,
  timestamp,
  likes,
  comments,
  onDelete
}) => {
  const { user: currentUser } = useAuthContext();
  const reviewService = useReviewService();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isOwnReview = currentUser?.profileId === profileId;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDeleteReview = async () => {
    if (!currentUser?.profileId) return;

    try {
      await reviewService.deleteReview(currentUser.profileId, mediaId);
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
      // Optionally add error handling UI
    } finally {
      setShowDropdown(false);
    }
  };

  const getCoverImageUrl = (media: MediaInfoProps): string => {
    switch (media.type) {
      case MediaType.GAME:
        return `https://images.igdb.com/igdb/image/upload/t_cover_big${media.cachedImagePath}`;
      case MediaType.BOOK:
        return `https://books.google.com/books/content?id=${media.cachedImagePath}&printsec=frontcover&img=1&zoom=1`;
      case MediaType.FILM:
        return `https://image.tmdb.org/t/p/w500${media.cachedImagePath}`;
      default:
        return '';
    }
  };

  const getCreatorInfo = (media: MediaInfoProps): string => {
    switch (media.type) {
      case MediaType.FILM:
        return media.creator ? `Directed by ${media.creator}` : '';
      case MediaType.BOOK:
        return media.creator ? `Written by ${media.creator}` : '';
      case MediaType.GAME:
        return media.creator ? `Published by ${media.creator}` : '';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <UserInfo>
          <AvatarLink to={`/profile/${user.username}`}>
            <Avatar src={user.avatar} alt={user.name} />
          </AvatarLink>
          <UserDetails>
            <DisplayLink to={`/profile/${user.username}`}>
              <DisplayName>
                {user.name}
              </DisplayName>
            </DisplayLink>
            <UsernameLink to={`/profile/${user.username}`}>
              <Username>
                @{user.username}
              </Username>
            </UsernameLink>
          </UserDetails>
        </UserInfo>
        
        {isOwnReview && (
          <DropdownContainer>
            <ThreeDotButton>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </ThreeDotButton>
            
            <DropdownMenu>
              <MenuItem onClick={handleDeleteReview}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
                Delete
              </MenuItem>
            </DropdownMenu>
          </DropdownContainer>
        )}
      </CardHeader>

      <MediaSection>
        <MediaCover src={getCoverImageUrl(media)} alt={media.title} />
        <MediaContent>
          <MediaInfo>
            <MediaTitle>{media.title}</MediaTitle>
            <div>{getCreatorInfo(media)}</div>
            <Rating>★ {rating}/5</Rating>
          </MediaInfo>
          <ReviewContent>{content}</ReviewContent>
        </MediaContent>
      </MediaSection>


      <ActionButtons>
        <ActionButton>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {likes}
        </ActionButton>
        <ActionButton>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
          </svg>
          {comments}
        </ActionButton>
        <Timestamp>{timestamp}</Timestamp>
      </ActionButtons>
    </Card>
  );
};

export default ReviewCard;