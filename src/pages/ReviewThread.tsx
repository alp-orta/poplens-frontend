import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useReviewService from '../hooks/useReviewService';
import { Review } from '../models/Review/Review';
import { ReviewDetail } from '../models/Review/ReviewDetail';
import { MediaType } from '../models/MediaType';
import CommentSection from '../components/CommentSection';
import LoadingSpinner from '../components/LoadingSpinner';
import ReviewCard from '../components/ReviewCard';

const ThreadContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #8899a6;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 10px 0;
  margin-bottom: 20px;
  
  &:hover {
    color: #DB216D;
  }
`;

const ThreadHeader = styled.h2`
  color: white;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #38444d;
`;

interface ReviewThreadParams {
  reviewId: string;
}

const ReviewThread: React.FC = () => {
  const { reviewId } = useParams<keyof ReviewThreadParams>() as ReviewThreadParams;
  const navigate = useNavigate();
  const location = useLocation();
  const reviewService = useReviewService();
  const [review, setReview] = useState<ReviewDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to convert mediaType string to proper enum value
  const getMediaType = (typeString: string | undefined): MediaType => {
    if (!typeString) return MediaType.FILM; // Default fallback
    
    // Convert string to enum
    switch (typeString.toUpperCase()) {
      case 'FILM':
        return MediaType.FILM;
      case 'BOOK':
        return MediaType.BOOK;
      case 'GAME':
        return MediaType.GAME;
      default:
        return MediaType.FILM; // Default fallback
    }
  };

  useEffect(() => {
    const fetchReview = async () => {
      if (!reviewId) return;
      
      try {
        setIsLoading(true);
        // You would need to add a getReviewById method to your useReviewService
        const response = await reviewService.getReviewDetail(reviewId);
        setReview(response.data);
      } catch (err) {
        setError('Failed to load review');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReview();
  }, [reviewId]);

  const handleBack = () => {
    // Check if we have state from previous location
    if (location.state && location.state.from) {
      // Navigate back to the previous location with preserved state
      navigate(location.state.from.pathname, { 
        state: { 
          ...location.state,
          preserved: true, // Flag to indicate this is a return navigation
          scrollPosition: location.state.scrollPosition 
        },
        replace: true
      });
    } else {
      // Default fallback if no state available
      navigate(-1);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !review) {
    return <ThreadContainer>{error || 'Review not found'}</ThreadContainer>;
  }

  return (
    <ThreadContainer>
      <BackButton onClick={handleBack}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
        Back
      </BackButton>
      
      <ThreadHeader>Review</ThreadHeader>
      
      {/* Display the review itself */}
      <ReviewCard
        id={review.id}
        mediaId={review.mediaId}
        profileId={review.profileId}
        user={{
          name: review.username || '',
          username: review.username || '',
          avatar: "https://secure.gravatar.com/avatar/?s=134&d=identicon"
        }}
        media={{
          title: review.mediaTitle || '',
          type: getMediaType(review.mediaType),
          cachedImagePath: review.mediaCachedImagePath || '',
          creator: review.mediaCreator || '',
        }}
        rating={review.rating}
        content={review.content}
        timestamp={new Date(review.createdDate).toLocaleDateString()}
        likes={0}
        comments={0}
      />
      
      {/* Display comment section */}
      <CommentSection reviewId={review.id} />
    </ThreadContainer>
  );
};

export default ReviewThread;