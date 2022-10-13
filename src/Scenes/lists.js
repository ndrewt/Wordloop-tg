const { Scenes, Markup } = require('telegraf')
const RequestHelper = require('../helpers/request')
const Keyboard_generator = require('../helpers/KeyboardGenerator')
const Secure = require('../helpers/secureAcess')


class WordsListsScene {
    addList() {
        const add_list_main_all = new Scenes.BaseScene('add_list_main_all')
        add_list_main_all.enter(async(ctx) => {
            try {
                const res = await RequestHelper.request('get', '/languages/all', ctx)
                Secure.check(res, ctx)
                if (res.status == 404) {
                    await ctx.editMessageText(`To make a list, you must have at least two languages❗️`, Markup.inlineKeyboard([
                        [Markup.button.callback('Add language🔁', 'add_lang')],
                        [Markup.button.callback('Back to main menu◀️', 'back-main')]
                    ]))
                }
                if (res.status == 200) {
                    ctx.session.words_add_isSecond_list_add = false
                    let keyboard = await Keyboard_generator.keyboardGenerator_words_add(res, ctx.session.lists_add_counter, '1wrd', ctx, 'lst_add')

                    keyboard.push([{ 'text': 'Back◀️', 'callback_data': ('words-lists') }])
                    await ctx.editMessageText(`Pleace, select first language to use for list⏬⏬⏬`, {
                        reply_markup: {
                            inline_keyboard: keyboard
                        }
                    })
                }
            } catch (err) {
                console.log(err)
            }
        })
        return add_list_main_all
    }

    addList2() {
        const lang_select_2 = new Scenes.BaseScene('list_select_lang2')
        lang_select_2.enter(async(ctx) => {
            try {
                const res = await RequestHelper.request('get', '/languages/all', ctx)

                Secure.check(res, ctx)
                if (res.status == 200) {
                    ctx.session.words_add_isSecond_list_add = true
                    let keyboard = await Keyboard_generator.keyboardGenerator_words_add(res, ctx.session.lists_add_counter, '2wrd', ctx, 'lst_add')
                    keyboard.push([{ 'text': 'Back◀️', 'callback_data': ('words-lists') }])

                    await ctx.editMessageText(`Pleace, select second language to use for list⏬⏬⏬`, {
                        reply_markup: {
                            inline_keyboard: keyboard
                        }
                    })
                }
            } catch (err) {
                console.log(err)
                if (err.response.status == 404) {
                    await ctx.replyWithHTML(`<b>Language list is empty❗️</b>`, Markup.inlineKeyboard([
                        [Markup.button.callback('Add🔁', 'add_lang_again'), Markup.button.callback('add_list_main⬅️', 'wo')]
                    ]))
                }
            }
        })
        return lang_select_2
    }
    addList3() {
        const list_enter_name = new Scenes.BaseScene('list_enter_name')
        list_enter_name.enter(async(ctx) => {
            await ctx.editMessageText('Enter list name:')
        })
        list_enter_name.on('text', async(ctx) => {
            ctx.session.name = ctx.message.text
            if (ctx.message.text.length <= 45) {
                await ctx.scene.enter('list_add_end')
            } else {
                await ctx.reply('❗️Your list name is too long\nEnter again to make list name less than 45 characters')
            }
        })
        return list_enter_name
    }
    addListRes() {
        const addListRes = new Scenes.BaseScene('list_add_end')
        addListRes.enter(async(ctx) => {
            try {
                const res = await RequestHelper.request_body('post', '/words-lists/add', {
                    list_name: ctx.session.name,
                    lang1_id: ctx.session.selected_add_list1,
                    lang2_id: ctx.session.selected_add_list1
                }, ctx)

                Secure.check_with_reply(res, ctx)
                if (res.status == 201) {
                    await ctx.replyWithHTML(`${ctx.session.name } successfully added✅`, Markup.inlineKeyboard([
                        [Markup.button.callback('Add more🔁', 'add_list'), Markup.button.callback('Back to lists⬅️', 'words-lists')]
                    ]))
                    await ctx.scene.leave()
                }
            } catch (err) {
                console.log(err)
            }
        })
        return addListRes
    }

