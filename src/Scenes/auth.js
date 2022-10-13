const axios = require('axios')
const { Scenes, Markup } = require('telegraf')
const Helper = require('../helpers/request')
const Secure = require('../helpers/secureAcess')

class RegisterScene {
    registerLogin() {
        const login = new Scenes.BaseScene('singup_login')
        login.enter(async(ctx) => {
            await ctx.reply('Enter login:', Markup.inlineKeyboard([
                [Markup.button.callback('Back⬅️', 'start')]
            ]))
        })
        login.on('text', async(ctx) => {
            ctx.session.login = ctx.message.text
            if (ctx.message.text.length <= 45) {
                if (ctx.session.login) {
                    await ctx.scene.enter('singup_password')
                }
            } else {
                await ctx.reply('❗️Your login is too long\nEnter again to make login less than 45 characters')
            }

        })
        return login
    }

    registerPassword() {
        const password = new Scenes.BaseScene('singup_password')
        password.enter(async(ctx) => {
            await ctx.replyWithHTML(`<b>Enter your password🗝</b>\n<b>💡at least 6 characters</b>`, Markup.inlineKeyboard([
                [Markup.button.callback('Back⬅️', 'start')]
            ]))
        })
        password.on('text', async(ctx) => {
            ctx.session.password = ctx.message.text
            if (ctx.message.text.length >= 6) {
                if (ctx.message.text.length <= 45) {
                    try {
                        const res = await Helper.request_body_no_token('post', '/users/signup', {
                            user_name: ctx.message.from.first_name,
                            user_login: ctx.session.login,
                            user_password: ctx.session.password
                        }, ctx)
                        Secure.check_API_down(res, ctx)
                        if (res.status == 400) {
                            await ctx.reply('Login is taken❗️\nRegister again with another login🔁')
                            await ctx.scene.enter('singup_login')
                        }
                        if (res.status == 201) {
                            await ctx.reply('Automatic login...')
                            const res2 = await Helper.request_body_no_token('post', '/users/login', {
                                user_login: ctx.session.login,
                                user_password: ctx.session.password
                            }, ctx)
                            if (res2.status == 200) {
                                ctx.session.token = res2.data.token
                                try {
                                    await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id)
                                } catch (err) {}
                                const save = await axios({
                                    method: 'post',
                                    url: `http://${process.env.HOST_NAME}/api/tg-data/add/${ctx.update.message.from.id}`,
                                    headers: {
                                        'Authorization': `Bearer ${res2.data.token}`
                                    }
                                })
                                await ctx.reply('✅')
                                await ctx.reply('Use languages button for managing languages, words button for managing your words or word-lists for managing lists of words\nAlso you can create notifications⏱ for word lists', Markup.inlineKeyboard([
                                    [Markup.button.callback('Languges🏁', 'languages'), Markup.button.callback('Words', 'words'), Markup.button.callback('Word lists📜', 'words-lists')]
                                ]))
                            }
                            await ctx.scene.leave()
                        }
                    } catch (err) {
                        console.log(err)
                    }
                } else {
                    await ctx.reply('❗️Your password is too long\nEnter again to make password less than 45 characters')
                }

            } else {
                await ctx.reply('🙄')
                await ctx.reply('Oops\n💡Password must be minimum 6 characters long\nPleace,reenter password')
            }

        })
        return password
    }

    loginLogin() {
        const login_ = new Scenes.BaseScene('login')
        login_.enter(async(ctx) => {
            await ctx.reply('Enter your login:', Markup.inlineKeyboard([
                [Markup.button.callback('Back⬅️', 'start')]
            ]))
        })
        login_.on('text', async(ctx) => {
            ctx.session.login = ctx.message.text
            if (ctx.message.text.length <= 45) {
                await ctx.scene.enter('login_password')
            } else {
                await ctx.reply('❗️Your login  is too long\nEnter again to make login less than 45 characters')
            }

        })
        return login_
    }

    loginPassword() {
        const login_password = new Scenes.BaseScene('login_password')
        login_password.enter(async(ctx) => {
            await ctx.replyWithHTML(`<b>Enter your password🗝</b>\n<b>💡at least 6 characters</b>`, Markup.inlineKeyboard([
                [Markup.button.callback('Back⬅️', 'start')]
            ]))
        })
        login_password.on('text', async(ctx) => {
            ctx.session.password = ctx.message.text
            if (ctx.message.text.length <= 45) {
                if (ctx.session.password) {
                    await ctx.reply('Trying to login...')
                    const request = async() => {
                        try {
                            const res = await axios.post(`http://${process.env.HOST_NAME}/api/users/login`, {
                                user_login: ctx.session.login,
                                user_password: ctx.session.password
                            }, { headers: { 'Content-Type': 'application/json; charset=utf-8' } })
                            Secure.check_API_down(res, ctx)
                            if (res.status == 200) {
                                const save = await axios({
                                    method: 'post',
                                    url: `http://${process.env.HOST_NAME}/api/tg-data/add/${ctx.update.message.from.id}`,
                                    headers: {
                                        'Authorization': `Bearer ${res.data.token}`
                                    }
                                })
                                try {
                                    await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id)
                                } catch (err) {}
                                await ctx.reply('✅')
                                await ctx.reply('Use languages button for managing languages, words button for managing your words or word-lists for managing lists of words\nAlso you can create notifications⏱ for word lists', Markup.inlineKeyboard([
                                    [Markup.button.callback('Languges🏁', 'languages'), Markup.button.callback('Words', 'words'), Markup.button.callback('Word lists📜', 'words-lists')]
                                ]))
                            }
                        } catch (err) {
                            if (err) {
                                console.log(err)
                                await ctx.reply(err.response.data.message)
                                await ctx.scene.enter('login')
                            }
                        }
                    }
                    request()
                    await ctx.scene.leave()
                }
            } else {
                await ctx.reply('❗️Your password is too long\nEnter again to make password less than 45 characters')
            }

        })
        return login_password
    }
}

module.exports = RegisterScene