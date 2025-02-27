import { NextRequest, NextResponse } from "next/server";

export  async function POST(req:NextRequest){
    const {keyword} = await req.json()
    const response = await fetch("https://m.baidu.com/sugrec?prod=wise&wd=" + encodeURIComponent(keyword))
    const jsonData = await response.json()
    const dropdownWords = jsonData.g.map((item: any) => item.q)
    return NextResponse.json(dropdownWords)
}

export  async function GET(req:NextRequest){
    return NextResponse.json([])
}