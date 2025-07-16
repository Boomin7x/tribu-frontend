/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/proxy/[...path]/route.ts
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE = process.env.NEXT_PUBLIC_MAP_BASE_URL as string;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const url = `${BACKEND_BASE}/${path.join("/")}${req.nextUrl.search}`;
    console.log("Proxying to:", url);
    const response = await fetch(url, {
      method: "GET",
      headers: { ...req.headers, host: undefined },
    });
    const data = await response.arrayBuffer();
    const res = new NextResponse(data, { status: response.status });
    response.headers.forEach((v, k) => res.headers.set(k, v));
    return res;
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Proxy error: " + (error as Error).message, {
      status: 500,
    });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = `${BACKEND_BASE}/${path.join("/")}${req.nextUrl.search}`;

  // Convert NextRequest headers to a plain object for Axios, omitting 'host'
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "host") {
      headers[key] = value;
    }
  });

  const body = await req.arrayBuffer();

  const axiosResponse = await axios.post(url, body, {
    responseType: "arraybuffer",
    headers,
  });

  const res = new NextResponse(axiosResponse.data, {
    status: axiosResponse.status,
  });
  Object.entries(axiosResponse.headers).forEach(([k, v]) => {
    res.headers.set(k, Array.isArray(v) ? v.join(", ") : v);
  });
  return res;
}
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = `${BACKEND_BASE}/${path.join("/")}${req.nextUrl.search}`;

  // Convert NextRequest headers to a plain object for Axios, omitting 'host'
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "host") {
      headers[key] = value;
    }
  });

  const body = await req.arrayBuffer();

  const axiosResponse = await axios.put(url, body, {
    responseType: "arraybuffer",
    headers,
  });

  const res = new NextResponse(axiosResponse.data, {
    status: axiosResponse.status,
  });
  Object.entries(axiosResponse.headers).forEach(([k, v]) => {
    res.headers.set(k, Array.isArray(v) ? v.join(", ") : v);
  });
  return res;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = `${BACKEND_BASE}/${path.join("/")}${req.nextUrl.search}`;

  // Convert NextRequest headers to a plain object for Axios, omitting 'host'
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "host") {
      headers[key] = value;
    }
  });

  // Some DELETE requests may have a body, so we support it
  let body: ArrayBuffer | undefined = undefined;
  try {
    body = await req.arrayBuffer();
    // If body is empty, arrayBuffer() returns a 0-length buffer
    if (body.byteLength === 0) {
      body = undefined;
    }
  } catch (e) {
    // ignore, no body
  }

  const axiosResponse = await axios.delete(url, {
    data: body,
    responseType: "arraybuffer",
    headers,
  });

  const res = new NextResponse(axiosResponse.data, {
    status: axiosResponse.status,
  });
  Object.entries(axiosResponse.headers).forEach(([k, v]) => {
    res.headers.set(k, Array.isArray(v) ? v.join(", ") : v);
  });
  return res;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = `${BACKEND_BASE}/${path.join("/")}${req.nextUrl.search}`;

  // Convert NextRequest headers to a plain object for Axios, omitting 'host'
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "host") {
      headers[key] = value;
    }
  });

  const body = await req.arrayBuffer();

  const axiosResponse = await axios.patch(url, body, {
    responseType: "arraybuffer",
    headers,
  });

  const res = new NextResponse(axiosResponse.data, {
    status: axiosResponse.status,
  });
  Object.entries(axiosResponse.headers).forEach(([k, v]) => {
    res.headers.set(k, Array.isArray(v) ? v.join(", ") : v);
  });
  return res;
}

// You can add PUT, DELETE, etc. similarly
