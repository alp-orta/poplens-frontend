import { Follow } from "./Follow";
import { Review } from "../Review/Review";
import { ReviewDetail } from "../Review/ReviewDetail";

export interface Profile {
    id: string;
    userId: string;
    reviews: Review[];
    detailedReviews: ReviewDetail[];
    followers: Follow[];
    following: Follow[];
}
  