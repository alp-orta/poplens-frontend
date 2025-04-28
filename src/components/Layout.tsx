import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuthContext } from '../managers/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/PopLensLogo.png';
import ReviewModal from './ReviewModal';
import useSearchService from '../hooks/useSearchService';
import Media from '../models/Media/Media';
import { User } from '../models/User';
import { MediaType } from '../models/MediaType';


const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #15202B;
  color: white;
  padding-left: 10%;
`;
const MainContent = styled.main`
  flex: 1;
  max-width: 600px;
  border-right: 1px solid #38444d;
  margin-left: 20%; // Match Sidebar width
  margin-right: 25%; // Match RightSidebar width
`;
const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;
const SearchBar = styled.input`
  width: 100%;
  padding: 12px 45px;
  border-radius: 25px;
  border: none;
  background-color: #273340;
  color: white;
  font-size: 15px;

  &::placeholder {
    color: #8899a6;
  }

  &:focus {
    outline: none;
    background-color: #15202B;
    border: 1px solid #E91E63;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #8899a6;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: white;
  text-decoration: none;
  font-size: 20px;
  border-radius: 25px;
  margin: 4px 0;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(233, 30, 99, 0.1);
  }
`;

const LogoContainer = styled.div`
  padding: 12px 16px;
  margin-bottom: 4px 0;
  
  img {
    width: 100px;
    height: 25px;
  }
`;

const LogButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 16px;
  color: white;
  text-decoration: none;
  font-style: italic;
  font-size: 20px;
  border-radius: 25px;
  margin: 4px 0;
  margin-top: 20px;
  border: none;
  width: 100%;
  cursor: pointer;
  position: relative; // Add this
  overflow: hidden; // Add this
  transition: transform 0.2s;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(0deg, rgba(233,30,99,0.9), rgba(194,24,91,0.9));
    z-index: 1;
  }

  span {
    position: relative;
    z-index: 2;
  }

  &:hover {
    transform: scale(1.02);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #192734;
  border-radius: 8px;
  border: 1px solid #38444d;
  display: none;
  z-index: 1000;
`;
const ProfileContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const ThreeDots = styled.button`
  background: none;
  border: none;
  color: #8899a6;
  padding: 8px;
  cursor: pointer;
  margin-left: auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  width: 32px;
  height: 32px;
  min-width: 32px;
  position: relative;
  
  ${ProfileContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: rgba(233, 30, 99, 0.1);
    color: #E91E63;
  }

  &:hover + ${DropdownMenu}, &:hover ~ ${DropdownMenu}, & ~ ${DropdownMenu}:hover {
    display: block;
  }
`;
const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  color: white;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: rgba(233, 30, 99, 0.1);
    color: #E91E63;
  }
`;

const SidebarCurtain = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(4px);
  background: rgba(21,32,43,0.7);
  z-index: 10;
`;

// Add new styled component for main content login prompt
const MainLoginPrompt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 20px;

  h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: white;
  }
`;
const LoginLink = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(0deg, rgba(233,30,99,0.9), rgba(194,24,91,0.9));
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: bold;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const LeftSidebar = styled.div`
  width: 18%;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 10%; // Match the LayoutContainer padding-left
  height: 100vh;
  border-right: 1px solid #38444d;
  overflow-y: auto; // Allow scrolling if content is too tall
`;

const RightSidebar = styled.div`
  width: 25%;
  padding: 20px;
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  overflow-y: auto; // Allow scrolling if content is too tall
`;

const ResultTitle = styled.span`
  font-weight: bold;
  color: white;
`;

const ResultSubtitle = styled.span`
  font-size: 12px;
  color: #8899a6;
`;

const ResultCategory = styled.div`
  padding: 8px 16px;
  font-weight: bold;
  color: #8899a6;
  background-color: #15202B;
`;

const NoResults = styled.div`
  padding: 16px;
  text-align: center;
  color: #8899a6;
`;

const SearchResults = styled.div`
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  background-color: #192734;
  border-radius: 8px;
  border: 1px solid #38444d;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  max-height: 500px;
  overflow-y: auto;
  z-index: 100;
`;

const SearchResultItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #38444d;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(233, 30, 99, 0.1);
  }
`;

const ResultImage = styled.img<{ isUser?: boolean }>`
  width: ${props => props.isUser ? '40px' : '30px'};
  height: ${props => props.isUser ? '40px' : '45px'};
  border-radius: ${props => props.isUser ? '50%' : '4px'};
  object-fit: cover;
  background-color: #192734;
`;

const ResultInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0; // This helps with text overflow
`;

const Layout: React.FC = () => {
  const { user, logout } = useAuthContext();
  const location = useLocation();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ media: Media[], users: any[] }>({ media: [], users: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const searchService = useSearchService();
  const navigate = useNavigate();
  // Add this function to handle new reviews
  const onReviewPosted = (newReview: any) => {
    // If the current profile matches the logged-in user
    if (window.location.pathname.includes(`/profile/${user?.username}`)) {
      // We need to update the profile data
      // This is a simple approach - for more complex needs, use state management
      window.dispatchEvent(new CustomEvent('review-posted', { detail: newReview }));
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults({ media: [], users: [] });
        return;
      }
      
      try {
        setIsSearching(true);
        const response = await searchService.searchMediaAndUsers(searchQuery);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    };
    
    // Debounce search input
    const timeoutId = setTimeout(handleSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle navigation to media or user page
  const handleResultClick = (item: Media | User, isUser: boolean) => {
    setShowResults(false);
    setSearchQuery('');
    
    if (isUser) {
      navigate(`/profile/${(item as any).userName}`);
    } else {
      const media = item as Media;
      const mediaPath = `/${getMediaPath(media.type)}/${media.title.replace(/ /g, '-').toLowerCase()}`;
      navigate(mediaPath, { state: { media } });
    }
  };
  
  // Helper function to get media type path
  const getMediaPath = (type: MediaType): string => {
    switch (type) {
      case MediaType.FILM: return 'films';
      case MediaType.BOOK: return 'books';
      case MediaType.GAME: return 'games';
      default: return '';
    }
  };
  
  // Helper function to get cover image URL
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

  return (
    <LayoutContainer>
      <LeftSidebar>
        {!user && (
          <SidebarCurtain />
        )}
        <LogoContainer>
          <img src={logo} alt="PopLens Logo" />
        </LogoContainer>
        <NavItem to="/home">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
          </svg>
          Home
        </NavItem>
        <NavItem to={`/profile/${user?.username}`}>
          <ProfileContainer>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              Profile
            </div>
            <ThreeDots>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </ThreeDots>
            <DropdownMenu>
              <DropdownItem onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                </svg>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </ProfileContainer>
        </NavItem>
        <NavItem to="/films">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
          </svg>
          Films
        </NavItem>
        <NavItem to="/books">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
          </svg>
          Books
        </NavItem>
        <NavItem to="/games">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
          </svg>
          Games
        </NavItem>
        <LogButton as="button" onClick={() => setIsReviewModalOpen(true)}>
          <span>Pop a Review!</span>
        </LogButton>
      </LeftSidebar>
      <MainContent>
        {!user && !isAuthPage && (
          <MainLoginPrompt>
            <h2>Sign in to use all features</h2>
            <LoginLink to="/login">Sign In</LoginLink>
          </MainLoginPrompt>
        )}
        {(user || (!user && isAuthPage)) && <Outlet />}
      </MainContent>
      <RightSidebar>
        {!user && (
          <SidebarCurtain />
        )}
        <SearchContainer ref={searchContainerRef}>
          <SearchIcon>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </SearchIcon>
          <SearchBar
            type="text"
            placeholder="Search PopLens"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
          />
          {showResults && searchQuery.trim().length >= 2 && (
            <SearchResults>
              {isSearching ? (
                <NoResults>Searching...</NoResults>
              ) : (
                <>
                  {searchResults.media.length === 0 && searchResults.users.length === 0 ? (
                    <NoResults>No results found</NoResults>
                  ) : (
                    <>
                      {searchResults.media.length > 0 && (
                        <>
                          <ResultCategory>Media</ResultCategory>
                          {searchResults.media.map(media => (
                            <SearchResultItem 
                              key={`media-${media.id}`}
                              onClick={() => handleResultClick(media, false)}
                            >
                              <ResultImage 
                                src={getCoverImageUrl(media)} 
                                alt={media.title}
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/40x40?text=?';
                                }}
                              />
                              <ResultInfo>
                                <ResultTitle>{media.title}</ResultTitle>
                                <ResultSubtitle>
                                  {media.type === MediaType.FILM ? 'Film' : 
                                  media.type === MediaType.BOOK ? 'Book' : 'Game'}
                                  {media.type === MediaType.FILM && media.director && ` • ${media.director}`}
                                  {media.type === MediaType.BOOK && media.writer && ` • ${media.writer}`}
                                  {media.type === MediaType.GAME && media.publisher && ` • ${media.publisher}`}
                                </ResultSubtitle>
                              </ResultInfo>
                            </SearchResultItem>
                          ))}
                        </>
                      )}
                      
                      {searchResults.users.length > 0 && (
                        <>
                          <ResultCategory>Users</ResultCategory>
                          {searchResults.users.map(user => (
                            <SearchResultItem 
                              key={`user-${user.profileId}`}
                              onClick={() => handleResultClick(user, true)}
                            >
                              <ResultImage 
                                isUser={true}
                                src={"https://secure.gravatar.com/avatar/?s=40&d=identicon"} 
                                alt={user.userName}
                              />
                              <ResultInfo>
                                <ResultTitle>{user.userName}</ResultTitle>
                                <ResultSubtitle>{user.userName}</ResultSubtitle>
                              </ResultInfo>
                            </SearchResultItem>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </SearchResults>
          )}
        </SearchContainer>
      </RightSidebar>
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewPosted={onReviewPosted}
      />
    </LayoutContainer>
  );
};

export default Layout;