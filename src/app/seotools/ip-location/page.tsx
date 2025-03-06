"use client";
import DataFetch from "@/components/DataFetch";


export default function DropdownPage() {
  const header = ["域名", "IP", "归属地"]
  const transformData = (data:any) => {
    const {ip, location} = data
    return [ip, location.country]
  }
  const api = "/api/ip-location"
  return <DataFetch headers={header} transformData={transformData} api={api}></DataFetch>
}