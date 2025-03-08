import { Follow } from "./Follow";
import { Review } from "./Review";
import { ReviewDetail } from "./ReviewDetail";

export interface Profile {
    id: string;
    userId: string;
    reviews: Review[];
    detailedReviews: ReviewDetail[];
    followers: Follow[];
    following: Follow[];
}
  