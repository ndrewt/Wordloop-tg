const { Markup, Composer } = require('telegraf')
const composer = new Composer()
const cron = require('../helpers/cron')

composer.on('callback_query', async(ctx) => {
    await ctx.answerCbQuery()
        //notifications
    if (ctx.update.callback_query.data == 'notifications') {
        await ctx.scene.enter('notitcations_list')
    }
    if (ctx.update.callback_query.data == 'create-notification') {
        await ctx.scene.enter('notitcations_list_time')
    }
    if (ctx.update.callback_query.data.slice(0, 7) == 'minutes') {
        let time = ctx.update.callback_query.data.slice(7)
        if (ctx.session.words_from_list) {
            ctx.session.notifications_on_work = ctx.session.words_from_list.list_id
            cron.send(ctx.update.callback_query.message.chat.id, ctx, `*/${time} * * * *`, ctx.session.words_from_list)
            await ctx.editMessageText(`Notifications for ${ctx.session.words_from_list.list_name} list was successfully created✅\nYou will recieve notifications every ${time} minutes🕐`, Markup.inlineKeyboard([
                [Markup.button.callback('Back to list⬅️', `lst${ctx.session.selected_list}`)]
            ]))
        } else {
            await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                [Markup.button.callback('Back to menu⬅️', 'words-lists')]
            ]))
        }
    }
    if (ctx.update.callback_query.data.slice(0, 5) == 'hours') {
        let time = ctx.update.callback_query.data.slice(5)
        if (ctx.session.words_from_list) {
            cron.send(ctx.update.callback_query.message.chat.id, ctx, `* */${time} * * *`, ctx.session.words_from_list)
            ctx.session.notifications_on_work = ctx.session.words_from_list.list_id
            await ctx.editMessageText(`Notifications for ${ctx.session.words_from_list.list_name} list was successfully created✅\nYou will recieve notifications every ${time} hour('s)`, Markup.inlineKeyboard([
                [Markup.button.callback('Back to list⬅️', 'words-lists')]
            ]))
        } else {
            await ctx.editMessageText(`😞Something went wrong, please try again or later`, Markup.inlineKeyboard([
                [Markup.button.callback('Back to menu⬅️', 'words-lists')]
            ]))
        }
    }
    if (ctx.update.callback_query.data.slice(0, 24) == 'notific_delete_from_list') {
        ctx.session.selected_list_word = ctx.update.callback_query.data.slice(24)
        await ctx.scene.enter('delete_word_list_Res')
    }
    if (ctx.update.callback_query.data.slice(0, 25) == 'notific_delete_from_words') {
        ctx.session.selected_word = ctx.update.callback_query.data.slice(25)
        await ctx.scene.enter('word_delete')
    }
    //notifications end
    if (ctx.update.callback_query.data.slice(0, 3) == 'lng') {
        ctx.session.selected_lang = ctx.update.callback_query.data.slice(3)
        await ctx.scene.enter('one_lang')
    }
    if (ctx.update.callback_query.data.slice(0, 3) == 'wrd') {
        ctx.session.selected_word = ctx.update.callback_query.data.slice(3)
        await ctx.scene.enter('words_one')
    }
    if (ctx.update.callback_query.data.slice(0, 3) == 'lst') {
        ctx.session.selected_list = ctx.update.callback_query.data.slice(3)
        await ctx.scene.enter('all_words')
    }
    //add list keyboard render
    if (ctx.update.callback_query.data.slice(0, 4) == '1wrd') {
        ctx.session.selected_add_list1 = ctx.update.callback_query.data.slice(4)
            // await ctx.telegram.deleteMessage(ctx.chat.id, ctx.update.callback_query.message.message_id)
        await ctx.scene.enter('list_select_lang2')
    }
    if (ctx.update.callback_query.data.slice(0, 4) == '2wrd') {
        ctx.session.selected_add_list2 = ctx.update.callback_query.data.slice(4)
            // await ctx.telegram.deleteMessage(ctx.chat.id, ctx.update.callback_query.message.message_id)
        await ctx.scene.enter('list_enter_name')
    }
    //end
    if (ctx.update.callback_query.data.slice(0, 5) == 'lword') {
        ctx.session.selected_list_word = ctx.update.callback_query.data.slice(5)
        await ctx.scene.enter('delete_word_one')
    }
    if (ctx.update.callback_query.data.slice(0, 4) == '1lng') {
        // await ctx.telegram.deleteMessage(ctx.chat.id, ctx.update.callback_query.message.message_id)
        ctx.session.selected_lng1 = ctx.update.callback_query.data.slice(4)
        await ctx.scene.enter('words_select_lang2')
    }
    if (ctx.update.callback_query.data.slice(0, 4) == '2lng') {
        await ctx.telegram.deleteMessage(ctx.chat.id, ctx.update.callback_query.message.message_id)
        ctx.session.selected_lng2 = ctx.update.callback_query.data.slice(4)
        await ctx.scene.enter('add_word_1')
    }

    //--list add word 
    if (ctx.update.callback_query.data.slice(0, 13) == '_lst_add_word') {
        ctx.session.selected_word_list_add = ctx.update.callback_query.data.slice(13)
        await ctx.scene.enter('addWordToList_word')
    }
    console.log(ctx.update.callback_query.data)
})

module.exports = composer