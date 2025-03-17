export interface PageResult<T> {
    page: number;
    pageSize: number;
    totalCount: number;
    result: T[];
}