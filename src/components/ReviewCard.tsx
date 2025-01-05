import styled from 'styled-components';
import { MediaType } from '../models/MediaType';

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
  margin-bottom: 12px;
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

const MediaInfo = styled.div`
  color: #8899a6;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Rating = styled.div`
  color: #E91E63;
  font-weight: bold;
`;

const ReviewContent = styled.p`
  color: white;
  margin: 12px 0;
  line-height: 1.5;
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

interface ReviewCardProps {
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  media: {
    title: string;
    type: MediaType;
  };
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
  return (
    <Card>
      <UserInfo>
        <Avatar src={user.avatar} alt={user.name} />
        <UserDetails>
          <DisplayName>{user.name}</DisplayName>
          <Username>@{user.username}</Username>
        </UserDetails>
      </UserInfo>

      <MediaInfo>
        Reviewing {media.type}: <strong>{media.title}</strong>
        <Rating>★ {rating}/5</Rating>
      </MediaInfo>

      <ReviewContent>{content}</ReviewContent>

      <ActionButtons>
        <ActionButton>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          {likes}
        </ActionButton>
        <ActionButton>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
          </svg>
          {comments}
        </ActionButton>
        <ActionButton>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
          </svg>
        </ActionButton>
      </ActionButtons>
      
      <Timestamp>{timestamp}</Timestamp>
    </Card>
  );
};

export default ReviewCard;