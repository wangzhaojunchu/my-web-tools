"use client";

import { useState } from "react";

export default function DomainLookup() {
  const [domains, setDomains] = useState<string>(""); // 用户输入的域名
  const [results, setResults] = useState<{ domain: string; ip: string; location: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // 处理文本框输入
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDomains(e.target.value);
  };

  // 处理文件上传（txt 文件，每行一个域名）
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setDomains(text);
    };
    reader.readAsText(file);
  };

  // 查询域名 IP 和归属地
  const fetchResults = async () => {
    setLoading(true);
    setResults([]);

    const domainList = domains.split("\n").map(d => d.trim()).filter(d => d);
    const newResults = [];

    for (const domain of domainList) {
      try {
        const res = await fetch("/api/ip-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain }),
        });
        const data = await res.json();
        newResults.push({ domain, ip: data.ip || "解析失败", location: data.location?.country || "未知" });
      } catch (error) {
        newResults.push({ domain, ip: "查询失败", location: "未知" });
      }
    }

    setResults(newResults);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">域名查询工具</h1>

      {/* 输入框 & 文件上传 */}
      <div className="bg-white p-4 shadow-md rounded-lg">
        <textarea
          className="w-full h-32 p-2 border rounded-md focus:ring focus:ring-blue-300"
          placeholder="请输入域名，每行一个"
          value={domains}
          onChange={handleInputChange}
        />
        <div className="flex items-center justify-between mt-2">
          <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" id="fileInput" />
          <label htmlFor="fileInput" className="px-4 py-2 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300">
            选择文件
          </label>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={fetchResults}
            disabled={loading}
          >
            {loading ? "查询中..." : "查询"}
          </button>
        </div>
      </div>

      {/* 结果表格 */}
      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">查询结果</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">域名</th>
                  <th className="border border-gray-300 p-2">IP 地址</th>
                  <th className="border border-gray-300 p-2">归属地</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, index) => (
                  <tr key={index} className="text-center hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{item.domain}</td>
                    <td className="border border-gray-300 p-2">{item.ip}</td>
                    <td className="border border-gray-300 p-2">{item.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
