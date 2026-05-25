export type Nullable<T> = T | null;
export type Maybe<T> = T | null | undefined;

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        pageSize: number;
    };
}
