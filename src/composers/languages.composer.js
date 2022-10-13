const { Markup, Composer } = require('telegraf')
const composer = new Composer()

composer.action('languages', async(ctx) => {
    await ctx.answerCbQuery()
    await ctx.scene.enter('all_langs')
})

composer.action('add_lang', async(ctx) => {
    await ctx.answerCbQuery()
    await ctx.scene.enter('add_language')
})

composer.action('add_lang_again', async(ctx) => {
    await ctx.answerCbQuery()
    await ctx.scene.enter('add_language')
})

composer.action('delete_lang', async(ctx) => {
    await ctx.answerCbQuery()
    await ctx.scene.enter('delete_language')
})

composer.action('delete_lang_again', async(ctx) => {
    await ctx.answerCbQuery()
    await ctx.scene.enter('delete_language')
})

composer.action('edit_lang', async(ctx) => {
    await ctx.answerCbQuery()
    await ctx.scene.enter('edit_lang_main')
})
composer.action('back-main', async(ctx) => {
        await ctx.answerCbQuery()
        await ctx.editMessageText('Use languages button for managing languages, words button for managing your words or word-lists for managing lists of words\nAlso you can create notifications⏱ for word lists', Markup.inlineKeyboard([
            [Markup.button.callback('Languges🏁', 'languages'), Markup.button.callback('Words', 'words'), Markup.button.callback('Word lists📜', 'words-lists')]
        ]))
    })
    //pagination

composer.action('next_lng', async(ctx) => {
    await ctx.answerCbQuery()
    if (!ctx.session.lang_counter) {
        ctx.session.lang_counter = 14
    } else {
        ctx.session.lang_counter += 14
    }
    await ctx.scene.enter('all_langs')
})

composer.action('back_lng', async(ctx) => {
    await ctx.answerCbQuery()
    if (!ctx.session.lang_counter) {
        ctx.session.lang_counter = 0
    } else {
        ctx.session.lang_counter = ctx.session.lang_counter - 14
    }
    await ctx.scene.enter('all_langs')
})

composer.command("languages", async(ctx) => {
    await ctx.scene.enter('all_langs2')
})

module.exports = composer