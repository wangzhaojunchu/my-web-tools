"use client";
import DataFetch from "@/components/DataFetch";
import { PvData, SearchPCData } from "@/components/Types";
import { pseudoRandomBytes } from "crypto";

export default function BaiduPVPage() {
  const header = ["关键词", "收录", "首页结果数", "泛域名数量","标题"]
  const transformData = (sp:SearchPCData) => {
    const fan=sp.items.filter(item => ![`www.${item.domain}`,`${item.domain}`,`wap.${item.domain}`,`m.${item.domain}`].includes(item.host)).length
    const titles = sp.items.map(item=>item.title).join("<=>")
    return [sp.indexed, sp.indexedOnFirstPage, fan, titles]
  }
  const api = "/api/baidu-search-pc"
  const onKeyword = (keyword:string) => {
    if(!keyword.startsWith("site:")){
      return `site:${keyword}`
    }
    return keyword
  }
  return <DataFetch headers={header} transformData={transformData} api={api} onKeyword={onKeyword}></DataFetch>
}