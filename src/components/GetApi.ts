import MyResponse from "./MyResponse";
import { Keyword } from "./Types";

export default async function GetApi<T>(api:string,data:Keyword):Promise<MyResponse<T>>{
    const response = await fetch("/api/dropdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return await response.json()
}