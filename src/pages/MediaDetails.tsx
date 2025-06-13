import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Media } from '../models/Media/Media';
import { MediaType } from '../models/MediaType';
import { Review } from '../models/Review/Review';
import useReviewService from '../hooks/useReviewService';
import ReviewCard from '../components/ReviewCard';
import dayjs from 'dayjs';
import { MediaMainPageReviewInfo } from '../models/Review/MediaMainPageReviewInfo';
import ReviewModal from '../components/ReviewModal';
import { useAuthContext } from '../managers/AuthContext';

// Styled components for the page layout
const PageContainer = styled.div`
  padding: 20px;
  color: white;
`;

const MediaHeader = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CoverContainer = styled.div`
  flex-shrink: 0;
`;

const MediaCover = styled.img`
  width: 250px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    width: 180px;
  }
`;

const MediaInfo = styled.div`
  flex: 1;
`;

const MediaTitle = styled.h1`
  font-size: 32px;
  margin: 0 0 10px 0;
`;

const MediaCreator = styled.h2`
  font-size: 18px;
  margin: 0 0 15px 0;
  color: #8899a6;
`;

const MediaDetails = styled.div`
  margin-bottom: 20px;
`;

const MediaDescription = styled.p`
  line-height: 1.6;
  margin-top: 20px;
`;

const SectionTitle = styled.h2`
  margin: 30px 0 15px 0;
  font-size: 22px;
  border-bottom: 1px solid #38444d;
  padding-bottom: 10px;
`;

const RatingChart = styled.div`
  margin: 30px 0;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const RatingLabel = styled.span`
  width: 80px;
  text-align: right;
  padding-right: 15px;
`;

const RatingBar = styled.div<{ width: number }>`
  height: 20px;
  background-color: #DB216D;
  width: ${props => props.width}%;
  border-radius: 4px;
  max-width: 100%;
  transition: width 0.3s ease;
`;

const RatingBarContainer = styled.div`
  flex: 1;
  background-color: #38444d;
  border-radius: 4px;
`;

const RatingPercentage = styled.span`
  margin-left: 10px;
  width: 50px;
`;

const ReviewsSection = styled.div`
  margin: 40px 0;
`;

const ReviewsGrid = styled.div`
  padding: 0px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 20px;
`;

const NoReviewsMessage = styled.p`
  text-align: center;
  color: #8899a6;
  padding: 40px 0;
`;

const BeFirstButton = styled.button`
  background-color: #DB216D;
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  border: none;
  font-weight: bold;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: block;
  margin: 20px auto;
  
  &:hover {
    background-color: #C2185B;
  }
