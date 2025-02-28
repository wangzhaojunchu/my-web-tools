import { BaiduResults, SearchWap } from "baidu";
// import * as Celery from "celery-ts";
import celery from "celery-node"

const worker = celery.createWorker(
    "amqp://",
    "amqp://"
  );
  worker.register("tasks.add", (a:number, b:number) => a + b);
  worker.start();

//定义多个TASK

// worker.register("tasks.getBaiduResults",async (word:string) => {
//     return await new SearchWap().run(word,1)
// })

// worker.register("tasks.getIpLocation", (word:string) => {
//     return 
// })