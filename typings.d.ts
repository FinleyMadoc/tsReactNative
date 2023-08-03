
declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.js';
declare module '*.json';
declare module '*.gif';
declare module '*.webp';
declare module '*.tsx';


// 内容、评论
type ArticleComment = {
    userName: string;
    avatarUrl: string;
    message: string;
    dateTime: string;
    location: string;
    favoriteCount: number;
    isFavorite: boolean;
    children?: ArticleComment[];
}

// 文章类型
type Article = {
    id: number;
    title: string;
    desc: string;
    tag: string[];
    dateTime: string;
    location: string;
    userId: number;
    userName: string;
    isFollow: boolean;
    avatarUrl: string;
    images: string[];
    favoriteCount: number;
    collectionCount: number;
    isFavorite: boolean;
    isCollection: boolean;
    comments?: ArticleComment[];
}

// 首页简化版文章
type ArticleSimple = {
    id: number;
    title: string;
    userName: string;
    avatarUrl: string;
    favoriteCount: number;
    isFavorite: boolean;
    image: string;
}

type Category = {
    name: string;
    default: boolean;
    isAdd: boolean;
}