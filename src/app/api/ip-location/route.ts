import { NextRequest, NextResponse } from "next/server";
import dns from "node:dns/promises";
import * as geoip from "geoip-lite";
import MyResponse from "@/components/MyResponse";
import { IpLocationData } from "@/components/Types";


export async function GET(){
    return NextResponse.json(MyResponse.success({}))
}

export async function POST(req: NextRequest) {
  try {
    // 解析请求 body
    const {keyword} = await req.json();

    if (!keyword) {
      return NextResponse.json(MyResponse.failed("没有找到关键词参数keyword"));
    }

    // 解析域名获取 IP 地址
    let ip;
    try {
      const result = await dns.lookup(keyword);
      ip = result.address;
    } catch (err:any) {
      return NextResponse.json(MyResponse.failed("域名解析失败"));
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
    return NextResponse.json(MyResponse.success<IpLocationData>({ip,location}))
  } catch (ex) {
    return NextResponse.json(MyResponse.failed((ex as Error).message));
  }
}