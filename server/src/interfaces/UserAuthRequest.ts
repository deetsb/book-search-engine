import type { Request } from 'express';
import type IJwtPayload from './JWTPayload.js';

export default interface IUserAuthRequest extends Request {
    user: IJwtPayload
}