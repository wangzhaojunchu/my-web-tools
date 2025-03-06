/**
 * 1. 上传数据（泛域名数量，标题集合，收录数量， 首页收录数量）到数据库
 * 2. 读取数据库信息
 * 3. 获取数据库中 符合条件的数据
 * 4. 条件如下
 * 4.1 没有泛
 * 4.2 收录大于100，但是首页只有1-3条数据
 * 4.3 历史快照标题包含收录标题
 * 4.4 近3年历史同一标题
 * 5. 一个按钮用于上传数据
 * 6. 一个按钮用于遍历数据并且获取条件
 */

"use client"

import MyResponse from "@/components/MyResponse";
import { BaiduResult, BaiduResults } from "baidu";
import { useRef, useState, useEffect } from "react";
import { useGetState } from "ahooks";
import { ToastContainer, toast } from 'react-toastify';
import GetApi from "@/components/GetApi";
import { DropdownData, PvData, SearchWapData } from "@/components/Types";
import Sleep from "@/components/Sleep";
import Range from "@/components/Range";
import { SearchPCData } from "@/components/Types";
import * as Strapi from "@/components/Strapi";
export default function BaiduSearchPage() {
    const [keywords, setKeywords] = useState("");
    const [results, setResults] = useState<string[][]>([]);
    const [loading, setLoading] = useState(false);
    const [queryloading, setQueryLoading] = useState(false);
    const [pvrange,setPvrange,getPvrange] = useGetState<[number,number]>([100,1000])
    const [fanrange,setFanrange,getFanrange ] = useGetState<[number,number]>([1,5])
    const [notindexrange,setNotIndexrange,getNotIndexrange] = useGetState<[number,number]>([1,3])



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
                    const {data}: MyResponse<SearchPCData> = await GetApi<SearchPCData>("/api/baidu-pv", { keyword })
                    const fan = data.items.filter(item => ![`www.${item.domain}`,`${item.domain}`,`wap.${item.domain}`,`m.${item.domain}`].includes(item.host)).length
                    const body = {domain: keyword, fan, indexed: data.indexed,indexedOnIndex:data.indexedOnFirstPage}
                    const uploadResponse = await Strapi.Post("https://strapi.998zy.com/api/words/domain-info", body)
                    toast.info(`document [${uploadResponse}] create success`)
                } catch (ex) {
                    toast.error((ex as Error).message)
                }
            }
        }
        setLoading(false);
    };
    const queryHandle = () => {
        setQueryLoading(false)
        
    }
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
                {loading ? "上传中..." : "搜索并上传"}
            </button>

            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={queryHandle}
                disabled={queryloading}
            >
                {queryloading ? "查询中..." : "查询"}
            </button>
            {results && (
                <table className="w-full mt-4 border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">域名</th>
                            <th className="border p-2">收录</th>
                            <th className="border p-2"></th>
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
