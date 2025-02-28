import axios from "axios"
import { NextRequest, NextResponse } from "next/server"


let cookie: string = ""


export async function POST(req: NextRequest) {
  const body = await req.json()
  const keywords = body.keywords
  
  const cookies = cookie.split(";").map(item => {
    const [name, value] = item.split("=")
    return { name: name.trim(), value: value.trim() }
  })
  // console.log("allcookies:",await browser.cookies.getAll({}))
  if (cookies.length < 1) {
    throw new Error("cookie not found")
  }
  // console.log("cookies", cookies)
  const lines = keywords
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
  console.log("jsonData.data.data.data",jsonData.data.data.data)
  const result = jsonData.data.data.data.reduce((pre: any, next: any) => {
    return { ...pre, [next.keywordName]: next.averageMonthPv }
  }, {})
  console.log("result",result)
  return NextResponse.json(result)
}

//写一个PUT方法用于更新COOKIE

export async function PUT(req: NextRequest) {
  const body = await req.json()
  cookie = body.cookie
  return NextResponse.json({})
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ cookie })
}