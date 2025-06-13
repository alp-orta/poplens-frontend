import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MediaType } from '../models/MediaType';
import useMediaService from '../hooks/useMediaService';
import { debounce } from 'lodash';
import Media from '../models/Media/Media';
import dayjs from 'dayjs';
import useReviewService from '../hooks/useReviewService';
import { useAuthContext } from '../managers/AuthContext';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #15202B;
  border-radius: 16px;
  width: 600px;
  max-width: 90vw;
  padding: 30px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -8px;
  right: -4px;
  background: none;
  border: none;
  color: #8899a6;
  cursor: pointer;
  font-size: 35px;
  
  &:hover {
    color: #E91E63;
  }
`;

const MediaTypeSelector = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const TypeButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  position: relative;
  aspect-ratio: 16/9;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.active ?
    'linear-gradient(0deg, rgba(219,33,109,0.8), rgba(219,33,109,0.4))' :
    'linear-gradient(0deg, rgba(0,0,0,0.8), rgba(0,0,0,0.4))'};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #38444d;
  background-color: #192734;
  color: white;
  margin-bottom: 20px;

  &:focus {
    outline: none;
    border-color: #E91E63;
  }
`;

const SearchResults = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const ResultItem = styled.div`
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #192734;
  }
`;

const StarRating = styled.div`
  display: flex;
  gap: 5px;
`;

const Star = styled.button<{ filled: boolean }>`
  background: none;
  border: none;
  color: ${props => props.filled ? '#E91E63' : '#8899a6'};
  font-size: 24px;
  cursor: pointer;
`;

const ReviewInput = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #38444d;
  background-color: #192734;
  color: white;
  resize: none;

  &:focus {
    outline: none;
    border-color: #E91E63;
  }

  // ...existing code...
  &:focus {
    outline: none;
    border-color: #E91E63;
  }

  &.limit-warning {
    border-color: #ff4d4f;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 25px;
  border: none;
  background-color: #E91E63;
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #C2185B;
  }
`;

const SelectedMediaSection = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 16px;
  background-color: #192734;
  border-radius: 8px;
`;

const CoverImage = styled.img`
  width: 150px;
  height: 225px;
  object-fit: cover;
  border-radius: 8px;
`;

const MediaDetails = styled.div`
  flex: 1;
`;

const MediaTitle = styled.h2`
  margin: 0 0 8px 0;
  font-size: 24px;
  color: white;
`;

const MediaInfo = styled.p`
  margin: 4px 0;
  color: #8899a6;
  font-size: 14px;
`;

const ReviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
`;

const TypeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TypeContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  text-align: center;
  color: white;
`;

const TypeIcon = styled.svg`
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
  display: block;
  margin: 0 auto 8px;
`;

const TypeText = styled.span`
  font-size: 18px;
  font-weight: bold;
  display: block;
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  margin-top: 8px;
  font-size: 14px;
  text-align: center;
`;

