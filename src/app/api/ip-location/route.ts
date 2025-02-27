import { NextRequest, NextResponse } from "next/server";
import dns from "node:dns/promises";
import * as geoip from "geoip-lite";


export async function GET(){
    return NextResponse.json([])
}

export async function POST(req: NextRequest) {
  try {
    // 解析请求 body
    const body = await req.json();
    const domain = body.domain;

    if (!domain) {
      return NextResponse.json({ error: "缺少 domain 参数" }, { status: 400 });
    }

    // 解析域名获取 IP 地址
    let ip;
    try {
      const result = await dns.lookup(domain);
      ip = result.address;
    } catch (err:any) {
      return NextResponse.json({ error: "域名解析失败", details: err.message }, { status: 500 });
    }
    console.log(ip)
    // 查询 IP 归属地（本地查询）
    const geo = geoip.lookup(ip);

    // 归属地信息
    const location = geo
      ? {
          country: geo.country || "未知",
          region: geo.region || "未知",
          city: geo.city || "未知",
          range: geo.range || [],
        }
      : { country: "未知", region: "未知", city: "未知" };

    // // 返回查询结果
    return NextResponse.json({
      domain,
      ip,
      location,
    });
  } catch (err:any) {
    return NextResponse.json({ error: "服务器错误", details: err.message }, { status: 500 });
  }
}