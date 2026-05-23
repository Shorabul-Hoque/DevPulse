export type TUserRole = 'contributor' | 'maintainer';

export type TJwtPayload = {
    id: number;
    name: string;
    role: TUserRole;
};

declare global {
    namespace Express {
        interface Request {
            user?: TJwtPayload;
        }
    }
}