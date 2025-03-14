"use client";
import DataFetch from "@/components/DataFetch";
import { PvData } from "@/components/Types";

export default function BaiduPVPage() {
  const header = ["关键词", "流量"]
  const transformData = ({pv}:any) => {
    return [pv]
  }
  const api = "/api/baidu-pv"
  return <DataFetch headers={header} transformData={transformData} api={api}></DataFetch>
}