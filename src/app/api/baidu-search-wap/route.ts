import { NextRequest,NextResponse } from "next/server";
import { BaiduResults, SearchWap } from "baidu";

process.env.debug = "1"
export async function POST(req:NextRequest){
    const body = await req.json()
    const keywords = body.keywords
    console.log("keywords",keywords)
    const BaiduResultsCol:{[key:string]:BaiduResults} = {}
    for (const keyword of keywords) {
        const brs = await new SearchWap().run(keyword,1)
        console.log("brs",brs)
        BaiduResultsCol[keyword] = brs
    }
    

    return NextResponse.json(BaiduResultsCol)
}