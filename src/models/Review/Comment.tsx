export interface Comment {
    id: string;
    reviewId: string;
    parentCommentId?: string | null;
    profileId: string;
    content: string;
    createdDate: string;
    lastUpdatedDate: string;
    
    // Additional fields for UI display
    username?: string;
    profileImageUrl?: string;
    replies?: Comment[];
    detailedReplies?: Comment[];
    replyCount?: number;
  }