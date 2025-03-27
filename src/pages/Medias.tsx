import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import useMediaService from '../hooks/useMediaService';
import { Media } from '../models/Media/Media';
import { MediaType } from '../models/MediaType';
import dayjs from 'dayjs';

const PageContainer = styled.div`
  padding: 20px;
`;

const PageTitle = styled.h1`
  color: white;
  margin-bottom: 20px;
  font-size: 28px;
`;

const SearchSection = styled.div`
  margin-bottom: 20px;
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

const FilterSection = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #8899a6;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #38444d;
  background-color: #192734;
  color: white;

  &:focus {
    outline: none;
    border-color: #E91E63;
  }
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
`;

const MediaCard = styled(Link)`
  background-color: #192734;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  text-decoration: none;

  &:hover {
    transform: scale(1.03);
  }
`;

const MediaCover = styled.img`
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
`;

const MediaInfo = styled.div`
  padding: 10px;
`;

const MediaTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 14px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MediaStats = styled.div`
  display: flex;
  justify-content: space-between;
  color: #8899a6;
  font-size: 12px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
  color: white;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 40px;
  color: #8899a6;
`;

const Year = styled.div`
  color: #8899a6;
  font-size: 12px;
  margin-bottom: 5px;
`;

interface MediaPageProps {
  mediaType: MediaType;
  title: string;
  genreOptions: string[];
}

const Medias: React.FC<MediaPageProps> = ({ mediaType, title, genreOptions }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [sortBy, setSortBy] = useState('comments-high');
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const genres = genreOptions;
  // Add ref for intersection observer
  const observer = useRef<IntersectionObserver>();

  const mediaService = useMediaService();

  // Create a reference callback for the last element
  const lastMediaElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        // Load the next page when user scrolls to bottom
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);


  const fetchMedia = async () => {
    try {
      setIsLoading(true);

      const response = await mediaService.getMediaWithFilters(mediaType, {
        searchQuery: searchQuery.length >= 2 ? searchQuery : undefined,
        yearFilter,
        genreFilter,
        sortBy,
        page,
        pageSize: 30
      });

      const newItems = response.data.result;

      if (page === 1) {
        setMediaItems(newItems);
      } else {
        setMediaItems(prev => [...prev, ...newItems]);
      }

      // Check if there are more pages
      const totalPages = Math.ceil(response.data.totalCount / response.data.pageSize);
      setHasMore(page < totalPages);

    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect for search and filter changes - reset to page 1
  useEffect(() => {
    setPage(1);
    // Use debounce for search
    const timeoutId = setTimeout(fetchMedia, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, yearFilter, genreFilter, sortBy, mediaType]);

  // Effect for page changes
  useEffect(() => {
    if (page > 1) {
      fetchMedia();
    }
  }, [page]);

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

  // Apply filters and sorting to media items
  const filteredMedia = mediaItems.filter(item => {
    // Year filter (by decade)
    if (yearFilter) {
      const decade = Math.floor(new Date(item.publishDate).getFullYear() / 10) * 10;
      const selectedDecade = parseInt(yearFilter.substring(0, 4));
      if (decade !== selectedDecade) return false;
    }

    // Genre filter
    if (genreFilter && !item.genre.includes(genreFilter)) {
      return false;
    }

    return true;
  });

  // Sort results
  const sortedMedia = [...filteredMedia].sort((a, b) => {
    switch (sortBy) {
      case 'rating-high':
        return b.avgRating - a.avgRating;
      case 'rating-low':
        return a.avgRating - b.avgRating;
      case 'comments-high':
        return b.totalReviews - a.totalReviews;
      case 'comments-low':
        return a.totalReviews - b.totalReviews;
      default:
        return 0;
    }
  });

  // Generate year options from 1870s to 2020s
  const yearOptions = [];
  for (let i = 1900; i <= 2020; i += 10) {
    yearOptions.push(`${i}s`);
  }

  const getMediaPath = (type: MediaType): string => {
    switch (type) {
      case MediaType.FILM: return 'films';
      case MediaType.BOOK: return 'books';
      case MediaType.GAME: return 'games';
      default: return '';
    }
  };

  return (
    <PageContainer>
      <PageTitle>{title}</PageTitle>

      <SearchSection>
        <SearchInput
          placeholder={`Search ${title.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchSection>

      <FilterSection>
        <FilterGroup>
          <FilterLabel>Year</FilterLabel>
          <Select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">All Years</option>
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Genre</FilterLabel>
          <Select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Sort By</FilterLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Relevance</option>
            <option value="rating-high">Rating (Highest First)</option>
            <option value="rating-low">Rating (Lowest First)</option>
            <option value="comments-high">Most Commented</option>
            <option value="comments-low">Least Commented</option>
          </Select>
        </FilterGroup>
      </FilterSection>

      {sortedMedia.length > 0 ? (
        <MediaGrid>
          {sortedMedia.map((item, index) => (
            <div
              key={item.id}
              ref={index === sortedMedia.length - 1 ? lastMediaElementRef : undefined}
            >
              <MediaCard
                to={`/${getMediaPath(item.type)}/${item.title.replace(/ /g, '-').toLowerCase()}`}
              >
                <MediaCover
                  src={getCoverImageUrl(item)}
                  alt={item.title}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150x225?text=No+Image';
                  }}
                />
                <MediaInfo>
                  <MediaTitle title={item.title}>{item.title}</MediaTitle>
                  <Year>{item.publishDate ? dayjs(item.publishDate).format('YYYY') : 'Unknown'}</Year>
                  <MediaStats>
                    <span>⭐ {item.avgRating ? item.avgRating.toFixed(1) : 'N/A'}</span>
                    <span>💬 {item.totalReviews}</span>
                  </MediaStats>
                </MediaInfo>
              </MediaCard>
            </div>
          ))}
        </MediaGrid>
      ) : searchQuery.length >= 2 ? (
        <NoResults>No results found. Try a different search term.</NoResults>
      ) : (
        <NoResults>Enter at least 2 characters to search.</NoResults>
      )
      }

      {/* Add loading indicator at bottom during pagination */}
      {
        isLoading && page > 1 && (
          <LoadingContainer>Loading more...</LoadingContainer>
        )
      }
    </PageContainer >
  );
};

export default Medias;