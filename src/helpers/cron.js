const { CronJob } = require("cron")
const { Markup } = require('telegraf')
module.exports = {
    send: (chat_id, ctx, time, toSend) => {
        try {
            let n = 0
            let is_stopped
            const job = new CronJob({
                cronTime: time,
                onTick: () => {
                    if (ctx.session.notification_to_stop != undefined && ctx.session.notification_to_stop == toSend.list_id) {
                        ctx.session.notification_to_stop = undefined
                        is_stopped = true
                        n = 0
                        job.stop()
                    } else {
                        if (toSend.words[n]) {
                            ctx.telegram.sendMessage(chat_id, `Your word from ${toSend.list_name} list:\n` + toSend.words[n].word_lang1 + ' - ' + toSend.words[n].word_lang2, Markup.inlineKeyboard([
                                [Markup.button.callback('Delete from list❌', `notific_delete_from_list${toSend.words[n].word_id}`), Markup.button.callback('Delete anywhere❌❌', `notific_delete_from_words${toSend.words[n].word_id}`)],
                                [Markup.button.callback('Back to lists⬅️', 'words-lists')]
                            ]))
                            n++
                        } else {
                            job.stop()
                            n = 0
                        }
                    }
                },
                onComplete: () => {
                    n = 0
                    if (is_stopped != true) {
                        is_stopped = false
                        ctx.session.notifications_on_work = undefined
                        ctx.telegram.sendMessage(chat_id, `Notifications from ${toSend.list_name} list has been completed✅`, Markup.inlineKeyboard([
                            [Markup.button.callback('Back to lists⬅️', 'words-lists')]
                        ]))
                    }
                    console.log('Worker is completed!')
                },
                startNow: true
            })
        } catch (err) {
            console.log(err)
        }
    }


}