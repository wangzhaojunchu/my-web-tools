"use client";
import DataFetch from "@/components/DataFetch";
import { BaiduResults } from "baidu";
import { useState } from "react";

export default function BaiduPVPage() {
  const header = ["关键词", "索引", "数量", "标题","host","展示名称"]
  const transformData = ({indexed,indexedOnFirstPage,items}:BaiduResults) => {
    return items.map(br => {
      return [indexed,indexedOnFirstPage,br.title,br.host,br.showName]
    })
    
  }
  const api = "/api/baidu-search-wap"
  return <DataFetch headers={header} transformData={transformData} api={api}></DataFetch>
}