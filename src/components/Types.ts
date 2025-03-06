import { BaiduResults } from "baidu"

export type PvData = {
    pv:number
}

export type CookieData = {
    cookie:string
}

export type SearchWapData = BaiduResults

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

