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
            const msg = response.data.errors[0].message as string
            window.$toast?.add({
                title: 'Call tee chain error',
                description: msg,
                color: 'error',
                duration: 2500,
            })
            throw new Error(msg)
        }

        // console.log(response.data.data)
        return response.data.data
    };


    async mut(req: any) {
        return this.query(req)
    };
}

