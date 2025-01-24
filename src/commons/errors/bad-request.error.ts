import { InvariantError } from '@/src/commons/errors/invariant.error';

export class BadRequestError extends InvariantError {
  public readonly name = 'BadRequestError';
  constructor(message) {
    super(message, 400);
  }
}
