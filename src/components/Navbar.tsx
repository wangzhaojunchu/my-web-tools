"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">UP工具</Link>

        <div className="flex space-x-6">
          <Link href="/" className="hover:text-gray-300">首页</Link>

          {/* 工具菜单 */}
          <div className="relative">
            <button
              className="hover:text-gray-300"
              onClick={() => setDropdownOpen(dropdownOpen == "tools" ? null : "tools")}
            >
              工具
            </button>
            {/* 下拉菜单 */}
            {dropdownOpen == "tools" && (
              <div className="absolute bg-white text-black rounded shadow-md mt-2 w-40">
                <Link href="/tools" className="block px-4 py-2 hover:bg-gray-100">所有工具</Link>
                <Link href="/tools/replace-multi-line" className="block px-4 py-2 hover:bg-gray-100">批量替换</Link>
                <Link href="/tools/cloudflare" className="block px-4 py-2 hover:bg-gray-100">cloudflare</Link>
           </div>
            )}

          </div>

          <div className="relative">
            <button
              className="hover:text-gray-300"
              onClick={() => setDropdownOpen(dropdownOpen == "seotools" ? null : "seotools")}
            >
              SEO工具
            </button>


            {dropdownOpen == "seotools" && (
              <div className="absolute bg-white text-black rounded shadow-md mt-2 w-40">
                <Link href="/tools" className="block px-4 py-2 hover:bg-gray-100">所有工具</Link>
                <Link href="/seotools/ip-location" className="block px-4 py-2 hover:bg-gray-100">域名归属地查询</Link>
                <Link href="/seotools/dropdown" className="block px-4 py-2 hover:bg-gray-100">下拉词查询</Link>
                <Link href="/seotools/baidu-pv" className="block px-4 py-2 hover:bg-gray-100">百度流量查询</Link>
                <Link href="/seotools/baidu-search-wap" className="block px-4 py-2 hover:bg-gray-100">百度搜索查询</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
