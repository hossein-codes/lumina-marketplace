import { NextResponse } from 'next/server';

export class ApiHttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function ok(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function created(data: unknown) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function handler(fn: (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => Promise<NextResponse>) {
  return async (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => {
    try {
      return await fn(req, context);
    } catch (e: unknown) {
      if (e instanceof ApiHttpError) {
        return NextResponse.json({ success: false, error: e.message }, { status: e.status });
      }
      if (e instanceof Error) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
      }
      return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
  };
}
