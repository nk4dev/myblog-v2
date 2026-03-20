export interface BlogMetaData {
    id: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    title: string;
    content: string;
    category: {
        id: string;
        name: string;
    }
    eyecatch?: {
        url: string;
        width: number;
        height: number;
    }
}