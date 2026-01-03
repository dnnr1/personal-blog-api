import isValidUUID from '../../src/core/utils/isValidUUID';

describe('isValidUUID', () => {
  it('should return true for valid UUID v1', () => {
    expect(isValidUUID('550e8400-e29b-11d4-a716-446655440000')).toBe(true);
  });

  it('should return true for valid UUID v4', () => {
    expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('should return true for valid UUID with uppercase letters', () => {
    expect(isValidUUID('550E8400-E29B-41D4-A716-446655440000')).toBe(true);
  });

  it('should return false for invalid UUID - wrong format', () => {
    expect(isValidUUID('invalid-uuid')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidUUID('')).toBe(false);
  });

  it('should return false for UUID with missing segment', () => {
    expect(isValidUUID('550e8400-e29b-41d4-a716')).toBe(false);
  });

  it('should return false for UUID with extra characters', () => {
    expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000extra')).toBe(
      false,
    );
  });

  it('should return false for UUID with invalid characters', () => {
    expect(isValidUUID('550e8400-e29b-41d4-a716-44665544000g')).toBe(false);
  });

  it('should return false for number', () => {
    expect(isValidUUID('12345')).toBe(false);
  });
});
