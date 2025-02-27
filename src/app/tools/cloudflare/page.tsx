"use client";

import { useState } from "react";
import { useLocalStorageState } from "ahooks";
export default function CloudflareTool() {
  const [apiKey, setApiKey] = useState<string>("");
  const [domains, setDomains] = useState("");
  const [zones, setZones] = useState<{ id: string; name: string }[]>([]);
  const [selectedZone, setSelectedZone] = useState("");

  const handleRequest = async (action: string) => {
    const domainList = domains.split("\n").map(d => d.trim()).filter(Boolean);

    const res = await fetch("/api/cloudflare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey, action, domains: domainList, zoneId: selectedZone }),
    });

    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
    if (action === "fetchZones" && data.success) setZones(data.zones);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Cloudflare 批量管理</h1>

      <div className="mb-4">
        <label className="block font-semibold">Cloudflare API 密钥：</label>
        <input
          type="password"
          className="border p-2 w-full rounded"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>

      <div className="flex gap-4 mb-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => handleRequest("fetchZones")}>
          获取站点列表
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={() => handleRequest("addDomains")}>
          批量添加网站
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => handleRequest("deleteDomains")}>
          批量删除网站
        </button>
      </div>

      <div className="mb-4">
        <label className="block font-semibold">选择站点：</label>
        <select className="border p-2 w-full rounded" value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
          <option value="">请选择</option>
          {zones.map((zone) => (
            <option key={zone.id} value={zone.id}>{zone.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold">输入数据（每行一个）：</label>
        <textarea
          className="border p-2 w-full rounded h-32"
          value={domains}
          onChange={(e) => setDomains(e.target.value)}
          placeholder="添加网站：每行一个域名
添加解析：子域名,IP（如 www,1.2.3.4）"
        />
      </div>

      <button className="px-4 py-2 bg-yellow-500 text-white rounded" onClick={() => handleRequest("addDNSRecords")}>
        批量设置解析
      </button>
    </div>
  );
}
