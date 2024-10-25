export type PostJson = {
    id: number;
    title: string;
    body: string;
    tags: string[];
    userId: number;
};

export type CommentJson = {
    id: number;
    body: string;
    postId: number;
    userId: number;
};

export type UserJson = {
    id: number;
    email: string;
    username: string;
    password: string;
    image: string;
};
