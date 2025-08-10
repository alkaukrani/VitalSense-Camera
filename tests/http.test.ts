import { describe, it, expect } from 'vitest';
import { httpFetch } from '../src/services/http';

describe('httpFetch', () => {
  it('should be a function', () => {
    expect(typeof httpFetch).toBe('function');
  });
});

