import { InvariantError } from '@/src/commons/errors/invariant.error';

export class NotFoundError extends InvariantError {
  public readonly name = 'NotFoundError';
  constructor(message) {
    super(message, 404);
  }
}