const CharacterCount = styled.div<{ count: number }>`
  text-align: right;
  color: ${props => props.count > 230 ? '#ff4d4f' : '#8899a6'};
  font-size: 12px;
  margin-top: 4px;
`;
interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewPosted?: (review: any) => void;
  initialMedia?: Media; 
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onReviewPosted, initialMedia }) => {
  const { user } = useAuthContext();
  const [selectedType, setSelectedType] = useState<MediaType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media>();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const reviewService = useReviewService();
  const mediaService = useMediaService();

  useEffect(() => {
    if (isOpen && initialMedia) {
      // Reset the form and set the media when the modal opens
      setSelectedMedia(initialMedia);
      setSelectedType(initialMedia.type);
      setRating(0); // Reset rating
      setReview(''); // Reset review content
      setSearchQuery(''); // Reset search
      setSearchResults([]); // Clear search results
    }
  }, [initialMedia, isOpen]);

  const handleSubmitReview = async () => {
    if (!selectedMedia || !rating || !review.trim() || !user?.profileId) {
      setSubmitError('Please fill in all fields');
      return;
    }
  
    try {
      setIsSubmitting(true);
      setSubmitError(null);
  
      // Post the review to the backend
      const response = await reviewService.addReview(user.profileId, {
        mediaId: selectedMedia.id,
        content: review.trim(),
        rating: rating
      });
  
      // Create a new review object that matches the structure expected by ReviewCard
      const newReview = {
        id: response.data.id || `temp-${Date.now()}`, // Use response ID or generate temporary one
        mediaTitle: selectedMedia.title,
        mediaType: selectedMedia.type,
        mediaCachedImagePath: selectedMedia.cachedImagePath,
        mediaCreator: selectedMedia.director || selectedMedia.writer || selectedMedia.publisher || '',
        rating,
        content: review.trim(),
        createdDate: new Date().toISOString(),
      };
  
      // Notify parent components about the new review
      if (onReviewPosted) {
        onReviewPosted(newReview);
      }
  
      handleClose();
    } catch (error) {
      console.error('Failed to submit review:', error);
      setSubmitError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const debouncedSearch = debounce(async (query: string, type: MediaType) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await mediaService.searchMedia(type, query);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  useEffect(() => {
    if (selectedType && searchQuery) {
      debouncedSearch(searchQuery, selectedType);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, selectedType]);

  const handleMediaSelect = (media: Media) => {
    setSelectedMedia(media);
    setSearchResults([]);
    setRating(0);
    setReview('');
    setSearchQuery('');
  };

  const getCoverImageUrl = (media: Media): string => {
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

  const resetModal = () => {
    setSelectedType(null);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedMedia(undefined);
    setRating(0);
    setReview('');
    setIsSearching(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const resetSearch = () => {
    setSelectedMedia(undefined);
    setSearchQuery('');
    setSearchResults([]);
  };


  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>×</CloseButton>

        <MediaTypeSelector>
          <TypeButton
            active={selectedType === MediaType.FILM}
            onClick={() => { resetSearch(); setSelectedType(MediaType.FILM); }}
          >
            <TypeContent>
              <TypeIcon viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
              </TypeIcon>
              <TypeText>Film</TypeText>
            </TypeContent>
          </TypeButton>

          <TypeButton
            active={selectedType === MediaType.BOOK}
            onClick={() => {
              resetSearch();
              setSelectedType(MediaType.BOOK);
            }}
          >
            <TypeContent>
              <TypeIcon viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
              </TypeIcon>
              <TypeText>Book</TypeText>
            </TypeContent>
          </TypeButton>

          <TypeButton
            active={selectedType === MediaType.GAME}
            onClick={() => {
              resetSearch();
              setSelectedType(MediaType.GAME);
            }}
          >
            <TypeContent>
              <TypeIcon viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </TypeIcon>
              <TypeText>Game</TypeText>
            </TypeContent>
          </TypeButton>
        </MediaTypeSelector>

        {selectedType && (
          <SearchInput
            placeholder="Search for a title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}

        {searchResults.length > 0 && (
          <SearchResults>
            {searchResults.map((result) => (
              <ResultItem
                key={result.id}
                onClick={() => handleMediaSelect(result)}
              >
                <div>{result.title}</div>
                {result.publishDate && <div>{dayjs(result.publishDate).format("YYYY/MM/DD")}</div>}
                {result.type === MediaType.FILM && result.director && <div>Director: {result.director}</div>}
                {result.type === MediaType.BOOK && result.writer && <div>Author: {result.writer}</div>}
                {result.type === MediaType.GAME && result.publisher && <div>Publisher: {result.publisher}</div>}
              </ResultItem>
            ))}
          </SearchResults>
        )}

        {selectedMedia && (
          <>
            <SelectedMediaSection>
              <CoverImage src={getCoverImageUrl(selectedMedia)} alt={selectedMedia.title} />
              <MediaDetails>
                <MediaTitle>{selectedMedia.title}</MediaTitle>
                {selectedMedia.publishDate && (
                  <MediaInfo>{dayjs(selectedMedia.publishDate).format("YYYY")}</MediaInfo>
                )}
                {selectedMedia.type === MediaType.FILM && selectedMedia.director && (
                  <MediaInfo>Director: {selectedMedia.director}</MediaInfo>
                )}
                {selectedMedia.type === MediaType.BOOK && selectedMedia.writer && (
                  <MediaInfo>Author: {selectedMedia.writer}</MediaInfo>
                )}
                {selectedMedia.type === MediaType.GAME && selectedMedia.publisher && (
                  <MediaInfo>Publisher: {selectedMedia.publisher}</MediaInfo>
                )}
              </MediaDetails>
            </SelectedMediaSection>

            <ReviewSection>
              <StarRating>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    filled={star <= rating}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </Star>
                ))}
              </StarRating>
              <div>
                <ReviewInput
                  placeholder="Write your review..."
                  value={review}
                  onChange={(e) => {
                    const text = e.target.value;
                    if (text.length <= 256) {
                      setReview(text);
                    }
                  }}
                  className={review.length > 230 ? 'limit-warning' : ''}
                  maxLength={256}
                />
                <CharacterCount count={review.length}>
                  {review.length}/256 characters
                </CharacterCount>
              </div>

              <SubmitButton
                onClick={handleSubmitReview}
                disabled={isSubmitting || !selectedMedia || !rating || !review.trim()}
              >
                {isSubmitting ? 'Posting...' : 'Post Review'}
              </SubmitButton>

              {submitError && (
                <ErrorMessage>
                  {submitError}
                </ErrorMessage>
              )}
            </ReviewSection>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default ReviewModal;