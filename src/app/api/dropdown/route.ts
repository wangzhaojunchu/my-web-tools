import { NextRequest, NextResponse } from "next/server";
import MyResponse from "@/components/MyResponse";
import { DropdownData } from "@/components/Types";
export async function POST(req: NextRequest) {

    const { keyword } = await req.json()
    try {
        const response = await fetch("https://m.baidu.com/sugrec?prod=wise&wd=" + encodeURIComponent(keyword))
        const jsonData = await response.json()
        const dropdownWords = jsonData.g?.map((item: any) => item.q) ?? []
        return NextResponse.json(MyResponse.success<DropdownData>(dropdownWords))
    } catch (ex) {
        return NextResponse.json(MyResponse.success<DropdownData>([]))
    }
}

export async function GET(req: NextRequest) {
    return NextResponse.json([])
}