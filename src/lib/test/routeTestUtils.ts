import type { NextRequest } from 'next/server';

/**
 * Builds a minimal request object for exercising an API route handler directly
 * in a test. The routes in this codebase only ever call `.json()` and `.url`
 * (never NextRequest-specific APIs like `.nextUrl` or `.cookies`), so a plain
 * Fetch `Request` cast to `NextRequest` is sufficient and avoids pulling in
 * Next's request machinery for a unit test.
 */
export function mockRequest(body?: unknown, url = 'http://localhost/api/test'): NextRequest {
  return new Request(url, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  }) as unknown as NextRequest;
}

/** Builds the `{ params: Promise<{ id }> }` second argument Next 15 route handlers take. */
export function routeParams(id: string | number): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id: String(id) }) };
}

export async function jsonOf(response: Response): Promise<unknown> {
  return response.json();
}
