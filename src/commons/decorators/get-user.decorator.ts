import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserPayload {
  id: number;
  userId: number;
  email: string;
  name: string;
  picture: string;
}

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserPayload = request.user; // `user` should be populated by your authentication guard

    // If specific data is requested (e.g., `id`, `email`), return that field
    if (data) {
      return user?.[data];
    }

    // Otherwise, return the full user object
    return user;
  },
);
