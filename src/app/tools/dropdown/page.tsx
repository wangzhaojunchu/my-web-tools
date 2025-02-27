"use client";

import { useState } from "react";

export default function KeywordLookup() {
  const [keywords, setKeywords] = useState<string>(""); // 关键词输入
  const [results, setResults] = useState<{ keyword: string; dropdown: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // 处理输入框
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setKeywords(e.target.value);
  };

  // 处理文件上传（txt 文件，每行一个关键词）
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setKeywords(text);
    };
    reader.readAsText(file);
  };

  // 发送 API 请求
  const fetchResults = async () => {
    setLoading(true);
    setResults([]);

    const keywordList = keywords.split("\n").map(k => k.trim()).filter(k => k);
    const newResults = [];

    for (const keyword of keywordList) {
      try {
        const res = await fetch("/api/dropdown", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword }),
        });
        const data = await res.json();
        (data ?? []).forEach((element:string) => {
            newResults.push({ keyword, dropdown: element });
        });
        
      } catch (error) {
        newResults.push({ keyword, dropdown: "查询失败" });
      }
    }

    setResults(newResults);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">关键词查询</h1>

      {/* 输入框 & 文件上传 */}
      <div className="bg-white p-4 shadow-md rounded-lg">
        <textarea
          className="w-full h-32 p-2 border rounded-md focus:ring focus:ring-blue-300"
          placeholder="请输入关键词，每行一个"
          value={keywords}
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
                  <th className="border border-gray-300 p-2">关键词</th>
                  <th className="border border-gray-300 p-2">下拉词</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, index) => (
                  <tr key={index} className="text-center hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{item.keyword}</td>
                    <td className="border border-gray-300 p-2">
                      {item.dropdown}
                    </td>
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
