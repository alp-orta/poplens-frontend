import styled from 'styled-components';
import { MediaType } from '../models/MediaType';
import { Link } from 'react-router-dom';

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

interface MediaInfoProps {
  type: MediaType;
  title: string;
  creator: string;
  cachedImagePath: string;
}
interface ReviewCardProps {
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
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  user,
  media,
  rating,
  content,
  timestamp,
  likes,
  comments
}) => {
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
        {/* <Date>{timestamp}</Date> */}
      </UserInfo>

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