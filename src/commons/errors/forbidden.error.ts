import { InvariantError } from '@/src/commons/errors/invariant.error';

export class ForbiddenError extends InvariantError {
  public readonly name = 'ForbiddenError';
  constructor(message) {
    super(message, 403);
  }
}
