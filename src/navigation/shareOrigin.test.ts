import { describe, expect, it } from 'vitest';
import { isLoopbackOrigin, parseShareOrigin } from './shareOrigin';

describe('parseShareOrigin', () => {
  it('accepts only HTTP(S) origins', () => {
    expect(parseShareOrigin(' https://sinif.example.org/ ')).toBe('https://sinif.example.org');
    expect(parseShareOrigin('http://192.168.1.20:5173')).toBe('http://192.168.1.20:5173');
  });

  it('rejects paths, credentials, queries, fragments and invalid protocols', () => {
    expect(parseShareOrigin('https://sinif.example.org/ogrenci')).toBeNull();
    expect(parseShareOrigin('https://sinif.example.org/?x=1')).toBeNull();
    expect(parseShareOrigin('https://sinif.example.org/#top')).toBeNull();
    expect(parseShareOrigin('https://user:pass@sinif.example.org')).toBeNull();
    expect(parseShareOrigin('javascript:alert(1)')).toBeNull();
    expect(parseShareOrigin('sinif.example.org')).toBeNull();
  });
});

describe('isLoopbackOrigin', () => {
  it('distinguishes local addresses from student-reachable hosts', () => {
    expect(isLoopbackOrigin('http://localhost:5173')).toBe(true);
    expect(isLoopbackOrigin('http://127.0.0.1:5173')).toBe(true);
    expect(isLoopbackOrigin('http://127.0.0.2:5173')).toBe(true);
    expect(isLoopbackOrigin('http://[::1]:5173')).toBe(true);
    expect(isLoopbackOrigin('http://0.0.0.0:5173')).toBe(true);
    expect(isLoopbackOrigin('https://sinif.example.org')).toBe(false);
    expect(isLoopbackOrigin('http://192.168.1.20:5173')).toBe(false);
  });
});
