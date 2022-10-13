const axios = require('axios')

module.exports = {
    request_body: async(method, route, body, ctx) => {
        try {
            if (!ctx.session.token) {
                let getToken = await axios({
                    method: "get",
                    url: `http://${process.env.HOST_NAME}/api/tg-data/id`,
                    data: {
                        telegram_id: ctx.from.id,
                        key: process.env.SECRET_KEY
                    }
                })
                if (getToken.status == 200) {
                    ctx.session.token = getToken.data.data[0].token
                }
            }
            const res = await axios({
                method: method,
                url: `http://${process.env.HOST_NAME}/api${route}`,
                data: body,
                headers: {
                    'Authorization': `Bearer ${ctx.session.token}`
                }
            })
            if (res.status == 401) {
                let getToken = await axios({
                    method: "get",
                    url: `http://${process.env.HOST_NAME}/api/tg-data/id`,
                    data: {
                        telegram_id: ctx.from.id,
                        key: process.env.SECRET_KEY
                    }
                })
                if (getToken.status == 200) {
                    ctx.session.token = getToken.data.data[0].token
                    const res2 = await axios({
                        method: method,
                        url: `http://${process.env.HOST_NAME}/api${route}`,
                        data: body,
                        headers: {
                            'Authorization': `Bearer ${ctx.session.token}`
                        }
                    })
                    return res2
                }
                return getToken
            } else {
                return res
            }
        } catch (err) {
            let error
            if (err.code == 'ECONNREFUSED') {
                error = { status: err.code }
                return error
            }
            return err.response
        }
    },
    request: async(method, route, ctx) => {
        try {
            if (!ctx.session.token) {
                let getToken = await axios({
                    method: "get",
                    url: `http://${process.env.HOST_NAME}/api/tg-data/id`,
                    data: {
                        telegram_id: ctx.from.id,
                        key: process.env.SECRET_KEY
                    }
                })
                if (getToken.status == 200) {
                    ctx.session.token = getToken.data.data[0].token
                }
            }
            const res = await axios({
                method: method,
                url: `http://${process.env.HOST_NAME}/api${route}`,
                headers: {
                    'Authorization': `Bearer ${ctx.session.token}`
                }
            })
            if (res.status == 401) {
                let getToken = await axios({
                    method: "get",
                    url: `http://${process.env.HOST_NAME}/api/tg-data/id`,
                    data: {
                        telegram_id: ctx.from.id,
                        key: process.env.SECRET_KEY
                    }
                })
                if (getToken.status == 200) {
                    ctx.session.token = getToken.data.data[0].token
                    const res2 = await axios({
                        method: method,
                        url: `http://${process.env.HOST_NAME}/api${route}`,
                        data: body,
                        headers: {
                            'Authorization': `Bearer ${ctx.session.token}`
                        }
                    })
                    return res2
                }
                return getToken
            } else {
                return res
            }

        } catch (err) {
            let error
            if (err.code == 'ECONNREFUSED') {
                error = { status: err.code }
                return error
            }
            return err.response
        }
    },
    request_body_no_token: async(method, route, body, ctx) => {
        try {
            const res = await axios({
                method: method,
                url: `http://${process.env.HOST_NAME}/api${route}`,
                data: body,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
            if (res.status) {
                return res
            }
        } catch (err) {
            let error
            if (err.code == 'ECONNREFUSED') {
                error = { status: err.code }
                return error
            }
            return err.response
        }
    },
    request_no_token: async(method, route, ctx) => {
        try {
            const res = await axios({
                method: method,
                url: `http://${process.env.HOST_NAME}/api${route}`,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
            if (res.status) {
                return res
            }
        } catch (err) {
            let error
            if (err.code == 'ECONNREFUSED') {
                error = { status: err.code }
                return error
            }
            return err.response
        }
    }
}