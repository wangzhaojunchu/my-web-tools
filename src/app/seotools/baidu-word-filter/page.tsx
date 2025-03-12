"use client"

import MyResponse from "@/components/MyResponse";
import { BaiduResult, BaiduResults } from "baidu";
import { useRef, useState, useEffect } from "react";
import { useGetState } from "ahooks";
import { ToastContainer, toast } from 'react-toastify';
import GetApi from "@/components/GetApi";
import { DropdownData, PvData, SearchWapData } from "@/components/Types";
import Sleep from "@/components/Sleep";
import * as Strapi from "@/components/Strapi"
import Range from "@/components/Range";
export default function BaiduSearchPage() {
    const [keywords, setKeywords] = useState("");
    const [results, setResults] = useState<string[][]>([]);
    const [loading, setLoading] = useState(false);
    const [pvrange,setPvrange,getPvrange] = useGetState<[number,number]>([50,5000])
    const [fanrange,setFanrange,getFanrange ] = useGetState<[number,number]>([0,5])
    const [notindexrange,setNotIndexrange,getNotIndexrange] = useGetState<[number,number]>([0,3])



    const inRange = (num:number,range:[number,number]):boolean =>{
        return num <= range[1] && num >=range[0]
    }
    const queue: string[] = []
    const queryed: Set<string> = new Set<string>()
    const handleFetchResults = async () => {
        if (!keywords.trim()) return;
        setLoading(true);
        queue.push(...keywords.split("\n").map(k => k.trim()).filter(k => k))
        while (queue.length > 0) {
            const keyword = queue.shift()
            if (keyword && !queryed.has(keyword)) {

                //更新关键词列表
                const dropdownData: MyResponse<DropdownData> = await GetApi<DropdownData>("/api/dropdown", { keyword })
                const {dropdownWords} = dropdownData.data as DropdownData
                dropdownWords.forEach((word: string) => {
                    queue.push(word)
                })
                queryed.add(keyword)
                //运行
                try {
                    const {data:{pv}}: MyResponse<PvData> = await GetApi<PvData>("/api/baidu-pv", { keyword })

                    if(!inRange(pv, getPvrange())){
                        toast.info(`[${keyword}]pv[${pv}]not in range [${getPvrange()}]`)
                        continue
                    }

                    const {data:searchWapData}: MyResponse<SearchWapData> = await GetApi<SearchWapData>("/api/baidu-search-wap", { keyword })
             
                    const { items } = searchWapData
                    const searchFan = items.slice(0, 10).filter(item => ![`www.${item.domain}`, `${item.domain}`].includes(item.host)).length
                    const searchNotIndex = items.slice(0, 10).filter(item => !["/", "/index.html", "/index.php"].includes(new URL(item.siteUrl).pathname)).length
                    
                    if(!inRange(searchFan, getFanrange())){
                        toast.info(`[${keyword}]fan:[${searchFan}]not in range [${getFanrange()}]`)
                        continue
                    }

                    if(!inRange(searchNotIndex, getNotIndexrange())){
                        toast.info(`[${keyword}]notindex:[${searchNotIndex}]not in range [${getNotIndexrange()}]`)
                        continue
                    }
                    setResults(prev => [...prev, [keyword, `${pv}`, `${searchNotIndex}`,`${searchFan}`,  `${items.length}`]])
                    
                    await Strapi.Post("https://strapi.998zy.com/api/words",{ word: keyword, pv, result: searchWapData, count: items.length, fancount: searchFan, notindexcount: searchNotIndex })
    
                } catch (ex) {
                    toast.error((ex as Error).message)
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
            <div className="flex flex-row flex-nowrap justify-between">
                <Range label="搜索量" state={pvrange} setState={setPvrange} />
                <Range label="泛域名数量" state={fanrange} setState={setFanrange} />
                <Range label="不是首页的数量" state={notindexrange} setState={setNotIndexrange} />
            </div>
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
                            <th className="border p-2">不是首页数量</th>
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
