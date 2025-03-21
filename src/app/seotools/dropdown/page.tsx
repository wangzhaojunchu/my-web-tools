"use client";
import DataFetch from "@/components/DataFetch";
import { useState } from "react";

export default function DropdownPage() {
  const header = ["关键词", "下拉词"]
  const transformData = ({dropdownWords}:any) => {
    return dropdownWords.map((word:string) => {
      return [word]
    })
  }
  const api = "/api/dropdown"
  return <DataFetch headers={header} transformData={transformData} api={api}></DataFetch>
}