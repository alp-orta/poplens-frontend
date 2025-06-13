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
    border-color: #DB216D;
  }
`;

const CommentButton = styled.button`
  align-self: flex-end;
  background-color: #DB216D;
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
  border-left: none;
  width: 100%;               /* Take full width of parent */
  box-sizing: border-box;    /* Include padding in width calculation */
  overflow: hidden;          /* Prevent content from flowing outside */
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
    color: #DB216D;
  }
`;

const CommentContent = styled.p`
  color: white;
  margin: 0;
  word-wrap: break-word;      /* Allow long words to break */
  overflow-wrap: break-word;  /* Modern version of word-wrap */
  white-space: pre-wrap;      /* Preserve whitespace but allow wrapping */
  max-width: 100%;            /* Ensure content doesn't exceed container width */
`;

const ReplySection = styled.div`
  padding-left: 20px;
  margin-top: 16px;
  border-left: 2px solid #38444d;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
`;

const ShowRepliesButton = styled.button`
  background: none;
  border: none;
  color: #DB216D;
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
      setComments(response.data);
      // No need to process comments or fetch additional reply counts
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRepliesForComment = async (commentId: string) => {
    try {
      const repliesResponse = await reviewService.getReplies(commentId);
      
      // Recursive helper function to update comments at any nesting level
      const updateCommentReplies = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          // If this is the comment we're looking for
          if (comment.id === commentId) {
            return {
              ...comment,
              detailedReplies: repliesResponse.data
            };
          }
          
          // If this comment has replies, recursively check them
          if (comment.detailedReplies && comment.detailedReplies.length > 0) {
            return {
              ...comment,
              detailedReplies: updateCommentReplies(comment.detailedReplies)
            };
          }
          
          // Otherwise return the comment unchanged
          return comment;
        });
      };
      
      // Update the comment state using our recursive function
      setComments(prevComments => updateCommentReplies(prevComments));
    } catch (error) {
      console.error(`Failed to fetch replies for comment ${commentId}:`, error);
    }
  };

  const toggleReplies = async (commentId: string, isNestedReply = false) => {
    // If this is a nested reply and we're expanding it, fetch its replies
    if (isNestedReply && !expandedComments[commentId]) {
      await fetchRepliesForComment(commentId);
    }

    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
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
  // Updated handleSubmitReply function with optimistic updates
const handleSubmitReply = async (parentCommentId: string) => {
  if (!user || !replyText.trim()) return;

  // Create optimistic reply object
  const optimisticReply: Comment = {
    id: `temp-${Date.now()}`, // Temporary ID until real one comes from server
    reviewId: reviewId,
    parentCommentId: parentCommentId,
    content: replyText.trim(),
    username: user.username || 'You',
    profileId: user.profileId,
    createdDate: new Date().toISOString(),
    lastUpdatedDate: new Date().toISOString(),
    replyCount: 0,
    detailedReplies: []
  };

  // Optimistically update UI first using the same recursive pattern
  const addReplyToComment = (comments: Comment[]): Comment[] => {
    return comments.map(comment => {
      // If this is the parent comment, add our reply to it
      if (comment.id === parentCommentId) {
        // Expand the comment to show the new reply
        setExpandedComments(prev => ({
          ...prev,
          [parentCommentId]: true
        }));
        
        return {
          ...comment,
          replyCount: (comment.replyCount || 0) + 1,
          detailedReplies: [
            ...(comment.detailedReplies || []),
            optimisticReply
          ]
        };
      }
      
      // If this comment has replies, recursively check them
      if (comment.detailedReplies && comment.detailedReplies.length > 0) {
        return {
          ...comment,
          detailedReplies: addReplyToComment(comment.detailedReplies)
        };
      }
      
      // Otherwise return the comment unchanged
      return comment;
    });
  };
  
  // Update comments state optimistically
  setComments(prevComments => addReplyToComment(prevComments));
  
  // Reset UI state
  setReplyText('');
  setReplyingTo(null);

  // Actually submit to API
  try {
    setIsLoading(true);
    await reviewService.addComment(user.profileId, reviewId, {
      content: replyText.trim(),
      parentCommentId,
    });
    
    // No need to refresh all comments - our optimistic update is already showing
    // We could fetch just this thread to get the real IDs if needed
  } catch (error) {
    console.error('Failed to post reply:', error);
    
    // On error, revert the optimistic update
    // This is simplified - a more robust solution would track the temp ID
    fetchComments();
  } finally {
    setIsLoading(false);
  }
};

  const renderCommentItem = (comment: Comment, isReply: boolean = false) => {
    const replyCount = comment.replyCount || 0;

    return (

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
          <ShowRepliesButton onClick={() => toggleReplies(comment.id, isReply)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z" />
            </svg>
            Show {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
          </ShowRepliesButton>
        )}

        {expandedComments[comment.id] && (
          <>
            <ShowRepliesButton onClick={() => toggleReplies(comment.id, isReply)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14l5-5 5 5z" />
              </svg>
              Hide replies
            </ShowRepliesButton>
            <ReplySection>
              {comment.detailedReplies?.map((reply: Comment) => renderCommentItem(reply, true))}
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