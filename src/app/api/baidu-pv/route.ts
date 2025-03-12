import MyResponse from "@/components/MyResponse"
import axios from "axios"
import { setConfig } from "next/config"
import { NextRequest, NextResponse } from "next/server"
import { CookieData, PvData } from "@/components/Types"
// import fs from "fs"


let cookie =  ""


export async function POST(req: NextRequest) {
  if(!cookie) return NextResponse.json(MyResponse.failed("请联系管理员更新COOKIE[cookie为空]",10))
  const {keyword} = await req.json()

  const cookies = cookie.split(";").map(item => {
    const [name, value] = item.split("=")
    return { name: name.trim(), value: value.trim() }
  })
  // console.log("allcookies:",await browser.cookies.getAll({}))
  if (cookies.length < 1) {
    return NextResponse.json(MyResponse.failed(`请联系管理员更新COOKIE[cookie格式化失效]`,10))
  }
  // console.log("cookies", cookies)
  const lines = [keyword]
  const params: { logid: number, entry: string, bidWordSource: string, regions: number[], device: number, limit: number[], orderBy: string, order: string, campaignId: null, adgroupId: null, keywordList: { "keywordName": string, "price": null, "matchType": null, "phraseType": null }[] } = { "logid": -1, "entry": "kr_station_bidestimate_tab", "bidWordSource": "wordList", "regions": [1000, 2000, 3000, 4000, 5000, 200000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000, 24000, 25000, 26000, 27000, 28000, 29000, 30000, 31000, 32000, 33000, 34000, 35000, 36000, 300000], "device": 0, "limit": [0, 10000], "orderBy": "", "order": "desc", "campaignId": null, "adgroupId": null, "keywordList": [] }
  const lineobjs = lines.map((word: string) => {
    return { "keywordName": word, "price": null, "matchType": null, "phraseType": null }
  })

  params.keywordList = lineobjs
  const token = cookies.find(cookie => cookie.name == "CPTK_3")?.value ?? ""
  const userid = cookies.find(cookie => cookie.name == "CPID_3")?.value ?? ""
  const fd = new FormData()

  fd.append("params", encodeURIComponent(JSON.stringify(params)))
  fd.append("token", token)
  fd.append("userid", userid)
  fd.append("reqid", "4b534c48-d512-4b4c-2a7b-173632890121")
  fd.append("path", "puppet%2FGET%2FPvSearchFunction%2FgetPvSearch")
  fd.append("source", "aix")

  // const requestBody = fd.toString()

  // console.log("requestBody",requestBody)
  //   await axios.get("https://echo.free.beeceptor.com/", { responseType: "json" })
  const requestUrl = "https://fengchao.baidu.com/hairuo/request.ajax?path=puppet%2FGET%2FPvSearchFunction%2FgetPvSearch&reqid=4b534c48-d512-4b4c-2a7b-173632890121"
  // console.log("cookie",cookie)
  // const response = await fetch(requestUrl, {
  //   method: "post",
  //   headers: {
  //     // "Content-Type": "application/x-www-form-urlencoded",
  //     // "Cookie": cookie,
  //     // "Origin": "https://fengchao.baidu.com",
  //   },
  //   body: fd,
  //   cookie
  // })

  // const jsonData = await response.json()
  const jsonData = await axios.post(requestUrl, [...fd.entries()].reduce((pre,next)=>{
    const [name,value] = next
    if(pre.length == 0) return `${name}=${value}`
    return `${pre}&${name}=${value}`
  },""), {
    responseType: "json",
    headers: {
      "Cookie": cookie,
      "Content-Type":"application/x-www-form-urlencoded"
    },
    // proxy:{
    //   host:"127.0.0.1",
    //   port:8080,
    //   protocol:"http"
    // }
  })
  const data:any[] = jsonData.data?.data?.data ?? []
  if(jsonData.data?.redirect){
    return NextResponse.json(MyResponse.failed(`请联系管理员更新COOKIE[${JSON.stringify({response:jsonData.data,cookie})}]`, 10))
  }
  if(data.length <= 0){
    console.log("jsonData.data",jsonData.data)
    return NextResponse.json(MyResponse.success<PvData>({pv:-1}))
  }
  const [{keywordName,averageMonthPv}] = data
  return NextResponse.json(MyResponse.success<PvData>({pv:averageMonthPv}))
}

//写一个PUT方法用于更新COOKIE

export async function PUT(req: NextRequest) {
  const body = await req.json()
  cookie = body.cookie
  // fs.writeFileSync(cookiePath, cookie)
  return NextResponse.json(MyResponse.success<CookieData>({cookie}))
}

export async function GET(req: NextRequest) {
  return NextResponse.json(MyResponse.success<CookieData>({cookie}))
}