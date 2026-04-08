import axios from "axios";

export class GraphqlClient {
    baseUrl: string = "";
    constructor(url: string) {
        this.baseUrl = url
    };
    async query(req: any) {
        let headers: any = {
            'Content-Type': 'application/json',
        }
        if (localStorage.getItem('token')) {
            headers['authorization'] = localStorage.getItem('token') ?? ""
        }
        let response = await axios.request({
            method: 'POST',
            data: req,
            headers: headers,
            url: this.baseUrl,
        })

        if (response.data.errors) {
            window.$notification["error"]({
                content: 'Call tee chain error',
                meta: response.data.errors[0].message,
                duration: 2500,
                keepAliveOnHover: true
            })
            throw new Error(response.data.errors[0].message)
        }

        // console.log(response)
        return response.data.data
    };


    async mut(req: any) {
        return this.query(req)
    };
}