`;
// This interface extends the Review interface to include user/media details for display
interface ReviewWithDetails extends Review {
    username?: string;
    mediaTitle?: string;
    mediaType?: MediaType;
    mediaCachedImagePath?: string;
    mediaCreator?: string;
}

const MediaDetailsPage: React.FC = () => {
    // Extract the media name from URL
    const { mediaName } = useParams<{ mediaName: string }>();
    const { user } = useAuthContext();
    const location = useLocation();

    // State for the component
    const [media, setMedia] = useState<Media | null>(null);
    const [reviewInfo, setReviewInfo] = useState<MediaMainPageReviewInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const reviewService = useReviewService();

    const handleReviewPosted = (newReview: any) => {
        // Update the UI with the new review
        const reviewWithUsername = {
            ...newReview,
            username: user?.username,
        };

        if (reviewInfo) {
            setReviewInfo({
                ...reviewInfo,
                recentReviews: [reviewWithUsername, ...(reviewInfo.recentReviews || [])],
                // Update rating chart data (simplified)
                ratingChartInfo: {
                    ...reviewInfo.ratingChartInfo,
                    [reviewWithUsername.rating]: (reviewInfo.ratingChartInfo[reviewWithUsername.rating] || 0) + 1
                }
            });
        } else {
            // Create new reviewInfo object if none exists
            setReviewInfo({
                ratingChartInfo: { [reviewWithUsername.rating]: 1 },
                popularReviews: [reviewWithUsername],
                recentReviews: [reviewWithUsername]
            });
        }
        
        // Close the modal after posting
        setIsReviewModalOpen(false);
    };

    const getCreatorInfo = (media: any): string => {
        switch (media.type) {
            case MediaType.FILM:
                return media.director ? `Directed by ${media.director}` : '';
            case MediaType.BOOK:
                return media.writer ? `Written by ${media.writer}` : '';
            case MediaType.GAME:
                return media.publisher ? `Published by ${media.publisher}` : '';
            default:
                return '';
        }
    };

    // Check if state was passed during navigation
    useEffect(() => {
        if (location.state && location.state.media) {
            setMedia(location.state.media);
        }
    }, [location]);

    // Fetch review information when media is available
    useEffect(() => {
        const fetchReviewInfo = async () => {
            if (!media) return;

            try {
                setIsLoading(true);
                // Add the getMediaMainPageReviewInfo method to useReviewService
                const response = await reviewService.getMediaMainPageReviewInfo(media.id);
                setReviewInfo(response.data);
            } catch (err) {
                setError('Failed to load review information');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (media) {
            fetchReviewInfo();
        }
    }, [media]);

    // Helper function to get cover image URL
    const getCoverImageUrl = (media: Media): string => {
        switch (media.type) {
            case MediaType.GAME:
                return `https://images.igdb.com/igdb/image/upload/t_cover_big${media.cachedImagePath}`;
            case MediaType.BOOK:
                return `https://books.google.com/books/content?id=${media.cachedImagePath}&printsec=frontcover&img=1&zoom=1&fife=w800`;
            case MediaType.FILM:
                return `https://image.tmdb.org/t/p/w500${media.cachedImagePath}`;
            default:
                return '';
        }
    };

    // Render the rating distribution chart
    const renderRatingChart = () => {
        if (!reviewInfo?.ratingChartInfo || Object.keys(reviewInfo.ratingChartInfo).length === 0) {
            return (
                <>
                    <NoReviewsMessage>No ratings yet</NoReviewsMessage>
                </>
            );
        }

        // Get total number of ratings
        const totalRatings = Object.values(reviewInfo.ratingChartInfo).reduce((sum, count) => sum + count, 0);

        // Create array of ratings from 5 to 1
        const ratingLevels = [5, 4, 3, 2, 1];

        return (
            <RatingChart>
                {ratingLevels.map(rating => {
                    const count = reviewInfo.ratingChartInfo[rating.toString()] || 0;
                    const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;

                    return (
                        <RatingRow key={rating}>
                            <RatingLabel>{rating} ⭐</RatingLabel>
                            <RatingBarContainer>
                                <RatingBar width={percentage} />
                            </RatingBarContainer>
                            <RatingPercentage>{percentage.toFixed(1)}%</RatingPercentage>
                        </RatingRow>
                    );
                })}
            </RatingChart>
        );
    };


    // Render a section of reviews (popular or recent)
    const renderReviewSection = (title: string, reviews: ReviewWithDetails[]) => {
        if (!reviews || reviews.length === 0) {
            return (
                <>
                    <SectionTitle>{title}</SectionTitle>
                    <NoReviewsMessage>No reviews yet</NoReviewsMessage>
                </>
            );
        }

        return (
            <ReviewsSection>
                <SectionTitle>{title}</SectionTitle>
                <ReviewsGrid>
                    {reviews.map(review => (
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
                                title: media?.title || '',
                                type: media?.type || MediaType.FILM,
                                cachedImagePath: media?.cachedImagePath || '',
                                creator: getCreatorInfo(media) || '',
                            }}
                            rating={review.rating}
                            content={review.content}
                            timestamp={new Date(review.createdDate).toLocaleDateString()}
                            likes={0}
                            comments={0}
                        />
                    ))}
                </ReviewsGrid>
            </ReviewsSection>
        );
    };

    // Show loading state
    if (isLoading && !media) {
        return <LoadingContainer>Loading...</LoadingContainer>;
    }

    // Show error state if needed
    if (error && !media) {
        return <PageContainer>{error}</PageContainer>;
    }

    // Show 404 if media not found
    if (!media) {
        return <PageContainer>Media not found</PageContainer>;
    }

    return (
        <PageContainer>
            <MediaHeader>
                <CoverContainer>
                    <MediaCover
                        src={getCoverImageUrl(media)}
                        alt={media.title}
                        onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/250x375?text=No+Image';
                        }}
                    />
                </CoverContainer>

                <MediaInfo>
                    <MediaTitle>{media.title}</MediaTitle>
                    <MediaCreator>
                        {getCreatorInfo(media)}
                    </MediaCreator>

                    <MediaDetails>
                        <div>Year: {media.publishDate ? dayjs(media.publishDate).format('YYYY') : 'Unknown'}</div>
                        <div>Genre: {media.genre || 'Uncategorized'}</div>
                        <div>Average Rating: ⭐ {media.avgRating ? media.avgRating.toFixed(1) : 'N/A'}</div>
                        <div>Total Reviews: {media.totalReviews}</div>
                    </MediaDetails>

                    <MediaDescription>
                        {media.description || 'No description available.'}
                    </MediaDescription>

                    <BeFirstButton onClick={() => setIsReviewModalOpen(true)}>
                        {(!reviewInfo || (reviewInfo.popularReviews.length === 0 && reviewInfo.recentReviews.length === 0)) 
                            ? "Be the first to review!" 
                            : "Write a review"}
                    </BeFirstButton>
                </MediaInfo>
            </MediaHeader>
            <SectionTitle>Rating Distribution</SectionTitle>
            {isLoading ? <LoadingContainer>Loading ratings...</LoadingContainer> : renderRatingChart()}

            {reviewInfo && (
                <>
                    {renderReviewSection('Popular Reviews', reviewInfo.popularReviews)}
                    {renderReviewSection('Recent Reviews', reviewInfo.recentReviews)}
                </>
            )}
            <ReviewModal 
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onReviewPosted={handleReviewPosted}
                initialMedia={media}
            />
        </PageContainer>
    );
};

export default MediaDetailsPage;