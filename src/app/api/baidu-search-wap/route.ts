import { NextRequest,NextResponse } from "next/server";
import { BaiduResults, SearchWap } from "baidu";
import MyResponse from "@/components/MyResponse";
import { SearchWapData } from "@/components/Types";
process.env.debug = "1"
export async function POST(req:NextRequest){
    const {keyword} = await req.json()
    try{
        const brs = await new SearchWap().run(keyword,1)
        return Response.json(MyResponse.success<SearchWapData>( brs))
    }catch(ex){
        return Response.json(MyResponse.failed((ex as Error).message, 1000))
    }
}