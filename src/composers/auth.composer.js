const { Markup, Composer } = require('telegraf')
const Helper = require('../helpers/request')
const composer = new Composer()
const Secure = require('../helpers/secureAcess')

composer.command('start', async(ctx) => {
    try {
        const data = await Helper.request_body_no_token('get', '/tg-data/id', {
            telegram_id: ctx.from.id,
            key: process.env.SECRET_KEY
        }, ctx)

        Secure.check_API_down(data, ctx)
        if (data.status == 200) {
            // await ctx.replyWithHTML('<b>You are already loggined, use buttons below👇</b>')
            await ctx.reply('Use languages button for managing languages, words button for managing your words or word-lists for managing lists of words\nAlso you can create notifications⏱ for word lists', Markup.inlineKeyboard([
                [Markup.button.callback('Languges🏁', 'languages'), Markup.button.callback('Words', 'words'), Markup.button.callback('Word lists📜', 'words-lists')]
            ]))
        }
        if (data.status == 406) {
            await ctx.reply(`Hello,${ctx.message.from.first_name} before using our bot you need to register or log in. Press button below👇`, Markup.inlineKeyboard([
                [Markup.button.callback('Registration🖊️', 'registButton'), Markup.button.callback('Log in↩️', 'loginButton')]
            ]))
        }
    } catch (err) {
        console.log(err)
    }
})
composer.action('start', async(ctx) => {
    try {
        const data = await Helper.request_body_no_token('get', '/tg-data/id', {
            telegram_id: ctx.update.callback_query.from.id,
            key: process.env.SECRET_KEY
        }, ctx)
        Secure.check_API_down(data, ctx)
        if (data.status == 200) {
            // await ctx.replyWithHTML('<b>You are already loggined, use buttons below👇</b>')
            await ctx.reply('Use languages button for managing languages, words button for managing your words or word-lists for managing lists of words\nAlso you can create notifications⏱ for word lists', Markup.inlineKeyboard([
                [Markup.button.callback('Languges🏁', 'languages'), Markup.button.callback('Words', 'words'), Markup.button.callback('Word lists📜', 'words-lists')]
            ]))
        }
        if (data.status == 406) {
            await ctx.reply(`Hello,${ctx.update.callback_query.from.first_name} before using our bot you need to register or log in. Press button below👇`, Markup.inlineKeyboard([
                [Markup.button.callback('Registration🖊️', 'registButton'), Markup.button.callback('Log in↩️', 'loginButton')]
            ]))
        }
    } catch (err) {
        console.log(err)
    }
})

composer.action('loginButton', async(ctx) => {
    await ctx.answerCbQuery()
    try {
        const data = await Helper.request_body_no_token('get', '/tg-data/id', {
            telegram_id: ctx.from.id,
            key: process.env.SECRET_KEY
        }, ctx)

        Secure.check_API_down(data, ctx)
        if (data.status == 200) {
            await ctx.replyWithHTML('<b>You are already loggined😉</b>', Markup.inlineKeyboard([
                [Markup.button.callback('Back to menu◀️', 'back-main')]
            ]))
        }
        if (data.status == 406) {
            await ctx.scene.enter('login')
        }
    } catch (err) {
        console.log(err)
    }
})

composer.action('registButton', async(ctx) => {
    try {
        const data = await Helper.request_body_no_token('get', '/tg-data/id', {
            telegram_id: ctx.from.id,
            key: process.env.SECRET_KEY
        }, ctx)

        Secure.check_API_down(data, ctx)
        if (data.status == 200) {
            await ctx.replyWithHTML('<b>You are already loggined😉</b>', Markup.inlineKeyboard([
                [Markup.button.callback('Back to menu◀️', 'back-main')]
            ]))
        }
        if (data.status == 406) {
            await ctx.scene.enter('singup_login')
        }
    } catch (err) {
        console.log(err)
    }
})

composer.command("login", async(ctx) => {
    try {
        const data = await Helper.request_body_no_token('get', '/tg-data/id', {
            telegram_id: ctx.from.id,
            key: process.env.SECRET_KEY
        }, ctx)

        Secure.check_API_down(data, ctx)
        if (data.status == 200) {
            await ctx.reply(`You are already loggined😉`, Markup.inlineKeyboard([
                [Markup.button.callback('Back to menu◀️', 'back-main')]
            ]))
        }
        if (data.status == 406) {
            await ctx.scene.enter('login')
        }
    } catch (err) {
        console.log(err)
    }
})

composer.command("logout", async(ctx) => {
    try {
        const data = await Helper.request_body_no_token('get', '/tg-data/id', {
            telegram_id: ctx.from.id,
            key: process.env.SECRET_KEY
        }, ctx)
        Secure.check_API_down(data, ctx)
        if (data.status == 200) {
            const res = await Helper.request('delete', `/tg-data/delete/${ctx.from.id}`, ctx)
            if (res.status == 200) {
                ctx.session = null
                console.log(ctx.session)
                await ctx.reply(`Successfull log out✅\n\nI will miss, be glad to see you again😉\n\nYou can login any time by command /login`)
            }
        }
        if (data.status == 404) {
            await ctx.reply('You are not loggined.😉\nIf you want register or log in, click one of the following buttons.😉', Markup.inlineKeyboard([
                [Markup.button.callback('Registration🖊️', 'registButton'), Markup.button.callback('Log in↩️', 'loginButton')]
            ]))
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = composer