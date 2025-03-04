"use client"

import MyResponse from "@/components/MyResponse";
import { BaiduResult, BaiduResults } from "baidu";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import GetApi from "@/components/GetApi";
import { DropdownData, PvData, SearchWapData } from "@/components/Types";
import Sleep from "@/components/Sleep";
export default function BaiduSearchPage() {
    const [keywords, setKeywords] = useState("");
    const [results, setResults] = useState<string[][]>([]);
    const [loading, setLoading] = useState(false);
    const queue: string[] = []
    const queryed: Set<string> = new Set<string>()
    const handleFetchResults = async () => {
        if (!keywords.trim()) return;
        setLoading(true);
        queue.push(...keywords.split("\n").map(k => k.trim()).filter(k => k))
        while (queue.length > 0) {
            const keyword = queue.shift()
            if (keyword && !queryed.has(keyword)) {
                try {
                    const pvData: MyResponse<PvData> = await GetApi<PvData>("/api/baidu-pv", { keyword })
                    const searchData: MyResponse<SearchWapData> = await GetApi<SearchWapData>("/api/baidu-search-wap", { keyword })
                    if (pvData.code != 200) {
                        toast.error(pvData.msg)
                        break
                    }
                    if (searchData.code != 200) {
                        toast.error(searchData.msg)
                        if (searchData.retry > 0) {
                            await Sleep(searchData.retry * 1000)
                            queue.push(keyword)
                            continue
                        }
                        break
                    }

                    const { pv } = pvData.data as PvData
                    const { items } = searchData.data as SearchWapData
                    const searchFan = items.slice(0, 10).filter(item => ![`www.${item.domain}`, `${item.domain}`].includes(item.host)).length
                    const searchNotIndex = items.slice(0, 10).filter(item => ["/", "/index.html", "/index.php"].includes(new URL(item.siteUrl).pathname)).length

                    setResults([...results, [keyword, `${pv}`, `${searchFan}`, `${searchNotIndex}`, `${items.length}`]])
                    queryed.add(keyword)
                    const dropdownData: MyResponse<DropdownData> = await GetApi<DropdownData>("/api/dropdown", { keyword })
                    const dropdownWords = dropdownData.data as DropdownData
                    dropdownWords.forEach((word: string) => {
                        // queryed.add(word)
                        queue.push(word)
                    })


                    try {
                        const response = await fetch("https://strapi.998zy.com/api/words", {
                            method: "post",
                            body: JSON.stringify({ data: { word: keyword, pv, result: searchData.data, count: items.length, fancount: searchFan, notindexcount: searchNotIndex } }),
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer e6b42202a694cc159db3aa99a10ca36959897982c166f0dad7d7b2bc467334bfa343496ef491385cb8248ac96de5369fd7fa04fed08b9cce9d6d759af79adf196d08d6e340636fcb0cdbda70826819fe8cb970ddab8027c95f68cd2874cff3ce31a1d043289cdbb4287885244a2bd17767016fb551404bd3e99b760a7056c738"
                            }
                        })
                        const content = await response.json()
                        console.log("新建document：", await content?.data?.documentId)
                    } catch (ex) { }
                } catch (ex) {
                    console.error(ex)
                }
            }
        }
        setLoading(false);
    };

    return (
        <div className="container mx-auto p-4">
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-4">百度关键词筛选</h1>
            <textarea
                className="w-full border p-2 mb-2"
                rows={5}
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
                            <th className="border p-2">搜索量</th>
                            <th className="border p-2">首页数量</th>
                            <th className="border p-2">泛域名数量</th>
                            <th className="border p-2">首页总数量</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((item, index) => (
                            <tr key={index} className="border">
                                <td className="p-2">{item[0]}</td>
                                <td className="p-2">{item[1]}</td>
                                <td className="p-2">{item[2]}</td>
                                <td className="p-2">{item[3]}</td>
                                <td className="p-2">{item[4]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
