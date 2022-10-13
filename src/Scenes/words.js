const axios = require('axios')
const { Scenes, Markup } = require('telegraf')
const RequestHelper = require('../helpers/request')
const Keyboard_generator = require('../helpers/KeyboardGenerator')
const Secure = require('../helpers/secureAcess')


class WordsScene {
    words_add_lang1() {
        const lang_select = new Scenes.BaseScene('words_select_lang')
        lang_select.enter(async(ctx) => {
            ctx.session.delete_passed = false
            ctx.session.words_add_isSecond_word_add = false
            try {
                let res = await RequestHelper.request('get', '/languages/all', ctx)

                Secure.check(res, ctx)
                if (res.status == 404) {
                    await ctx.editMessageText(`To make a word, you must have at least two languages.❗️`, Markup.inlineKeyboard([
                        [Markup.button.callback('Add language🔁', 'add_lang')],
                        [Markup.button.callback('Back to main menu◀️', 'back-main')]
                    ]))
                }
                if (res.status == 200) {
                    if (res.data.data.length >= 2) {
                        const keyboard = await Keyboard_generator.keyboardGenerator_words_add(res, ctx.session.words_add_counter, '1lng', ctx, 'wrd_add')
                        keyboard.push([{ 'text': 'Back to menu◀️', 'callback_data': ('words') }])
                        await ctx.editMessageText(`Pleace, select first language which you want to use⏬ `, {
                            reply_markup: {
                                inline_keyboard: keyboard
                            }
                        })
                    } else {
                        await ctx.editMessageText(`To make a word, you must have at least two languages.❗️`, Markup.inlineKeyboard([
                            [Markup.button.callback('Add language🔁', 'add_lang')],
                            [Markup.button.callback('Back to main menu◀️', 'back-main')]
                        ]))
                    }
                }
                await ctx.scene.leave()
            } catch (err) {
                console.log(err)
            }
        })
        return lang_select
    }
    words_add_lang2() {
        const lang_select_2 = new Scenes.BaseScene('words_select_lang2')
        lang_select_2.enter(async(ctx) => {
            try {
                let res = await RequestHelper.request('get', '/languages/all', ctx)

                Secure.check(res, ctx)
                if (res.status == 200) {
                    ctx.session.words_add_isSecond_word_add = true
                    const keyboard = await Keyboard_generator.keyboardGenerator_words_add(res, ctx.session.words_add_counter, '2lng', ctx, 'wrd_add')
                    keyboard.push([{ 'text': 'Back to menu◀️', 'callback_data': ('words') }])

                    await ctx.editMessageText(`Pleace, select second language which you want to use⏬`, {
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
        return lang_select_2
    }
    words_add_1() {
        const word_add_1 = new Scenes.BaseScene('add_word_1')
        word_add_1.enter(async(ctx) => {
            if (ctx.session.selected_lng1) {
                let res = await RequestHelper.request('get', `/languages/id/${ctx.session.selected_lng1}`, ctx)

                Secure.check(res, ctx)
                if (res.status == 200) {
                    await ctx.reply(`Enter fist word for ${res.data.data[0].lang_name} language: `)
                }
                if (res.status == 404) {
                    await ctx.reply(`Not found language`, Markup.inlineKeyboard([
                        [Markup.button.callback('Back to words⬅️', 'words')]
                    ]))
                }
            } else {
                await ctx.editMessageText('😞Something went wrong, please try again or later', Markup.inlineKeyboard([
                    [Markup.button.callback('Back to words⬅️', 'words')]
                ]))
            }
        })
        word_add_1.on('text', async(ctx) => {
            ctx.session.word1 = ctx.message.text
            if (ctx.message.text.length <= 45) {
                await ctx.scene.enter('add_word_2')
            } else {
                await ctx.reply('❗️Your word is too long\nEnter again to make word less than 45 characters')
            }
        })
        return word_add_1
    }
    words_add_2() {
        const word_add_2 = new Scenes.BaseScene('add_word_2')
        word_add_2.enter(async(ctx) => {
            if (ctx.session.selected_lng2) {
                let res = await RequestHelper.request('get', `/languages/id/${ctx.session.selected_lng2}`, ctx)

                Secure.check(res, ctx)
                if (res.status == 200) {
                    await ctx.reply(`Enter fist word for ${res.data.data[0].lang_name} language: `)
                }
                if (res.status == 404) {
                    await ctx.reply(`Not found language`, Markup.inlineKeyboard([
                        [Markup.button.callback('Back to words⬅️', 'words')]
                    ]))
                }
            } else {
                await ctx.editMessageText('😞Something went wrong, please try again or later', Markup.inlineKeyboard([
                    [Markup.button.callback('Back to words⬅️', 'words')]
                ]))
            }
        })
        word_add_2.on('text', async(ctx) => {
            ctx.session.word2 = ctx.message.text
            if (ctx.message.text.length <= 45) {
                await ctx.scene.enter('word_add_desc')
            } else {
                await ctx.reply('❗️Your word is too long\nEnter again to make language name less than 45 characters')
            }
        })
        return word_add_2
    }
    words_add_desc() {
        const word_add_desc = new Scenes.BaseScene('word_add_desc')
        word_add_desc.enter(async(ctx) => {
            let answer = await ctx.reply('Enter description\n💡If you don`t need a description, click the button "skip"', Markup.inlineKeyboard([
                [Markup.button.callback('Skip', 'skip_add_desc')]
            ]))
            ctx.session.to_delete_msg_id = answer.message_id
        })
        word_add_desc.on('text', async(ctx) => {
            ctx.session.delete_passed == false
            ctx.session.desc = ctx.message.text
            await ctx.scene.enter('word_add_res')
        })
        return word_add_desc
    }

    words_add_res() {
        const word_add_res = new Scenes.BaseScene('word_add_res')
        word_add_res.enter(async(ctx) => {
            if (ctx.session.delete_passed == false) {
                await ctx.telegram.deleteMessage(ctx.chat.id, ctx.session.to_delete_msg_id)
                await ctx.telegram.deleteMessage(ctx.chat.id, ctx.update.message.message_id)
            }
            try {
                if (ctx.session.word1) {
                    const res = await RequestHelper.request_body('post', '/words/add', {
                        word_lang1: ctx.session.word1,
                        word_lang2: ctx.session.word2,
                        lang1_id: ctx.session.selected_lng1,
                        lang2_id: ctx.session.selected_lng1,
                        description: ctx.session.desc
                    }, ctx)

                    Secure.check_with_reply(res, ctx)
                    if (res.status == 201) {
                        let resultt = ``
                        if (ctx.session.desc != ' ') {
                            resultt += `<b>${ctx.session.word1}</b> - <b>${ctx.session.word2}</b>\nDescription: <b>${ctx.session.desc}</b>`
                        } else {
                            resultt += `<b>${ctx.session.word1}</b> - <b>${ctx.session.word2}</b>`
                        }
                        ctx.session.selected_lng1 = undefined
                        await ctx.replyWithHTML(`Successfully added✅ \n${resultt}`, Markup.inlineKeyboard([
                            [Markup.button.callback('Add more🔁', 'add_word'), Markup.button.callback('Back to words⬅️', 'words')]
                        ]))
                    }
                } else {
                    await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                        [Markup.button.callback('Back to words⬅️', 'words')]
                    ]))
                }
                await ctx.scene.leave()
            } catch (err) {
                console.log(err)
            }
        })
        return word_add_res
    }

    words_all() {
        const words_all = new Scenes.BaseScene('words_all')
        words_all.enter(async(ctx) => {
            try {
                const res = await RequestHelper.request('get', '/words/all', ctx)

                Secure.check(res, ctx)
                if (res.status == 404) {
                    await ctx.editMessageText(`You don’t have a word yet.❗️`, Markup.inlineKeyboard([
                        [Markup.button.callback('Add word', 'add_word')],
                        [Markup.button.callback('Back to main menu◀️', 'back-main')]
                    ]))
                }
                if (res.status == 200) {
                    const keyboard = await Keyboard_generator.keyboardGenerator_words(res, ctx.session.words_counter, 'wrd')

                    await ctx.editMessageText(`Add➕ word or tap to word you want to manage🪡`, {
                        reply_markup: {
                            inline_keyboard: keyboard,
                        }
                    })
                }
                await ctx.scene.leave()
            } catch (err) {
                console.log(err)
            }
        })
        return words_all
    }

    words_all2() {
        const words_all2 = new Scenes.BaseScene('words_all2')
        words_all2.enter(async(ctx) => {
            try {
                const res = await RequestHelper.request('get', '/words/all', ctx)

                Secure.check_with_reply(res, ctx)
                if (res.status == 404) {
                    await ctx.reply(`You don’t have a word yet.❗️`, Markup.inlineKeyboard([
                        [Markup.button.callback('Add word', 'add_word')],
                        [Markup.button.callback('Back to main menu◀️', 'back-main')]
                    ]))
                }
                if (res.status == 200) {
                    const keyboard = await Keyboard_generator.keyboardGenerator_words(res, ctx.session.words_counter, 'wrd')

                    await ctx.reply(`Add➕ word or tap to word you want to manage🪡`, {
                        reply_markup: {
                            inline_keyboard: keyboard,
                        }
                    })
                }
                await ctx.scene.leave()
            } catch (err) {
                console.log(err)
            }
        })
        return words_all2
    }

    words_one() {
        const words_one = new Scenes.BaseScene('words_one')
        words_one.enter(async(ctx) => {
            try {
                if (ctx.session.selected_word) {
                    const res = await RequestHelper.request('get', `/words/id/${ctx.session.selected_word}`, ctx)

                    Secure.check(res, ctx)
                    if (res.status == 200) {
                        let word = ''
                        ctx.session.word_full = res.data.data[0]

                        word += res.data.data[0].word_lang1 + ' - ' + res.data.data[0].word_lang2
                        if (res.data.data[0].description != ' ') {
                            word += ' [' + res.data.data[0].description + ']'
                        }
                        ctx.session.selected_word_wrapped = word
                        await ctx.editMessageText(`${word}🛸\n\nYou can delete❌ or edit✏️ word`, Markup.inlineKeyboard([
                            [Markup.button.callback('Delete❌', 'delete_word'), Markup.button.callback('Edit word✏️', 'edit_word')],
                            [Markup.button.callback('Back to words⬅️', 'words')]
                        ]))
                    }
                } else {
                    await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                        [Markup.button.callback('Back to words⬅️', 'words')]
                    ]))
                }
                await ctx.scene.leave()
            } catch (err) {
                console.log(err)
            }
        })
        return words_one
    }
    words_edit_main() {
        const words_edit_main = new Scenes.BaseScene('words_edit_main')
        words_edit_main.enter(async(ctx) => {
            if (ctx.session.selected_word_wrapped && ctx.session.word_full) {
                await ctx.editMessageText(`${ctx.session.selected_word_wrapped }\nSelect what you want edit:`, Markup.inlineKeyboard([
                    [Markup.button.callback(`${ctx.session.word_full.word_lang1}✏️`, 'edit_1word'), Markup.button.callback(`${ctx.session.word_full.word_lang2}✏️`, 'edit_2word'), Markup.button.callback('description✏️', 'edit_word_desc')],
                    [Markup.button.callback('Back to words◀️', 'words')]
                ]))
            } else {
                await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                    [Markup.button.callback('Back to words⬅️', 'words')]
                ]))
            }
            await ctx.scene.leave()
        })
        return words_edit_main
    }
    words_edit_desc() {
        const words_edit_desc = new Scenes.BaseScene('edit_word_desc')
        words_edit_desc.enter(async(ctx) => {
            if (ctx.session.word_full) {
                let desc = ''
                if (ctx.session.word_full.description == ' ') {
                    desc += '-'
                } else {
                    desc += ctx.session.word_full.description
                }
                await ctx.editMessageText(`Pleace, enter new description \nDescription now: ${desc}`, Markup.inlineKeyboard([
                    [Markup.button.callback('Back to menu⬅️', 'words')]
                ]))
            } else {
                await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                    [Markup.button.callback('Back to words⬅️', 'words')]
                ]))
            }
        })
        words_edit_desc.on('text', async(ctx) => {
            let desc = ctx.message.text
            try {
                if (ctx.session.word_full) {
                    const res = await RequestHelper.request_body('put', '/words/update', {
                        word_id: ctx.session.word_full.word_id,
                        word_lang1: ctx.session.word_full.word_lang1,
                        word_lang2: ctx.session.word_full.word_lang2,
                        lang1_id: ctx.session.word_full.lang1_id,
                        lang2_id: ctx.session.word_full.lang2_id,
                        description: desc
                    }, ctx)

                    Secure.check_with_reply(res, ctx)
                    if (res.status == 201) {
                        await ctx.reply(`Successfully edited✅`, Markup.inlineKeyboard([
                            [Markup.button.callback('Back to menu⬅️', 'words')]
                        ]))
                    }
                } else {
                    await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                        [Markup.button.callback('Back to words⬅️', 'words')]
                    ]))
                }
                await ctx.scene.leave()
            } catch (err) {
                console.log(err)
            }
        })
        return words_edit_desc
    }
    edit_1word() {
        const edit_1word = new Scenes.BaseScene('edit_1word')
        edit_1word.enter(async(ctx) => {
            if (ctx.session.word_full) {
                await ctx.editMessageText(`Pleace, enter new 1 word \n1 word now: ${ctx.session.word_full.word_lang1}`, Markup.inlineKeyboard([
                    [Markup.button.callback('Back to menu⬅️', 'words')]
                ]))
            } else {
                await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                    [Markup.button.callback('Back to menu⬅️', 'words')]
                ]))
            }

        })
        edit_1word.on('text', async(ctx) => {
            let word = ctx.message.text
            if (ctx.message.text.length <= 45) {
                try {
                    if (ctx.session.word_full) {
                        const res = await RequestHelper.request_body('put', '/words/update', {
                            word_id: ctx.session.word_full.word_id,
                            word_lang1: word,
                            word_lang2: ctx.session.word_full.word_lang2,
                            lang1_id: ctx.session.word_full.lang1_id,
                            lang2_id: ctx.session.word_full.lang2_id,
                            description: ctx.session.word_full.description,
                        }, ctx)

                        Secure.check_with_reply(res, ctx)
                        if (res.status == 201) {
                            await ctx.reply(`Successfully edited✅`, Markup.inlineKeyboard([
                                [Markup.button.callback('Back to words⬅️', 'words')]
                            ]))

                        }
                    } else {
                        await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                            [Markup.button.callback('Back to words⬅️', 'words')]
                        ]))
                    }
                    ctx.scene.leave()
                } catch (err) {
                    console.log(err)
                }
            } else {
                await ctx.reply('❗️Your word is too long\nEnter again to make word less than 45 characters')
            }

        })
        return edit_1word
    }
    edit_2word() {
        const edit_2word = new Scenes.BaseScene('edit_2word')
        edit_2word.enter(async(ctx) => {
            if (ctx.session.word_full) {
                let desc = ''
                if (ctx.session.word_full.description == ' ') {
                    desc += '-'
                } else {
                    desc += ctx.session.word_full.description
                }
                await ctx.editMessageText(`Pleace, enter new 2 word \n2 word now: ${ctx.session.word_full.word_lang2}`, Markup.inlineKeyboard([
                    [Markup.button.callback('Back to words⬅️', 'words')]
                ]))
            } else {
                await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                    [Markup.button.callback('Back to words⬅️', 'words')]
                ]))
            }
        })
        edit_2word.on('text', async(ctx) => {
            let word = ctx.message.text
            if (ctx.message.text.length <= 45) {
                try {
                    if (ctx.session.word_full) {
                        const res = await RequestHelper.request_body('put', '/words/update', {
                            word_id: ctx.session.word_full.word_id,
                            word_lang1: ctx.session.word_full.word_lang1,
                            word_lang2: word,
                            lang1_id: ctx.session.word_full.lang1_id,
                            lang2_id: ctx.session.word_full.lang2_id,
                            description: ctx.session.word_full.description
                        }, ctx)

                        Secure.check_with_reply(res, ctx)
                        if (res.status == 201) {
                            await ctx.reply(`Successfully edited✅`, Markup.inlineKeyboard([
                                [Markup.button.callback('Back to words⬅️', 'words')]
                            ]))
                            ctx.scene.leave()
                        }
                    } else {
                        await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                            [Markup.button.callback('Back to words⬅️', 'words')]
                        ]))
                    }
                } catch (err) {
                    console.log(err)
                }
            } else {
                await ctx.reply('❗️Your word is too long\nEnter again to make word less than 45 characters')
            }

        })
        return edit_2word
    }

    words_delete() {
        const word_delete = new Scenes.BaseScene('word_delete')
        word_delete.enter(async(ctx) => {
            try {
                if (ctx.session.selected_word) {
                    const res = await RequestHelper.request('delete', `/words/delete/${ctx.session.selected_word}`, ctx)
                    Secure.check(res, ctx)
                    if (res.status == 200) {
                        await ctx.editMessageText(`Successfully deleted✅`, Markup.inlineKeyboard([
                            [Markup.button.callback('Back to words⬅️', 'words')]
                        ]))
                    }
                    if (res.status == 404) {
                        await ctx.editMessageText(`You already deleted this word from list😉`, Markup.inlineKeyboard([
                            [Markup.button.callback('Back to words◀️', 'words')]
                        ]))
                    }
                } else {
                    await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                        [Markup.button.callback('Back to words⬅️', 'words')]
                    ]))
                }
                await ctx.scene.leave()
            } catch (err) {
                console.log(err)
            }
        })
        return word_delete
    }

}

module.exports = WordsScene