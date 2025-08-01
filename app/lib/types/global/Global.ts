

export type Color = 'red' | 'blue' | 'green' | 'yellow' | 'orange'

export type SchemaError<T> = {
    success: false,
    data: Partial<T>
} | { success: true, data: {} }


export interface Request<T> {
    loading: boolean | null,
    success: boolean | null,
    message?: {
        type: 'error' | 'success' | 'loading',
        text: string,
        animation: boolean
    },
    data?: T
}

export interface Cursor {
    cursor: {
        limit: number
        currentPage: number,
        next: boolean
    }
}