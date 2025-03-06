import { useState } from "react";
import MyResponse from "./MyResponse";
import { ToastContainer, toast } from 'react-toastify';
import GetApi from "./GetApi";
import Sleep from "./Sleep";
import { PvData, SearchWapData } from "./Types";
interface DataFetchProps {
  api: string
  headers: string[];
  transformData: (data: any) => any[];
  onKeyword?: (keyword:string)=>string
}

export default function DataFetch({ api, headers, transformData,onKeyword = (keyword:string):string => keyword }: DataFetchProps) {
  const [input, setInput] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<any[][]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const isMultiArray = (arr: any): arr is any[][] => {
    return Array.isArray(arr) && arr.length > 0 && Array.isArray(arr[0]);
  };
  const fetchData = async (lines: string[]) => {
    setLoading(true);
    while (lines.length > 0) {
      const line = lines.shift()
      if (line && line.trim()) {
        const keyword = onKeyword(line)
        const {data} = await GetApi(api, { keyword })

        const transformed = transformData(data);
        setResults((prev) => [...prev, ...isMultiArray(transformed) ? transformed.map(item=>[keyword,...item]) : [[keyword,...transformed]]]);
      }
    }
    setLoading(false);
  }


  const handleTextFetch = () => {
    const lines = input.split("\n").map((line) => line.trim()).filter(Boolean);
    fetchData(lines);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);
      fetchData(lines);
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 space-y-4">
      <ToastContainer />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入多个关键词，每行一个"
        className="w-full h-24 p-2 border rounded"
      />
      <input type="file" accept=".txt" onChange={handleFileUpload} className="block w-full border p-2 rounded" />
      <button
        onClick={handleTextFetch}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        {loading ? "请求中..." : "开始请求"}
      </button>
      <div className="border p-4 rounded">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              {headers.map((header, index) => (
                <th key={index} className="border border-gray-300 p-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => (
              <tr key={index} className="odd:bg-gray-100">
                {row.map((cell, i) => (
                  <td key={i} className="border border-gray-300 p-2">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
