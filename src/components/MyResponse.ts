export default class MyResponse<T> {
    public code: number;
    public msg: string;
    public retry: number;
    public data: T;

    constructor(code: number, msg: string, retry: number = 0, data: T) {
        this.code = code;
        this.msg = msg;
        this.retry = retry;
        this.data = data;
    }

    public static success<T>(data: T) {
        return new MyResponse<T>(200, "ok", 0, data);
    }

    public static failed(msg: string, retry: number = 0, code: number = 403) {
        return new MyResponse<null>(code, msg, retry, null);
    }
}