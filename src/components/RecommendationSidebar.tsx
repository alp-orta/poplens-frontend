import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../managers/AuthContext';
import useFeedService from '../hooks/useFeedService';
import { Media } from '../models/Media/Media';
import { MediaType } from '../models/MediaType';
import LoadingSpinner from './LoadingSpinner';


const RefreshButton = styled.button`
  background: none;
  border: none;
  color: #8899a6;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 13px;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #E91E63;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
`;

const NoResultsMessage = styled.p`
  text-align: center;
  color: #8899a6;
  padding: 10px 0;
  font-size: 13px;
`;

const MediaInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;


const MediaCreator = styled.p`
  font-size: 11px;
  margin: 3px 0 0 0;
  color: #8899a6; /* Match the muted color from ReviewCard */
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  max-width: 80px; /* Match cover width */
`;

const RecommendationsContainer = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  padding-left: 0; /* Ensure left alignment with sidebar */
  border-top: 1px solid #38444d;
`;

const MediaCover = styled.img`
  width: 80px; /* Match ReviewCard width */
  height: 120px; /* Match ReviewCard height */
  object-fit: cover;
  border-radius: 8px; /* Match ReviewCard border-radius */
  margin-bottom: 6px;
`;

const MediaList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 10px;
  margin-bottom: 20px;
`;

const MediaItem = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 80px; /* Match ReviewCard width */
  
  &:hover {
    opacity: 0.9;
  }
`;

const MediaTitle = styled.p`
  font-size: 12px;
  margin: 0;
  color: white;
  font-weight: 500;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-width: 80px; /* Match cover width */
`;

const SectionTitle = styled.h3`
  font-size: 14px; /* Reduced from 15px */
  margin-bottom: 8px; /* Reduced from 10px */
  color: #fff;
  padding-bottom: 6px;
  padding-left: 0; /* Ensure left alignment */
`;

const RecommendationsHeader = styled.h2`
  font-size: 15px; /* Reduced from 16px */
  color: #E91E63;
  margin: 0;
  padding-left: 0; /* Ensure left alignment */
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px; /* Reduced from 15px */
  padding-left: 0; /* Ensure left alignment */
`;
const MediaRecommendations: React.FC = () => {
    const { user } = useAuthContext();
    const feedService = useFeedService();
    const navigate = useNavigate();

    const [filmRecommendations, setFilmRecommendations] = useState<Media[]>([]);
    const [bookRecommendations, setBookRecommendations] = useState<Media[]>([]);
    const [gameRecommendations, setGameRecommendations] = useState<Media[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const fetchedRef = useRef(false);

    const fetchRecommendations = async (isRefresh = false) => {
        if (!user?.profileId || (fetchedRef.current && !isRefresh)) return;

        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        fetchedRef.current = true;

        try {
            // Use lowercase media types
            const [filmsResponse, booksResponse, gamesResponse] = await Promise.all([
                feedService.getMediaRecommendations(user.profileId, 'film'),
                feedService.getMediaRecommendations(user.profileId, 'book'),
                feedService.getMediaRecommendations(user.profileId, 'game')
            ]);

            setFilmRecommendations(filmsResponse.data);
            setBookRecommendations(booksResponse.data);
            setGameRecommendations(gamesResponse.data);
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();

        return () => {
            console.log('MediaRecommendations component unmounting');
        };
    }, [user?.profileId]);

    const handleRefresh = () => {
        fetchRecommendations(true);
    };

    const getMediaPath = (type: MediaType): string => {
        switch (type) {
        case MediaType.FILM: return 'films';
        case MediaType.BOOK: return 'books';
        case MediaType.GAME: return 'games';
        default: return '';
        }
    };

    const handleMediaClick = (item: Media) => {
        const path = `/${getMediaPath(item.type)}/${item.title.replace(/ /g, '-').toLowerCase()}`;
        
        navigate(path, {
            state: {
                media: item // Pass the full media object
            }
        });
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

    // Refresh icon component
    const RefreshIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
    );

    const renderMediaSection = (title: string, items: Media[]) => (
        <>
            <SectionTitle>{title}</SectionTitle>
            {items.length > 0 ? (
                <MediaList>
                    {items.slice(0, 3).map(item => (
                        <MediaItem key={item.id} onClick={() => handleMediaClick(item)}>
                            <MediaCover src={getCoverImageUrl(item)} alt={item.title} />
                            <MediaInfo>
                                <MediaTitle>{item.title}</MediaTitle>
                            </MediaInfo>
                        </MediaItem>
                    ))}
                </MediaList>
            ) : (
                <NoResultsMessage>No recommendations yet</NoResultsMessage>
            )}
        </>
    );

    return (
        <RecommendationsContainer>
            <HeaderContainer>
                <RecommendationsHeader>Recommended For You</RecommendationsHeader>
                <RefreshButton
                    onClick={handleRefresh}
                    disabled={loading || refreshing}
                    title="Refresh recommendations"
                >
                    {refreshing ? <LoadingSpinner /> : <RefreshIcon />}
                </RefreshButton>
            </HeaderContainer>

            {loading ? (
                <LoadingContainer>
                    <LoadingSpinner />
                </LoadingContainer>
            ) : (
                <>
                    {renderMediaSection('Films', filmRecommendations)}
                    {renderMediaSection('Books', bookRecommendations)}
                    {renderMediaSection('Games', gameRecommendations)}
                </>
            )}
        </RecommendationsContainer>
    );
};

export default MediaRecommendations;