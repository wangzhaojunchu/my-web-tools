import { BaiduResults } from "baidu"

export type PvData = {
    pv:number
}

export type CookieData = {
    cookie:string
}

export type SearchWapData = BaiduResults
export type SearchPCData = BaiduResults

export type DropdownData = {dropdownWords:string[]}

export type IpLocationData = {
    ip?:string
    location:{
        country?: string
        region?:string
        city?:string
        range?:number[]
    }
}

export type Keyword = {
    keyword:string
}

export type Actions = "BaiduPCSearch" | "BaiduWapSearch" | "IPLocation" | "Dropdown"

//用于web《=》客户端消息格式
export type Message = {
    id: string
    keyword:string
    action: Actions
}

export type ResponseMessage<T> = {
    id: string
    keyword:string
    data: T
}