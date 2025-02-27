import { NextRequest, NextResponse } from "next/server";
import { Cloudflare } from "cloudflare";

export async function POST(req: NextRequest) {
  const { apiKey, action, domains, zoneId } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: "缺少 API 密钥" }, { status: 400 });
  }

  const cf = new Cloudflare({ token: apiKey });

  try {
    if (action === "fetchZones") {
      // 获取站点列表
      const zones = await cf.zones.list();
      return NextResponse.json({ success: true, zones });

    } else if (action === "addDomains") {
      // 批量添加站点
      const addedSites = [];
      for (const domain of domains) {
        const res = await cf.zones.create({ name: domain, jump_start: true });
        addedSites.push(res);
      }
      return NextResponse.json({ success: true, addedSites });

    } else if (action === "deleteDomains") {
      // 批量删除站点
      const deletedSites = [];
      for (const domain of domains) {
        const { result: zones } = await cf.zones.list();
        const zone = zones.find(z => z.name === domain);
        if (zone) {
          await cf.zones.del(zone.id);
          deletedSites.push(domain);
        }
      }
      return NextResponse.json({ success: true, deletedSites });

    } else if (action === "addDNSRecords") {
      // 批量添加 DNS 解析
      if (!zoneId) return NextResponse.json({ error: "请选择站点" }, { status: 400 });

      const addedRecords = [];
      for (const record of domains) {
        const [subdomain, ip] = record.split(",");
        if (!subdomain || !ip) continue;

        const res = await cf.dns.records.create(zoneId, {
          type: "A",
          name: subdomain,
          content: ip,
          ttl: 1,
          proxied: false
        });

        addedRecords.push(res);
      }
      return NextResponse.json({ success: true, addedRecords });

    } else {
      return NextResponse.json({ error: "未知操作" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
