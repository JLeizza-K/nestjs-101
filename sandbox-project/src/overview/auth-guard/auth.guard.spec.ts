import { AuthGuard } from './auth.guard';
import { Reflector } from '@nestjs/core';

describe('AuthGuardGuard', () => {
  let guard: AuthGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new AuthGuard(reflector);
  });
  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
