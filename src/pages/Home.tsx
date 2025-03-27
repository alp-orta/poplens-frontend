import styled from 'styled-components';
import ReviewCard from '../components/ReviewCard';
import { MediaType } from '../models/MediaType';
import useAuthService from '../hooks/useAuthService';
import { useAuthContext } from '../managers/AuthContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import useFeedService from '../hooks/useFeedService';
import LoadingSpinner from '../components/LoadingSpinner';
import { ReviewDetail } from '../models/Review/ReviewDetail';
import { ReviewProfileDetail } from '../models/Feed/ReviewProfileDetail';

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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  margin-top: 10px;
  border-top: 1px solid #38444d;
`;
const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('for-you');
  const { user } = useAuthContext();
  const feedService = useFeedService();

  const [reviews, setReviews] = useState<ReviewProfileDetail[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();

  const lastReviewElementRef = useCallback((node: HTMLDivElement) => {
    if (loading || !hasMore) return; // Don't observe when loading or no more data

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        // Only trigger next page load if we're not already loading
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchReviews = async () => {
    if (!user?.profileId || loading || !hasMore) return;
  
    try {
      setLoading(true);
      const response = await feedService.getFollowerFeed(user.profileId, page);
  
      const newReviews = response.data.result;
      
      // If we received empty results, stop pagination
      if (newReviews.length === 0) {
        setHasMore(false);
        return;
      }
      
      setReviews(prev => [...prev, ...newReviews]);
      
      // Simply assume there are more pages if we got results
      setHasMore(true);
      
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setHasMore(false); // Stop on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'following') {
      setReviews([]);
      setPage(1);
      setHasMore(true);
      fetchReviews();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'following' && !loading) {
      fetchReviews();
    }
  }, [page]);

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
        {activeTab === 'following' && (
          <>
            {reviews.map((review, index) => (
              <div
                ref={index === reviews.length - 1 ? lastReviewElementRef : undefined}
                key={review.id}
              >
                <ReviewCard
                  key={review.id}
                  id={review.id}
                  mediaId={review.mediaId}
                  profileId={review.profileId}
                  user={{
                    name: review.username || '',
                    username: review.username || '',
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
                  likes={0}
                  comments={0}
                 />
              </div>
            ))}
            {loading && (
              <LoadingContainer>
                <LoadingSpinner />
              </LoadingContainer>
            )}
          </>
        )}
      </Feed>
    </>
  );
};

export default Home;