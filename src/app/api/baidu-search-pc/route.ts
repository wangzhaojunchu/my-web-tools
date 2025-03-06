import { NextRequest,NextResponse } from "next/server";
import { BaiduResults, SearchPC, SearchWap } from "baidu";
import MyResponse from "@/components/MyResponse";
import { SearchPCData } from "@/components/Types";

export async function POST(req:NextRequest){
    const {keyword} = await req.json()
    try{
        const brs = await new SearchPC().run(keyword,1)
        return Response.json(MyResponse.success<SearchPCData>( brs))
    }catch(ex){
        return Response.json(MyResponse.failed((ex as Error).message, 20))
    }
}