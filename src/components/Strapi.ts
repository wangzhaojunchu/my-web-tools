export async function Post(api: string, body: any):Promise<string> {
    const response = await fetch(api, {
        method: "post",
        body: JSON.stringify({ data: body }),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer e6b42202a694cc159db3aa99a10ca36959897982c166f0dad7d7b2bc467334bfa343496ef491385cb8248ac96de5369fd7fa04fed08b9cce9d6d759af79adf196d08d6e340636fcb0cdbda70826819fe8cb970ddab8027c95f68cd2874cff3ce31a1d043289cdbb4287885244a2bd17767016fb551404bd3e99b760a7056c738"
        }
    })
    if (response.ok) {
        const content = await response.json()
        return await content?.data?.documentId
    }

    throw new Error(`status code is ${response.status}`)
}

export async function Get(api: string):Promise<any> {
    const response = await fetch(api, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer e6b42202a694cc159db3aa99a10ca36959897982c166f0dad7d7b2bc467334bfa343496ef491385cb8248ac96de5369fd7fa04fed08b9cce9d6d759af79adf196d08d6e340636fcb0cdbda70826819fe8cb970ddab8027c95f68cd2874cff3ce31a1d043289cdbb4287885244a2bd17767016fb551404bd3e99b760a7056c738"
        }
    })
    if (response.ok) {
        const content = await response.json()
        return content
    }

    throw new Error(`status code is ${response.status}`)
}