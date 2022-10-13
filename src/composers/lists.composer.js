const { Markup, Composer } = require('telegraf')
const composer = new Composer()

composer.action('words-lists', async(ctx) => {
    await ctx.answerCbQuery()
    await ctx.scene.enter('allListMain')
})

composer.action('add_list', async(ctx) => {
    await ctx.answerCbQuery()
    await ctx.scene.enter('add_list_main_all')
})

composer.action('all_lists', async(ctx) => {
    await ctx.answerCbQuery()
    await ctx.scene.enter('allListMain')
})

composer.action('list_edit', async(ctx) => {
    await ctx.answerCbQuery()
    await ctx.scene.enter('editListMain')
})

composer.action('add_word_list', async(ctx) => {
    await ctx.answerCbQuery()
    await ctx.scene.enter('addWordToListMain')
})

composer.action('delete_list_', async(ctx) => {
    await ctx.answerCbQuery()
    await ctx.scene.enter('list_delete')
})

composer.action('delete_word_list', async(ctx) => {
        await ctx.answerCbQuery()
        await ctx.scene.enter('delete_word_list_Res')
    })
    //pagination

composer.action('back_lst', async(ctx) => {
    await ctx.answerCbQuery()
    if (!ctx.session.lists_counter) {
        ctx.session.lists_counter = 0
    } else {
        ctx.session.lists_counter = ctx.session.lists_counter - 14
    }
    await ctx.scene.enter('allListMain')
})

composer.action('next_lst', async(ctx) => {
        await ctx.answerCbQuery()
        if (!ctx.session.lists_counter) {
            ctx.session.lists_counter = 14
        } else {
            ctx.session.lists_counter += 14
        }
        await ctx.scene.enter('allListMain')
    })
    //--lists-add
composer.action('next_lst', async(ctx) => {
    await ctx.answerCbQuery()
    if (!ctx.session.lists_add_counter) {
        ctx.session.lists_add_counter = 14
    } else {
        ctx.session.lists_add_counter += 14
    }
    if (ctx.session.words_add_isSecond_list_add == false) {
        await ctx.scene.enter('add_list_main_all')
    } else {
        await ctx.scene.enter('list_select_lang2')
    }
})

composer.action('back_lst_add', async(ctx) => {
        await ctx.answerCbQuery()
        if (!ctx.session.lists_add_counter) {
            ctx.session.lists_add_counter = 0
        } else {
            ctx.session.lists_add_counter = ctx.session.lists_add_counter - 14
        }
        if (ctx.session.words_add_isSecond_list_add == false) {
            await ctx.scene.enter('add_list_main_all')
        } else {
            await ctx.scene.enter('list_select_lang2')
        }
    })
    //--list-add-word keyboard render

composer.action('next_lst_words', async(ctx) => {
    await ctx.answerCbQuery()
    if (!ctx.session.words_list_counter_) {
        ctx.session.words_list_counter_ = 14
    } else {
        ctx.session.words_list_counter_ += 14
    }
    await ctx.scene.enter('all_words')
})

composer.action('back_lst_words', async(ctx) => {
    await ctx.answerCbQuery()
    if (!ctx.session.words_list_counter_) {
        ctx.session.words_list_counter_ = 0
    } else {
        ctx.session.words_list_counter_ = ctx.session.words_list_counter_ - 14
    }
    await ctx.scene.enter('all_words')
})

composer.action('stop_notifications', async(ctx) => {
    await ctx.answerCbQuery()
    ctx.session.notification_to_stop = ctx.session.notifications_on_work
    ctx.session.notifications_on_work = undefined
    await ctx.editMessageText('Notifications successfully stopped✅ ', Markup.inlineKeyboard([
        [Markup.button.callback('Back to menu⬅️', 'words-lists')]
    ]))
})

composer.command("wordslists", async(ctx) => {
    await ctx.scene.enter('allListMain2')
})

module.exports = composer