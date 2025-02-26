"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              工具
            </button>

            {/* 下拉菜单 */}
            {dropdownOpen && (
              <div className="absolute bg-white text-black rounded shadow-md mt-2 w-40">
                <Link href="/tools" className="block px-4 py-2 hover:bg-gray-100">所有工具</Link>
                <Link href="/tools/replace_multi_line" className="block px-4 py-2 hover:bg-gray-100">批量替换</Link>
                <Link href="/tools/cloudflare" className="block px-4 py-2 hover:bg-gray-100">cloudflare</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
