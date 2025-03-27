import { Review } from "./Review";

export interface MediaMainPageReviewInfo {
    ratingChartInfo: { [key: string]: number };
    popularReviews: Review[];
    recentReviews: Review[];
  }