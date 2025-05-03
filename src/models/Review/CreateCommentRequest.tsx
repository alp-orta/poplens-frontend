export interface CreateCommentRequest {
    content: string;
    parentCommentId?: string | null; // Optional for replies to comments
  }