"use client";
import { useState } from "react";

export default function BaiduPVPage() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [data, setData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  // 添加关键词
  const addKeyword = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setKeywords(e.target.value.split("\n").map(item => item.trim()))
  };

  // 删除关键词
  const removeKeyword = (word: string) => {
    setKeywords(keywords.filter((k) => k !== word));
  };

  // 处理文件导入
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const words = text.split("\n").map((w) => w.trim()).filter((w) => w);
      setKeywords([...new Set([...keywords, ...words])]); // 去重
    };
    reader.readAsText(file);
  };

  // 发送 API 请求
  const fetchData = async () => {
    if (keywords.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/baidu-pv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords }),
      });

      if (!res.ok) throw new Error("API 请求失败");

      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("请求错误:", error);
      alert("API 请求失败！");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-xl font-bold mb-4">百度 PV 查询</h2>

      {/* 关键词输入框 */}
      <textarea
        // type="text"
        placeholder="输入关键词后按 Enter 添加"
        onChange={addKeyword}
        className="w-full border p-2 rounded-md mb-3"
      />
      <div>
        {/* 文件上传 */}
        <input type="file" accept=".txt" onChange={handleFileUpload} className="mb-3" />
      </div>


      {/* 提交按钮 */}
      <button
        onClick={fetchData}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "查询中..." : "查询 PV"}
      </button>

      {/* 结果表格 */}
      {Object.keys(data).length > 0 && (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">关键词</th>
              <th className="border p-2">PV</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([word, pv]) => (
              <tr key={word}>
                <td className="border p-2">{word}</td>
                <td className="border p-2">{pv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}