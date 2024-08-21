// app/api/login/route.js
import { NextResponse } from 'next/server';
import config from '../../config';

export async function GET() {
  return NextResponse.redirect(`${config.apiBaseUrl}/auth/facebook`);
}
