const { Markup } = require("telegraf")
let last_error

module.exports = {
    check: async(request, ctx) => {
        try {
            if (request.status == "ECONNREFUSED") {
                let date = new Date()
                let day = date.getDay()
                if (!last_error || last_error != day) {
                    try {
                        last_error = day
                        ctx.telegram.sendMessage(process.env.ADMIN_ID, '❗️Wordloop API is down\nCheckout API logs for terminating problem ')
                    } catch {}
                }
                await ctx.reply('😞')
                await ctx.reply(`Oops...\n\nSome problems occurred\n\nWe are working on solution\n\nPleace, try again later by command /start`)
            }
            if (request.status == 406) {
                await ctx.editMessageText('Acess denied❗️\n\nYou need to log in or register😉', Markup.inlineKeyboard([
                    [Markup.button.callback('Registration🖊️', 'registButton'), Markup.button.callback('Log in↩️', 'loginButton')]
                ]))
            }
        } catch (err) {}

    },
    check_with_reply: async(request, ctx) => {
        try {
            if (request.status == "ECONNREFUSED") {
                let date = new Date()
                let day = date.getDay()
                if (!last_error || last_error != day) {
                    try {
                        last_error = day
                        ctx.telegram.sendMessage(process.env.ADMIN_ID, '❗️Wordloop API is down\nCheckout API logs for terminating problem ')
                    } catch {}
                }
                await ctx.reply('😞')
                await ctx.reply(`Oops...\n\nSome problems occurred\n\nWe are working on solution\n\nPleace, try again later by command /start`)
            }
            if (request.status == 406) {
                await ctx.reply('Acess denied❗️\n\nYou need to log in or register😉', Markup.inlineKeyboard([
                    [Markup.button.callback('Registration🖊️', 'registButton'), Markup.button.callback('Log in↩️', 'loginButton')]
                ]))
            }
        } catch (err) {}

    },
    check_API_down: async(request, ctx) => {
        try {
            if (request.status == "ECONNREFUSED") {
                let date = new Date()
                let day = date.getDay()
                if (!last_error || last_error != day) {
                    try {
                        last_error = day
                        ctx.telegram.sendMessage(process.env.ADMIN_ID, '❗️Wordloop API is down\nCheckout API logs for terminating problem ')
                    } catch {}
                }
                await ctx.reply('😞')
                return ctx.reply(`Oops...\n\nSome problems occurred\n\nWe are working on solution\n\nPleace, try again later by command /start`)
            }
        } catch (err) {}

    }
}