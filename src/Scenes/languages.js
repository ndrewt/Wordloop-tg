const axios = require('axios')
const { Scenes, Markup } = require('telegraf')
const RequestHelper = require('../helpers/request')
const Keyboard_generator = require('../helpers/KeyboardGenerator')
const Secure = require('../helpers/secureAcess')


class Languages {
    add_language() {
        const add_lang = new Scenes.BaseScene('add_language')
        add_lang.enter(async(ctx) => {
            await ctx.editMessageText('Enter language name:')
        })
        add_lang.on('text', async(ctx) => {
            let name = ctx.message.text
            console.log(name.length)
            if (name.length <= 45) {
                try {
                    const res = await RequestHelper.request_body('post', '/languages/add', { lang_name: name }, ctx)

                    Secure.check_with_reply(res, ctx)
                    if (res.status == 201) {
                        await ctx.reply(`${name} successfully added✅`, Markup.inlineKeyboard([
                            [Markup.button.callback('Add more🔁', 'add_lang_again'), Markup.button.callback('Back to languages◀️', 'languages')]
                        ]))
                        await ctx.scene.leave()
                    }
                    if (res.status == 400) {
                        await ctx.replyWithHTML(`<b>${name}</b> is taken, enter another one❗️`)
                    }
                } catch (err) {
                    console.log(err)
                }
            } else {
                await ctx.reply('❗️Your language name is too long\nEnter again to make language name less than 45 characters')
            }

        })
        return add_lang
    }

    all_langs() {
        const all_langs = new Scenes.BaseScene('all_langs')
        all_langs.enter(async(ctx) => {
            try {
                const res = await RequestHelper.request('get', '/languages/all', ctx)

                Secure.check(res, ctx)
                if (res.status == 404) {
                    await ctx.editMessageText(`Language list is empty❗️`, Markup.inlineKeyboard([
                        [Markup.button.callback('Add➕', 'add_lang')],
                        [Markup.button.callback('Back to main menu◀️', 'back-main')]
                    ]))
                }
                if (res.status == 200) {
                    const keyboard = await Keyboard_generator.keyboardGenerator_langs(res, ctx.session.lang_counter, 'lng')
                    await ctx.editMessageText(`Add➕ language or tab to language you want to manage🪡 `, {
                        reply_markup: {
                            inline_keyboard: keyboard
                        }
                    })
                }
                await ctx.scene.leave()
            } catch (err) {
                console.log(err)
            }
        })
        return all_langs
    }
    all_langs2() {
        const all_langs2 = new Scenes.BaseScene('all_langs2')
        all_langs2.enter(async(ctx) => {
            try {
                const res = await RequestHelper.request('get', '/languages/all', ctx)

                Secure.check_with_reply(res, ctx)
                if (res.status == 404) {
                    await ctx.reply(`Language list is empty❗️`, Markup.inlineKeyboard([
                        [Markup.button.callback('Add language➕', 'add_lang')],
                        [Markup.button.callback('Back to main menu◀️', 'back-main')]
                    ]))
                }
                if (res.status == 200) {
                    const keyboard = await Keyboard_generator.keyboardGenerator_langs(res, ctx.session.lang_counter, 'lng')
                    await ctx.reply(`Add➕ language or tap to language you want to manage🪡 `, {
                        reply_markup: {
                            inline_keyboard: keyboard
                        }
                    })
                }
                await ctx.scene.leave()
            } catch (err) {
                console.log(err)
            }
        })
        return all_langs2
    }
    one_lang() {
        const one_lang = new Scenes.BaseScene('one_lang')
        one_lang.enter(async(ctx) => {
            if (ctx.session.selected_lang) {
                const res = await RequestHelper.request('get', `/languages/id/${ctx.session.selected_lang}`, ctx)

                Secure.check(res, ctx)
                if (res.status == 200) {
                    ctx.session.lang_name = res.data.data[0].lang_name
                    await ctx.editMessageText(`${res.data.data[0].lang_name} is selected🛸\n\nYou can delete ❌ or edit✏️ ${res.data.data[0].lang_name} language`, Markup.inlineKeyboard([
                        [Markup.button.callback('Delete❌', 'delete_lang'), Markup.button.callback('Edit language✏️', 'edit_lang')],
                        [Markup.button.callback('Back to languages⬅️', 'languages')]
                    ]))

                }
            } else {
                await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                    [Markup.button.callback('Back to languages⬅️', 'languages')]
                ]))
            }
            await ctx.scene.leave()
        })
        return one_lang
    }
    delete_lang() {
        const deleteLang = new Scenes.BaseScene('delete_language')
        deleteLang.enter(async(ctx) => {
            if (ctx.session.selected_lang) {
                const res = await RequestHelper.request('delete', `/languages/delete/${ctx.session.selected_lang}`, ctx)

                Secure.check(res, ctx)
                if (res.status == 200) {
                    await ctx.editMessageText(`${ctx.session.lang_name} is deleted✅`, Markup.inlineKeyboard([
                        [Markup.button.callback('Back to languages⬅️', 'languages')]
                    ]))
                }
            } else {
                await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                    [Markup.button.callback('Back to languages⬅️', 'languages')]
                ]))
            }
            await ctx.scene.leave()
        })
        return deleteLang
    }
    edit_lang_main() {
        const edit_lang_main = new Scenes.BaseScene('edit_lang_main')
        edit_lang_main.enter(async(ctx) => {
            await ctx.editMessageText('Enter new language name:')
        })
        edit_lang_main.on('text', async(ctx) => {
            let name = ctx.message.text
            if (name.length <= 45) {
                try {
                    if (ctx.session.selected_lang) {
                        const res = await RequestHelper.request_body('put', `/languages/update`, {
                            "lang_id": ctx.session.selected_lang,
                            "lang_name": name
                        }, ctx)

                        Secure.check_with_reply(res, ctx)
                        if (res.status == 201) {
                            await ctx.reply(`${name} successfully edited✅`, Markup.inlineKeyboard([
                                [Markup.button.callback('Back to menu⬅️', 'languages')]
                            ]))
                            await ctx.scene.leave()
                        }
                    } else {
                        await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                            [Markup.button.callback('Back to languages⬅️', 'languages')]
                        ]))
                    }
                } catch (err) {
                    console.log(err)
                }
            } else {
                await ctx.reply('❗️Your language name is too long\nEnter again to make language name less than 45 characters')
            }

        })
        return edit_lang_main
    }

}

module.exports = Languages