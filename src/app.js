require('dotenv').config()
const { Scenes, Markup, session, Telegraf } = require('telegraf')

const RegisterScene = require('./Scenes/auth')
const LanguagesScenes = require('./Scenes/languages')
const WordsScenes = require('./Scenes/words')
const ListsScenes = require('./Scenes/lists')
const Auth = new RegisterScene()
const Lang = new LanguagesScenes()
const Word = new WordsScenes()
const List = new ListsScenes()

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

const stage = new Scenes.Stage([Auth.registerLogin(), Auth.registerPassword(),
    Auth.loginLogin(), Auth.loginPassword(), Lang.add_language(), Lang.all_langs(), Lang.all_langs2(), Lang.one_lang(), Lang.edit_lang_main(), Lang.delete_lang(),
    Word.words_add_lang1(), Word.words_add_lang2(), Word.words_edit_main(), Word.words_edit_desc(), Word.edit_1word(), Word.edit_2word(),
    Word.words_add_1(), Word.words_add_2(), Word.words_add_desc(), Word.words_add_res(), Word.words_all(), Word.words_all2(), Word.words_one(), Word.words_delete(),
    List.addList(), List.addList2(), List.addList3(), List.addListRes(), List.allListMain(), List.allListMain2(), List.all_words(), List.editListMain(),
    List.addWordToListMain(), List.addWordToList_word(), List.delete_word_one(), List.deleteList(), List.delete_word_list_Res(), List.notitcations_list(), List.notitcations_list_time()
])

bot.use(session())
bot.use(stage.middleware())
bot.use(require('./composers/auth.composer'))
bot.use(require('./composers/languages.composer'))
bot.use(require('./composers/words.composer'))
bot.use(require('./composers/lists.composer'))
bot.action('no_action', async ctx => {
    await ctx.answerCbQuery('It is navigation button with no action.', true)
})

bot.use(require('./composers/dynamicKeyboard.composer'))

bot.hears('getid', async(ctx) => {
    await ctx.reply(ctx.update.message.from.id)
})

bot.help((ctx) => ctx.reply(`Hello👋, this bot serves as an electronic dictionary for those who are learning new languages and need to utilize a dictionary on their devices.

Here, you can add➕, edit✏️ and delete❌ languages, and those will subsequently allow you to add words. 

Also you can add➕, edit✏️ and delete❌ word lists. You will be able to add all the words that match it(1 and 2 the language you choose when adding the list). You can create word notifications from the list for better performance of words learning.

Thanks to Telegram you can see your words on any device that is authorized in your Telegram account.

Press /start to return to the main menu.`))

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))