"use client"

import { BaiduResults } from "baidu";
import { useState } from "react";

export default function BaiduSearchPage() {
    const [keywords, setKeywords] = useState("");
    const [results, setResults] = useState<{[key:string]:BaiduResults}>({});
    const [loading, setLoading] = useState(false);

    const handleFetchResults = async () => {
        if (!keywords.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/baidu-search-wap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ keywords: keywords.split("\n").map(k => k.trim()).filter(k => k) })
            });
            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Baidu Search</h1>
            <textarea
                className="w-full border p-2 mb-2"
                rows="5"
                placeholder="输入关键词，每行一个"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
            ></textarea>
            <button 
                className="bg-blue-500 text-white px-4 py-2 rounded" 
                onClick={handleFetchResults} 
                disabled={loading}
            >
                {loading ? "搜索中..." : "搜索"}
            </button>
            {results && (
                <table className="w-full mt-4 border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">关键词</th>
                            <th className="border p-2">序号</th>
                            <th className="border p-2">标题</th>
                            <th className="border p-2">描述</th>
                            <th className="border p-2">展示名称</th>
                            <th className="border p-2">Host</th>
                            <th className="border p-2">域名</th>
                            <th className="border p-2">相关关键词</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(results).map(([word,brs], index) => {
                            const {words} = brs
                            return brs.map((item,itemIndex)=>(
                                <tr key={index} className="border">
                                    <td className="p-2">{word}</td>
                                    <td className="p-2">{itemIndex+1}</td>
                                    <td className="p-2"><a href={item.siteUrl} className="text-blue-500">{item.title}</a></td>
                                    <td className="p-2">{item.des}</td>
                                    <td className="p-2">{item.showName}</td>
                                    <td className="p-2">{item.host}</td>
                                    <td className="p-2">{item.domain}</td>
                                    <td className="p-2">{words?.join("|")}</td>
                                </tr>
                            ))
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}
