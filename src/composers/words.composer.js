const { Markup, Composer } = require('telegraf')
const composer = new Composer()

composer.action('words', async(ctx) => {
    await ctx.answerCbQuery()
    await ctx.scene.enter('words_all')
})

composer.action('add_word', async(ctx) => {
    await ctx.answerCbQuery()
    await ctx.scene.enter('words_select_lang')
})

composer.action('skip_add_desc', async(ctx) => {
    await ctx.answerCbQuery()
    ctx.session.desc = ' '
    try {
        await ctx.telegram.deleteMessage(ctx.chat.id, ctx.update.callback_query.message.message_id)
    } catch (err) {}
    ctx.session.delete_passed = true
    await ctx.scene.enter('word_add_res')
})

composer.action('edit_word', async(ctx) => {
    await ctx.answerCbQuery()
    await ctx.scene.enter('words_edit_main')
})

composer.action('edit_word_desc', async(ctx) => {
    await ctx.answerCbQuery()
    await ctx.scene.enter('edit_word_desc')
})
composer.action('edit_1word', async(ctx) => {
    await ctx.answerCbQuery()
    await ctx.scene.enter('edit_1word')
})
composer.action('edit_2word', async(ctx) => {
    await ctx.answerCbQuery()
    await ctx.scene.enter('edit_2word')
})

composer.action('delete_word', async(ctx) => {
        await ctx.answerCbQuery()
        await ctx.scene.enter('word_delete')
    })
    //pagination

composer.action('next_wrd', async(ctx) => {
    await ctx.answerCbQuery()
    if (!ctx.session.words_counter) {
        ctx.session.words_counter = 14
    } else {
        ctx.session.words_counter += 14
    }
    await ctx.scene.enter('words_all')
})
composer.action('back_wrd', async(ctx) => {
        await ctx.answerCbQuery()
        if (!ctx.session.words_counter) {
            ctx.session.words_counter = 0
        } else {
            ctx.session.words_counter = ctx.session.words_counter - 14
        }
        await ctx.scene.enter('words_all')
    })
    //add-word pagination

composer.action('next_wrd_add', async(ctx) => {
    await ctx.answerCbQuery()
    if (!ctx.session.words_add_counter) {
        ctx.session.words_add_counter = 14
    } else {
        ctx.session.words_add_counter += 14
    }
    if (ctx.session.words_add_isSecond_word_add == false) {
        await ctx.scene.enter('words_select_lang')
    } else {
        await ctx.scene.enter('words_select_lang2')
    }
})
composer.action('back_wrd_add', async(ctx) => {
    await ctx.answerCbQuery()
    if (!ctx.session.words_add_counter) {
        ctx.session.words_add_counter = 0
    } else {
        ctx.session.words_add_counter = ctx.session.words_add_counter - 14
    }
    if (ctx.session.words_add_isSecond_word_add == false) {
        await ctx.scene.enter('words_select_lang')
    } else {
        await ctx.scene.enter('words_select_lang2')
    }
})

composer.command("words", async(ctx) => {
    await ctx.scene.enter('words_all2')
})


module.exports = composer