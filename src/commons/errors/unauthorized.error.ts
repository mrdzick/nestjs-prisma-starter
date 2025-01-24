import { InvariantError } from '@/src/commons/errors/invariant.error';

export class UnauthorizedError extends InvariantError {
  public readonly name = 'UnauthorizedError';
  constructor(message) {
    super(message, 401);
  }
}