    allListMain() {
        const allListMain = new Scenes.BaseScene('allListMain')
        allListMain.enter(async(ctx) => {
            try {
                const res = await RequestHelper.request('get', `/words-lists/all`, ctx)

                Secure.check(res, ctx)
                if (res.status == 404) {
                    await ctx.editMessageText(`You don’t have a word list yet.❗️`, Markup.inlineKeyboard([
                        [Markup.button.callback('Add list🔁', 'add_list')],
                        [Markup.button.callback('Back to main menu◀️', 'back-main')]
                    ]))
                }
                if (res.status == 200) {
                    let keyboard = await Keyboard_generator.keyboardGenerator_lists(res, ctx.session.lists_counter, 'lst')

                    await ctx.editMessageText(`Add➕ list or tap to list you want to manage🪡 `, {
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
        return allListMain
    }
    allListMain2() {
        const allListMain = new Scenes.BaseScene('allListMain2')
        allListMain.enter(async(ctx) => {
            try {
                const res = await RequestHelper.request('get', `/words-lists/all`, ctx)

                Secure.check_with_reply(res, ctx)
                if (res.status == 404) {
                    await ctx.reply(`You don’t have a word list yet.❗️`, Markup.inlineKeyboard([
                        [Markup.button.callback('Add list🔁', 'add_list')],
                        [Markup.button.callback('Back to main menu◀️', 'back-main')]
                    ]))
                }
                if (res.status == 200) {
                    let keyboard = await Keyboard_generator.keyboardGenerator_lists(res, ctx.session.lists_counter, 'lst')

                    await ctx.reply(`Add➕ list or tap to list you want to manage🪡 `, {
                        reply_markup: {
                            inline_keyboard: keyboard
                        }
                    })
                    await ctx.scene.leave()
                }
            } catch (err) {
                console.log(err)
            }
        })
        return allListMain
    }

    all_words() {
        const editListMain = new Scenes.BaseScene('all_words')
        editListMain.enter(async(ctx) => {
            try {
                const res = await RequestHelper.request('get', `/words/all`, ctx)

                Secure.check(res, ctx)
                if (ctx.session.selected_list) {
                    const res2 = await RequestHelper.request('get', `/words-lists-words/id/${ctx.session.selected_list}`, ctx)
                    const res3 = await RequestHelper.request('get', `/words-lists/id/${ctx.session.selected_list}`, ctx)
                    if (res3.status == 404) {
                        return ctx.editMessageText(`Looks like you already deleted this list🙃`, Markup.inlineKeyboard([
                            [Markup.button.callback('Back to lists⬅️', 'words-lists')]
                        ]))
                    }
                    if (res2.status == 404) {
                        await ctx.editMessageText(`Words list is empty❗️\nPleace press "Add word➕"`, Markup.inlineKeyboard([
                            [Markup.button.callback('Add word➕  ', 'add_word_list'), Markup.button.callback('Delete list❌', 'delete_list_')],
                            [Markup.button.callback('Edit list✏️', 'list_edit')],
                            [Markup.button.callback('Back to lists⬅️', 'words-lists')]
                        ]))
                    } else {
                        let keyboard = await Keyboard_generator.keyboardGenerator_lists_words(res, res2, ctx.session.words_list_counter_, 'lword', ctx)
                        await ctx.editMessageText(`Your words from ${res2.data.list_name} list\n\nAdd➕ word to list or tap to word you want to manage🪡 `, {
                            reply_markup: {
                                inline_keyboard: keyboard
                            }
                        })
                    }
                } else {
                    await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                        [Markup.button.callback('Back to menu⬅️', 'words-lists')]
                    ]))
                }

                await ctx.scene.leave()
            } catch (err) {
                console.log(err)
            }
        })

        return editListMain
    }

    editListMain() {
        const editListMain = new Scenes.BaseScene('editListMain')
        editListMain.enter(async(ctx) => {
            try {
                if (ctx.session.selected_list) {
                    const res = await RequestHelper.request('get', `/words-lists/id/${ctx.session.selected_list}`, ctx)

                    Secure.check(res, ctx)
                    if (res.status == 200) {
                        ctx.session.full_list = res.data.data[0]
                        ctx.editMessageText(`Enter new list name for ${res.data.data[0].list_name}:`)
                    }
                } else {
                    await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                        [Markup.button.callback('Back to menu⬅️', 'words-lists')]
                    ]))
                }
            } catch (err) {
                console.log(err)
            }

        })
        editListMain.on('message', async(ctx) => {
            let name = ctx.message.text
            if (ctx.message.text.length <= 45) {
                try {
                    if (ctx.session.full_list) {
                        const res = await RequestHelper.request_body('put', '/words-lists/update', {
                            list_id: ctx.session.full_list.list_id,
                            list_name: name,
                            lang1_id: ctx.session.full_list.lang1_id,
                            lang2_id: ctx.session.full_list.lang2_id
                        }, ctx)

                        Secure.check_with_reply(res, ctx)
                        if (res.status == 201) {
                            await ctx.reply(`Successfully edited✅`, Markup.inlineKeyboard([
                                [Markup.button.callback('Edit more🔁', 'list_edit'), Markup.button.callback('Back to menu⬅️', 'words-lists')]
                            ]))
                        }
                    } else {
                        await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                            [Markup.button.callback('Back to menu⬅️', 'words-lists')]
                        ]))
                    }
                    await ctx.scene.leave()
                } catch (err) {
                    console.log(err)
                }
            } else {
                await ctx.reply('❗️Your list name is too long\nEnter again to make list name less than 45 characters')
            }

        })
        return editListMain
    }

    addWordToListMain() {
        const allListMain = new Scenes.BaseScene('addWordToListMain')
        allListMain.enter(async(ctx) => {
            try {
                const res = await RequestHelper.request('get', `/words/all`, ctx)

                Secure.check(res, ctx)
                if (res.status == 200) {
                    if (ctx.session.selected_list) {
                        const res2 = await RequestHelper.request('get', `/words-lists-words/id/${ctx.session.selected_list}`, ctx)

                        let keyboard = await Keyboard_generator.keyboardGenerator_lists_word_add(res, res2, ctx.session.list_word_add_counter, '_lst_add_word')
                        if (keyboard.length <= 2) {
                            await ctx.editMessageText(`No aviable words for ${res2.data.list_name} list\n\nFirstly you need to add word suitable for ${res2.data.list_name}`, Markup.inlineKeyboard([
                                [Markup.button.callback('Add word🔁', 'add_word'), Markup.button.callback('Back to menu⬅️', 'words-lists')]
                            ]))
                        } else {
                            await ctx.editMessageText(`Select what you want add to ${res2.data.list_name} list`, {
                                reply_markup: {
                                    inline_keyboard: keyboard,
                                }
                            })
                        }
                    } else {
                        await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                            [Markup.button.callback('Back to menu⬅️', 'words-lists')]
                        ]))
                    }
                }
                if (res.status == 404) {
                    await ctx.editMessageText(`No aviable words for list\n\nFirstly you need to add word suitable for your list`, Markup.inlineKeyboard([
                        [Markup.button.callback('Add word🔁', 'add_word')],
                        [Markup.button.callback('Back to lists', 'words-lists')]
                    ]))
                }
                await ctx.scene.leave()
            } catch (err) {
                console.log(err)
            }
            await ctx.scene.leave()
        })

        return allListMain
    }
    addWordToList_word() {
        const addWordToList_word = new Scenes.BaseScene('addWordToList_word')
        addWordToList_word.enter(async(ctx) => {
            try {
                if (ctx.session.selected_list && ctx.session.selected_word_list_add) {
                    const request = await RequestHelper.request_body('post', '/words-lists-words/add', {
                        list_id: ctx.session.selected_list,
                        word_id: ctx.session.selected_word_list_add
                    }, ctx)

                    Secure.check(request, ctx)
                    if (request.status == 201) {
                        await ctx.scene.enter('all_words')
                    }
                } else {
                    await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                        [Markup.button.callback('Back to menu⬅️', 'words-lists')]
                    ]))
                }
                await ctx.scene.leave()
            } catch (err) {
                console.log(err)
            }
        })
        return addWordToList_word
    }


    deleteList() {
        const list_delete = new Scenes.BaseScene('list_delete')
        list_delete.enter(async(ctx) => {
            try {
                if (ctx.session.selected_list) {
                    const res = await RequestHelper.request('delete', `/words-lists/delete/${ctx.session.selected_list}`, ctx)
                    if (ctx.session.notifications_on_work && ctx.session.notifications_on_work == ctx.session.words_from_list.list_id) {
                        ctx.session.notification_to_stop = ctx.session.notifications_on_work
                        ctx.session.notifications_on_work = undefined
                    }
                    Secure.check(res, ctx)
                    if (res.status == 200) {
                        await ctx.editMessageText(`Successfully deleted✅`, Markup.inlineKeyboard([
                            [Markup.button.callback('Back to menu⬅️', 'words-lists')]
                        ]))
                    }
                } else {
                    await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                        [Markup.button.callback('Back to menu⬅️', 'words-lists')]
                    ]))
                }
                await ctx.scene.leave()
            } catch (err) {
                console.log(err)
            }
        })
        return list_delete

    }
    delete_word_one() {
        const delete_word_one = new Scenes.BaseScene('delete_word_one')
        delete_word_one.enter(async(ctx) => {
            try {
                if (ctx.session.selected_list_word) {
                    const res = await RequestHelper.request('get', `/words/id/${ctx.session.selected_list_word}`, ctx)
                    Secure.check(res, ctx)
                    if (res.status == 404) {
                        ctx.editMessageText('Oops\n\nLooks like that word was deleted...', Markup.inlineKeyboard([
                            Markup.button.callback('Back to lists⬅️', `words-lists`)
                        ]))
                    }
                    if (res.status == 200) {
                        let word = ''
                        ctx.session.word_full = res.data.data[0]
                        if (res) {
                            word += res.data.data[0].word_lang1 + ' - ' + res.data.data[0].word_lang2
                            if (res.data.data[0].description != ' ') {
                                word += ' [' + res.data.data[0].description + ']'
                            }
                        }
                        await ctx.editMessageText(`${word}🛸\n\nYou can delete❌ word from list`, Markup.inlineKeyboard([
                            [Markup.button.callback('Delete from list❌', 'delete_word_list')],
                            [Markup.button.callback('Back to list◀️', `lst${ctx.session.selected_list}`)]
                        ]))
                    }
                } else {
                    await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                        [Markup.button.callback('Back to list⬅️', `words-lists`)]
                    ]))
                }
                await ctx.scene.leave()
            } catch (err) {
                console.log(err)
            }
        })
        return delete_word_one
    }
    delete_word_list_Res() {
        const delete_word_list_Res = new Scenes.BaseScene('delete_word_list_Res')
        delete_word_list_Res.enter(async(ctx) => {
            try {
                if (ctx.session.selected_list_word && ctx.session.selected_list) {
                    const res = await RequestHelper.request('delete', `/words-lists-words/delete/${ctx.session.selected_list_word}`, ctx)

                    Secure.check(res, ctx)
                    if (res.status == 200) {
                        await ctx.editMessageText(`Successfully deleted✅`, Markup.inlineKeyboard([
                            [Markup.button.callback('Back to list◀️', `lst${ctx.session.selected_list}`)]
                        ]))
                    }
                    if (res.status == 404) {
                        await ctx.editMessageText(`You already deleted this word from list😉`, Markup.inlineKeyboard([
                            [Markup.button.callback('Back to lists◀️', `words-lists`)]
                        ]))
                    }
                } else {
                    await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                        [Markup.button.callback('Back to menu⬅️', 'words-lists')]
                    ]))
                }
                await ctx.scene.leave()
            } catch (err) {
                console.log(err)
            }
        })
        return delete_word_list_Res
    }
    notitcations_list() {
        const notitcations_list = new Scenes.BaseScene('notitcations_list')
        notitcations_list.enter(async(ctx) => {
            try {
                if (ctx.session.words_from_list) {
                    if (ctx.session.notifications_on_work != undefined && ctx.session.notifications_on_work != ctx.session.words_from_list.list_id) {
                        ctx.editMessageText(`You already created notifications for another list❗️\n\nUser can create only one notification\n\nStop notifications or wait for over`, Markup.inlineKeyboard([
                            [Markup.button.callback('Back to list◀️', `lst${ctx.session.words_from_list.list_id}`)]
                        ]))
                    }
                    if (ctx.session.notifications_on_work != undefined && ctx.session.notifications_on_work == ctx.session.words_from_list.list_id) {
                        ctx.editMessageText(`Notifications for ${ctx.session.words_from_list.list_name} list are alreary created\n You can stop notifications by button "Stop"`, Markup.inlineKeyboard([
                            [Markup.button.callback('Stop🛑', 'stop_notifications')],
                            [Markup.button.callback('Back to list◀️', `lst${ctx.session.words_from_list.list_id}`)]
                        ]))
                    }
                    if (ctx.session.notifications_on_work == undefined) {
                        await ctx.editMessageText(`Here you can create notifications for ${ctx.session.words_from_list.list_name} list\n\nWith notifications, you can memorize your words faster😉\n\nIf you need it tab button "Create notifications"`, Markup.inlineKeyboard([
                            [Markup.button.callback('Create notifications', 'create-notification')],
                            [Markup.button.callback('Back to list◀️', `lst${ctx.session.words_from_list.list_id}`)]
                        ]))
                    }
                } else {
                    await ctx.editMessageText(`😞Something went wrong, please try again later`, Markup.inlineKeyboard([
                        [Markup.button.callback('Back to menu⬅️', 'words-lists')]
                    ]))
                }

                await ctx.scene.leave()
            } catch (err) {
                console.log(err)
            }
        })
        return notitcations_list
    }
    notitcations_list_time() {
        const notitcations_list_time = new Scenes.BaseScene('notitcations_list_time')
        notitcations_list_time.enter(async(ctx) => {
            try {
                if (ctx.session.words_from_list) {
                    await ctx.editMessageText(`You need to select how often receive words from ${ctx.session.words_from_list.list_name} list\n\nTab to right button\n\nYou will receive notifications every:  `, Markup.inlineKeyboard([
                        [Markup.button.callback('5 minutes🕐', 'minutes5'), Markup.button.callback('15 minutes🕑', 'minutes15'), Markup.button.callback('30 minutes🕒', 'minutes30')],
                        [Markup.button.callback('1 hour🕓', 'hours1'), Markup.button.callback('2 hours🕔', 'hours2'), Markup.button.callback('6 hours🕕', 'hours6')],
                        [Markup.button.callback('Back to list⬅️', `lst${ctx.session.words_from_list.list_id}`)]
                    ]))
                } else {
                    await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                        [Markup.button.callback('Back to lists⬅️', 'words-lists')]
                    ]))
                }
                await ctx.scene.leave()
            } catch (err) {
                console.log(err)
            }
        })
        return notitcations_list_time
    }
}

module.exports = WordsListsScene