import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuthContext } from '../managers/AuthContext';
import useReviewService from '../hooks/useReviewService';
import { Comment } from '../models/Review/Comment';

const CommentSectionContainer = styled.div`
  margin-top: 16px;
  border-top: 1px solid #38444d;
  padding-top: 16px;
`;

const CommentForm = styled.form`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 12px;
  background-color: #192734;
  color: white;
  border: 1px solid #38444d;
  border-radius: 4px;
  resize: none;
  font-family: inherit;
  margin-bottom: 10px;
  
  &:focus {
    outline: none;
    border-color: #E91E63;
  }
`;

const CommentButton = styled.button`
  align-self: flex-end;
  background-color: #E91E63;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background-color: #C2185B;
  }
  
  &:disabled {
    background-color: #6e6e6e;
    cursor: not-allowed;
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CommentItem = styled.div<{ isReply?: boolean }>`
  border-bottom: 1px solid #38444d;
  padding-bottom: 16px;
  padding-left: ${props => props.isReply ? '20px' : '0'};
  /* Remove this line to avoid having two vertical lines */
  border-left: none; 
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AuthorAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const AuthorName = styled.span`
  font-weight: bold;
  color: white;
`;

const CommentDate = styled.span`
  color: #8899a6;
  font-size: 12px;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #8899a6;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    color: #E91E63;
  }
`;

const CommentContent = styled.p`
  color: white;
  margin: 0;
`;

const ReplySection = styled.div`
  padding-left: 20px;
  margin-top: 16px;
  border-left: 2px solid #38444d;
`;

const ShowRepliesButton = styled.button`
  background: none;
  border: none;
  color: #E91E63;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 12px 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

const NoCommentsMessage = styled.p`
  color: #8899a6;
  text-align: center;
  margin: 20px 0;
`;

interface CommentSectionProps {
  reviewId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ reviewId }) => {
  const { user } = useAuthContext();
  const reviewService = useReviewService();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchComments();
  }, [reviewId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await reviewService.getTopLevelComments(reviewId);
      
      // Process each comment to ensure it has a replyCount property
      const processedComments = response.data.map(comment => ({
        ...comment,
        replyCount: comment.replies?.length || 0 // Get count from replies.count
      }));
      
      setComments(processedComments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReplies = async (commentId: string) => {
    // If already expanded, collapse
    if (expandedComments[commentId]) {
      setExpandedComments((prev) => ({
        ...prev,
        [commentId]: false,
      }));
      return;
    }

    try {
      const response = await reviewService.getReplies(commentId);
      
      // Update the comments array with replies
      setComments(prevComments => {
        return prevComments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, replies: response.data };
          }
          return comment;
        });
      });
      
      // Mark as expanded
      setExpandedComments((prev) => ({
        ...prev,
        [commentId]: true,
      }));
    } catch (error) {
      console.error('Failed to fetch replies:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    try {
      setIsLoading(true);
      await reviewService.addComment(user.profileId, reviewId, {
        content: commentText.trim(),
      });
      setCommentText('');
      fetchComments(); // Refresh comments after posting
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // When adding a reply, make sure to update the count correctly
const handleSubmitReply = async (parentCommentId: string) => {
    if (!user || !replyText.trim()) return;
  
    try {
      setIsLoading(true);
      await reviewService.addComment(user.profileId, reviewId, {
        content: replyText.trim(),
        parentCommentId,
      });
      setReplyText('');
      setReplyingTo(null);
      
      // If the parent comment has expanded replies, refresh them
      if (expandedComments[parentCommentId]) {
        const response = await reviewService.getReplies(parentCommentId);
        setComments(prevComments => {
          return prevComments.map(comment => {
            if (comment.id === parentCommentId) {
              return { 
                ...comment, 
                replies: response.data,
                replyCount: response.data.length || response.data.length // Use count or fallback to length
              };
            }
            return comment;
          });
        });
      } else {
        // Otherwise just increment the reply count
        setComments(prevComments => {
          return prevComments.map(comment => {
            if (comment.id === parentCommentId) {
              // Make sure we're updating replyCount correctly
              const currentCount = comment.replies?.length || comment.replyCount || 0;
              return { 
                ...comment, 
                replyCount: currentCount + 1 
              };
            }
            return comment;
          });
        });
      }
    } catch (error) {
      console.error('Failed to post reply:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCommentItem = (comment: Comment, isReply: boolean = false) => {
    const replyCount = comment.replies?.length || 0;

    return(
    
    <CommentItem key={comment.id} isReply={isReply}>
      <CommentHeader>
        <CommentAuthor>
          <AuthorAvatar 
            src="https://secure.gravatar.com/avatar/?s=32&d=identicon" 
            alt={comment.username || 'User'} 
          />
          <AuthorName>{comment.username || 'User'}</AuthorName>
        </CommentAuthor>
        <CommentDate>
          {new Date(comment.createdDate).toLocaleDateString()}
        </CommentDate>
      </CommentHeader>
      
      <CommentContent>{comment.content}</CommentContent>
      
      <CommentActions>
        <ActionButton onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
          </svg>
          Reply
        </ActionButton>
        
        {comment.profileId === user?.profileId && (
          <>
            {/* Add edit/delete functionality here */}
          </>
        )}
      </CommentActions>
      
      {replyingTo === comment.id && (
        <div style={{ marginTop: '12px' }}>
          <CommentInput
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={2}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <CommentButton 
              type="button" 
              onClick={() => setReplyingTo(null)}
              style={{ backgroundColor: 'transparent', color: '#8899a6' }}
            >
              Cancel
            </CommentButton>
            <CommentButton 
              type="button"
              onClick={() => handleSubmitReply(comment.id)}
              disabled={!replyText.trim() || isLoading}
            >
              Reply
            </CommentButton>
          </div>
        </div>
      )}
      
      {replyCount > 0 && !expandedComments[comment.id] && (
        <ShowRepliesButton onClick={() => toggleReplies(comment.id)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z" />
          </svg>
          Show {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
        </ShowRepliesButton>
      )}
      
      {expandedComments[comment.id] && comment.replies && (
        <>
          <ShowRepliesButton onClick={() => toggleReplies(comment.id)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14l5-5 5 5z" />
            </svg>
            Hide replies
          </ShowRepliesButton>
          <ReplySection>
            {comment.replies.map((reply: Comment) => renderCommentItem(reply, true))}
          </ReplySection>
        </>
      )}
    </CommentItem>
    );
};

  return (
    <CommentSectionContainer>
      {user && (
        <CommentForm onSubmit={handleSubmitComment}>
          <CommentInput
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
          />
          <CommentButton 
            type="submit" 
            disabled={!commentText.trim() || isLoading}
          >
            {isLoading ? 'Posting...' : 'Comment'}
          </CommentButton>
        </CommentForm>
      )}
      
      <CommentList>
        {comments.length > 0 ? (
          comments.map(comment => renderCommentItem(comment))
        ) : (
          <NoCommentsMessage>
            {isLoading ? 'Loading comments...' : 'No comments yet. Be the first to comment!'}
          </NoCommentsMessage>
        )}
      </CommentList>
    </CommentSectionContainer>
  );
};

export default CommentSection;