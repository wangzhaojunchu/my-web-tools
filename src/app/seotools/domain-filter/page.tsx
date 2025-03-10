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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BaiduSearchPage() {
    const [keywords, setKeywords] = useState("");
    const [results, setResults] = useState<(string)[][]>([]);
    const [loading, setLoading] = useState(false);
    const [queryloading, setQueryLoading] = useState(false);
    const [startTime, setStartTime, getStartTime] = useGetState<Date | null>(new Date())
    const [endTime, setEndTime, getEndTime] = useGetState<Date | null>(new Date())
    //连续几年有历史
    const [years, setYears, getYears] = useGetState<number>(3)
    //收录数量
    const [indexed, setIndexed, getIndexed] = useGetState<[number, number]>([1, 1000000])
    //可接受的泛域名数量
    const [fan, setFan, getFan] = useGetState<[number, number]>([0, 0])

    //是否收录多，首页少
    const [manyIndexSmallOnIndexCheck, setManyIndexSmallOnIndexCheck, getManyIndexSmallOnIndexCheck] = useGetState<boolean>(true)

    //历史快照包含收录标题
    const [includeSiteTitleCheck, setIncludeSiteTitleCheck, getIncludeSiteTitleCheck] = useGetState<boolean>(true)
    const inRange = (num: number, range: [number, number]): boolean => {
        return num <= range[1] && num >= range[0]
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

                //运行
                try {
                    const { data }: MyResponse<SearchPCData> = await GetApi<SearchPCData>("/api/baidu-search-pc", { keyword: `site:${keyword}` })
                    const fan = data.items.filter(item => ![`www.${item.domain}`, `${item.domain}`, `wap.${item.domain}`, `m.${item.domain}`].includes(item.host)).length
                    const body = { domain: keyword, fan, indexed: data.indexed, indexedOnIndex: data.indexedOnFirstPage, result: data }
                    const uploadResponse = await Strapi.Post("https://strapi.998zy.com/api/domain-infos", body)
                    toast.info(`document [${uploadResponse}] create success`)
                } catch (ex) {
                    toast.error((ex as Error).message)
                }
            }
        }
        setLoading(false);
    };
    const queryHandle = async () => {
        setResults([[]])
        setQueryLoading(true)
        let currentPage = 1
        let initPageCount = 1
        while (currentPage <= initPageCount) {
            try {
                const response = await Strapi.Get(`https://strapi.998zy.com/api/domain-infos?pagination[page]=${currentPage}&pagination[pageSize]=100`)
                const { meta: { pagination: { pageCount } }, data } = response
                initPageCount = pageCount
                for (const doc of data) {
                    try {
                        const { domain, fan: fanCount, result, history }: { domain: string, fan: number, result: BaiduResults, history: any } = doc
                        if (getYears() > 0) {
                            const thisyear = new Date().getFullYear()
                            let pass = true
                            for (let i = 0; i < getYears(); i++) {
                                if (history[`${thisyear - i}`] != history[`${thisyear - i - 1}`]) {
                                    toast.error(`[${thisyear - i}]=[${thisyear - i - 1}]历史不一致`)
                                    pass = false
                                }
                            }
                            if (!pass) {
                                toast.error(`domain[${domain}]未通过历史一致性检测`)
                                continue
                            }
                        }

                        const manyIndexedButsmallIndexedOnFirstPage = result.indexed > 10 && result.indexedOnFirstPage < 7
                        if (getManyIndexSmallOnIndexCheck()) {

                            if (manyIndexedButsmallIndexedOnFirstPage) {
                                toast.info(`domain${domain} has indexed[${result.indexed}] but only have [${result.indexedOnFirstPage}] on first page `)
                                continue
                            }
                        }

                        // const includeTitleFromBaidu = false
                        const historyTitles = Object.values(history ?? {}).join("|")
                        const includeTitleFromBaidu = result.items.map(item => item.title).filter(item => historyTitles.includes(item)).length > 0
                        if (!includeTitleFromBaidu) {
                            toast.info(`domain${domain} history [${historyTitles}] not include any title from baidu`)
                            continue
                        }

                        const [minFan, maxFan] = getFan()
                        if (fanCount < minFan || fanCount > maxFan) {
                            toast.info(`domain${domain} fan domain more than ${fanCount}`)
                            continue
                        }
                        const [minIndexed, maxIndexed] = getIndexed()
                        if (result.indexed < minIndexed || result.indexed > maxIndexed) {
                            toast.info(`domain${domain} indexed more than ${result.indexed}`)
                            continue
                        }
                        toast.success(`domain${domain} passed`)
                        // <th className="border p-2">域名</th>
                        // <th className="border p-2">收录</th>
                        // <th className="border p-2">历史包含收录</th>
                        // <th className="border p-2">收录多首页少</th>
                        // <th className="border p-2">连续{years}年有历史</th>
                        // <th className="border p-2">收录标题</th>
                        // <th className="border p-2">历史标题</th>
                        setResults((prev) => {
                            return [...prev, [domain, `${result.indexed}`, `${fanCount}`, `${includeTitleFromBaidu}`, `${manyIndexedButsmallIndexedOnFirstPage}`,`${1}`, `${result.items.map(item => item.title).join(";")}`, `${Object.values(history ?? {}).join(";")}`]]
                        })
                    } catch (ex) { }
                }

            } catch (ex) {

            } finally {
                currentPage++
            }
        }
        setQueryLoading(false)
        //根据条件进行判断
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
            <div className="w-100 flex flex-row justify-around">
                <div>
                    <Range label="收录数量" state={indexed} setState={setIndexed} />
                </div>
                <div>
                    <Range label="泛域名数量" state={fan} setState={setFan} />
                </div>
                <div>
                    <label htmlFor="">连续</label>
                    <input type="number" name="" id="" defaultValue={years} onChange={ev => setYears(Number(ev.target.value))} />
                    <span>年有历史</span>
                </div>
                <div>
                    <label htmlFor="">历史标题包含收录</label>
                    <input type="checkbox" name="" id="" defaultChecked={includeSiteTitleCheck} onChange={ev => setIncludeSiteTitleCheck(ev.target.checked)} />
                </div>
                <div>
                    <label htmlFor="">检查收录多首页少</label>
                    <input type="checkbox" name="" id="" defaultChecked={manyIndexSmallOnIndexCheck} onChange={ev => setManyIndexSmallOnIndexCheck(ev.target.checked)} />
                </div>
                <div>
                    <label htmlFor="">开始时间</label>
                    <DatePicker selected={startTime} onChange={(date: Date | null) => setStartTime(date)} />
                </div>
                <div>
                    <label htmlFor="">结束时间</label>
                    <DatePicker selected={endTime} onChange={(date: Date | null) => setEndTime(date)} />
                </div>
            </div>
            {results && (
                <table className="w-full mt-4 border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">域名</th>
                            <th className="border p-2">收录</th>
                            <th className="border p-2">泛域名数量</th>
                            <th className="border p-2">历史包含收录</th>
                            <th className="border p-2">收录多首页少</th>
                            <th className="border p-2">连续{years}年有历史</th>
                            <th className="border p-2">收录标题</th>
                            <th className="border p-2">历史标题</th>
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
