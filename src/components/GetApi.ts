import { toast } from "react-toastify";
import MyResponse from "./MyResponse";
import Sleep from "./Sleep";
import { Keyword } from "./Types";

export default async function GetApi<T>(api:string,data:Keyword):Promise<MyResponse<T>>{
    const response = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    const apiResponse:MyResponse<T> = await response.json()
    if(apiResponse.code == 200) return apiResponse
    if(apiResponse.retry == 0) throw new Error("retry jump")
    toast.error(apiResponse.msg)
    toast.info(`API[${api}]请求重试中，等待`, {autoClose: apiResponse.retry*1000})
    await Sleep(apiResponse.retry*1000)
    return await GetApi<T>(api,data)
}