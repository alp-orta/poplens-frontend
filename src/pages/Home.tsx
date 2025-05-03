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
import { useLocation, useNavigate } from 'react-router-dom';

const FeedToggle = styled.div`
  display: flex;
  border-bottom: 1px solid #38444d;
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #15202B; // Match your app's background color
  width: 100%;
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
  padding-top: 16px; // Adjusted padding for better spacing
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  margin-top: 10px;
  border-top: 1px solid #38444d;
`;
const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('following');
  const { user } = useAuthContext();
  const feedService = useFeedService();
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [reviews, setReviews] = useState<ReviewProfileDetail[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Refs
  const observer = useRef<IntersectionObserver>();
  const loadedPagesRef = useRef<Set<number>>(new Set());
  const initialLoadCompletedRef = useRef(false);
  const fetchInProgressRef = useRef(false);
  const restoredFromNavigationRef = useRef(false);
  const currentScrollPositionRef = useRef(0);

  const [followingTabState, setFollowingTabState] = useState({
    reviews: [] as ReviewProfileDetail[],
    page: 1,
    hasMore: true,
    loadedPages: new Set<number>(),
    scrollPosition: 0
  });

  const [forYouTabState, setForYouTabState] = useState({
    reviews: [] as ReviewProfileDetail[],
    page: 1,
    hasMore: true,
    loadedPages: new Set<number>(),
    scrollPosition: 0
  });

  // Track scroll position in real-time
  useEffect(() => {
    // Update scroll position whenever user scrolls
    const handleScroll = () => {
      currentScrollPositionRef.current = window.scrollY;
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const restoreScrollPosition = (position: number) => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.scrollTo(0, position);
      }, 10);
    });
  };

  // 1. RESTORATION LOGIC - Only run once when component mounts
  useEffect(() => {
    // Check if we're returning with preserved state
    if (location.state?.preserved) {
      // Restore all state from navigation
      setReviews(location.state.reviews || []);
      setPage(location.state.page || 1);
      setHasMore(location.state.hasMore !== false);
      loadedPagesRef.current = new Set(location.state.loadedPages || [1]);

      // FLAG THAT RESTORATION HAPPENED - this is the key change
      restoredFromNavigationRef.current = true;

      // Restore scroll position AFTER the DOM updates
      const scrollPos = location.state.scrollPosition || 0;
      restoreScrollPosition(scrollPos);
    } else {
      // Fresh load - reset everything
      setReviews([]);
      setPage(1);
      setHasMore(true);
      loadedPagesRef.current = new Set();
      initialLoadCompletedRef.current = false;
    }
  }, []); // Empty dependency array - run ONCE on mount

  // Fetch the current page
  const fetchReviews = async () => {
    // Use the ref for synchronous checking
    if (fetchInProgressRef.current) return;

    if (
      !user?.profileId ||
      loadedPagesRef.current.has(page)
    ) {
      return;
    }

    // Set both the ref (synchronous) and state (async)
    fetchInProgressRef.current = true;
    setLoading(true);

    try {
      const response = await feedService.getFollowerFeed(user.profileId, page);
      const newReviews = response.data.result;

      setReviews(prev => [...prev, ...newReviews]);
      setHasMore(newReviews.length > 0);
      loadedPagesRef.current.add(page);
      initialLoadCompletedRef.current = true;
    } catch (e) {
      console.error('Failed to fetch reviews:', e);
      setHasMore(false);
    } finally {
      // Reset both tracking mechanisms
      fetchInProgressRef.current = false;
      setLoading(false);
    }
  };

  // 2. FETCH LOGIC - Only fetches new pages when needed
  useEffect(() => {
    // Skip if:
    // - We're loading
    // - No user
    // - This page is already loaded
    fetchReviews();
  }, [page, user?.profileId]);

  // Track current tab scroll position
  useEffect(() => {
    // Save scroll position when switching tabs
    return () => {
      if (activeTab === 'following') {
        setFollowingTabState(prev => ({
          ...prev,
          scrollPosition: window.scrollY
        }));
      } else {
        setForYouTabState(prev => ({
          ...prev,
          scrollPosition: window.scrollY
        }));
      }
    };
  }, [activeTab]);

  // Modified TAB SWITCH LOGIC - Restore state instead of resetting
  useEffect(() => {
    if (restoredFromNavigationRef.current) {
      restoredFromNavigationRef.current = false; // Reset for future tab changes
      return;
    }
    // Save current tab state before switching
    if (activeTab === 'for-you') {
      // Switching FROM following tab, save its state
      setFollowingTabState({
        reviews,
        page,
        hasMore,
        loadedPages: loadedPagesRef.current,
        scrollPosition: currentScrollPositionRef.current
      });

      // Restore "For You" tab state
      setReviews(forYouTabState.reviews);
      setPage(forYouTabState.page);
      setHasMore(forYouTabState.hasMore);
      loadedPagesRef.current = forYouTabState.loadedPages;

      // Restore scroll position after render
      restoreScrollPosition(forYouTabState.scrollPosition);

    } else {
      // Switching FROM "For You" tab, save its state
      setForYouTabState({
        reviews,
        page,
        hasMore,
        loadedPages: loadedPagesRef.current,
        scrollPosition: currentScrollPositionRef.current
      });

      // Restore Following tab state
      setReviews(followingTabState.reviews);
      setPage(followingTabState.page);
      setHasMore(followingTabState.hasMore);
      loadedPagesRef.current = followingTabState.loadedPages;

      // Restore scroll position after render
      restoreScrollPosition(followingTabState.scrollPosition);
      
    }

    // If the tab we're switching to has no data yet, fetch it
    if ((activeTab === 'following' && followingTabState.reviews.length === 0) ||
      (activeTab === 'for-you' && forYouTabState.reviews.length === 0)) {
      // Clean slate for new tab with no data
      setReviews([]);
      setPage(1);
      setHasMore(true);
      loadedPagesRef.current = new Set();

      // Fetch if needed (for following tab only for now)
      if (activeTab === 'following' && user?.profileId) {
        setTimeout(() => fetchReviews(), 0);
      }
    }
  }, [activeTab]);

  // 4. INTERSECTION OBSERVER - For infinite scrolling
  const lastReviewElementRef = useCallback((node: HTMLDivElement) => {
    if (loading || !hasMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        const nextPage = page + 1;
        if (!loadedPagesRef.current.has(nextPage)) {
          setPage(nextPage);
        }
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, page]);

  // 5. NAVIGATION HANDLER - Save all state when navigating to a review
  const handleViewComments = (reviewId: string) => {
    navigate(`/reviews/${reviewId}`, {
      state: {
        preserved: true,
        reviews,
        page,
        hasMore,
        loadedPages: Array.from(loadedPagesRef.current),
        scrollPosition: window.scrollY,
        from: location,
      }
    });
  };

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
                  onViewComments={handleViewComments}
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