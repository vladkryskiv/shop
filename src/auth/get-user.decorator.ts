import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client'; // Adjust this import based on your User type definition

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);