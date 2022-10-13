const axios = require('axios')

module.exports = {
    keyboardGenerator_langs: async(res, counter, config) => {
        let keyboard = []
        let ready = []
        if (counter) {
            for (let i = counter; i < res.data.data.length; i += 2) {
                if (res.data.data[i + 1]) {
                    keyboard.push([{ 'text': res.data.data[i].lang_name, 'callback_data': (config + res.data.data[i].lang_id) }, { 'text': res.data.data[i + 1].lang_name, 'callback_data': (config + res.data.data[i + 1].lang_id) }])
                        // keyboard.push([{ 'text': res.data.data[i].lang_name, 'callback_data': (config + res.data.data[i].lang_id) }, { 'text': res.data.data[i + 1].lang_name, 'callback_data': (config + res.data.data[i + 1].lang_id) }])
                } else {
                    keyboard.push([{ 'text': res.data.data[i].lang_name, 'callback_data': (config + res.data.data[i].lang_id) }])
                }
            }
        } else {
            for (let i = 0; i < res.data.data.length; i += 2) {
                if (res.data.data[i + 1]) {
                    keyboard.push([{ 'text': res.data.data[i].lang_name, 'callback_data': (config + res.data.data[i].lang_id) }, { 'text': res.data.data[i + 1].lang_name, 'callback_data': (config + res.data.data[i + 1].lang_id) }])
                } else {
                    keyboard.push([{ 'text': res.data.data[i].lang_name, 'callback_data': (config + res.data.data[i].lang_id) }])
                }
            }
        }
        for (let i = 0; i < 7; i++) {
            if (keyboard[i]) {
                ready.push(keyboard[i])
            }
        }
        if (counter == 0 || counter == undefined) {
            let all
            if (res.data.data.length % 14 !== 0) {
                all = Math.floor(res.data.data.length / 14) + 1
            } else {
                all = Math.floor(res.data.data.length / 14)
            }
            let page = 1 + '/' + all
            if (res.data.data.length <= 14) {
                ready.push([{ 'text': '⛔️', 'callback_data': ('no_action') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '⛔️', 'callback_data': ('no_action') }])
            } else {
                ready.push([{ 'text': '⛔️', 'callback_data': ('no_action') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '▶️', 'callback_data': ('next_lng') }])
            }
        } else {
            let all
            if (res.data.data.length % 14 !== 0) {
                all = Math.floor(res.data.data.length / 14) + 1
            } else {
                all = Math.floor(res.data.data.length / 14)
            }
            if (res.data.data.length - counter <= 14) {
                let page = Math.floor(counter / 14) + 1 + '/' + all
                ready.push([{ 'text': '◀️', 'callback_data': ('back_lng') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '⛔️', 'callback_data': ('no_action') }])
            } else {
                let page = Math.floor(counter / 14 + 1) + '/' + all
                ready.push([{ 'text': '◀️', 'callback_data': ('back_lng') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '▶️', 'callback_data': ('next_lng') }])
            }
        }
        ready.push([{ 'text': 'Add language➕', 'callback_data': ('add_lang') }])
        ready.push([{ 'text': 'Back◀️', 'callback_data': ('back-main') }])
        return ready
    },
    keyboardGenerator_words: async(res, counter, config) => {
        let keyboard = []
        let ready = []
        if (counter) {
            for (let i = counter; i < res.data.data.length; i += 2) {
                if (res.data.data[i + 1]) {
                    keyboard.push([{ 'text': res.data.data[i].word_lang1 + ' - ' + res.data.data[i].word_lang2, 'callback_data': (config + res.data.data[i].word_id) }, { 'text': res.data.data[i + 1].word_lang1 + ' - ' + res.data.data[i + 1].word_lang2, 'callback_data': (config + res.data.data[i + 1].word_id) }])
                } else {
                    keyboard.push([{ 'text': res.data.data[i].word_lang1 + ' - ' + res.data.data[i].word_lang2, 'callback_data': (config + res.data.data[i].word_id) }])
                }
            }
        } else {
            for (let i = 0; i < res.data.data.length; i += 2) {
                if (res.data.data[i + 1]) {
                    keyboard.push([{ 'text': res.data.data[i].word_lang1 + ' - ' + res.data.data[i].word_lang2, 'callback_data': (config + res.data.data[i].word_id) }, { 'text': res.data.data[i + 1].word_lang1 + ' - ' + res.data.data[i + 1].word_lang2, 'callback_data': (config + res.data.data[i + 1].word_id) }])
                } else {
                    keyboard.push([{ 'text': res.data.data[i].word_lang1 + ' - ' + res.data.data[i].word_lang2, 'callback_data': (config + res.data.data[i].word_id) }])
                }
            }
        }
        for (let i = 0; i < 7; i++) {
            if (keyboard[i]) {
                ready.push(keyboard[i])
            }
        }
        if (counter == 0 || counter == undefined) {
            let all
            if (res.data.data.length % 14 !== 0) {
                all = Math.floor(res.data.data.length / 14) + 1
            } else {
                all = Math.floor(res.data.data.length / 14)
            }
            let page = 1 + '/' + all
            if (res.data.data.length <= 14) {
                ready.push([{ 'text': '⛔️', 'callback_data': ('no_action') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '⛔️', 'callback_data': ('no_action') }])
            } else {
                ready.push([{ 'text': '⛔️', 'callback_data': ('no_action') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '▶️', 'callback_data': (`next_${config}`) }])
            }

        } else {
            let all
            if (res.data.data.length % 14 !== 0) {
                all = Math.floor(res.data.data.length / 14) + 1
            } else {
                all = Math.floor(res.data.data.length / 14)
            }
            if (res.data.data.length - counter <= 14) {
                let page = Math.floor(counter / 14) + 1 + '/' + all

                ready.push([{ 'text': '◀️', 'callback_data': (`back_${config}`) }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '⛔️', 'callback_data': ('no_action') }])
            } else {
                let page = Math.floor(counter / 14 + 1) + '/' + all
                ready.push([{ 'text': '◀️', 'callback_data': (`back_${config}`) }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '▶️', 'callback_data': (`next_${config}`) }])
            }
        }
        ready.push([{ 'text': 'Add word➕', 'callback_data': ('add_word') }])
        ready.push([{ 'text': 'Back◀️', 'callback_data': ('back-main') }])
        return ready
    },
    keyboardGenerator_words_add: async(res, counter, config, ctx, plus) => {
        let keyboard = []
        let ready = []
        if (config == '1lng') {
            ctx.session.selected_lng1 = undefined
        }
        if (config == '1wrd') {
            ctx.session.selected_add_list1 = undefined
        }
        if (ctx.session.selected_lng1 !== undefined) {
            const index = res.data.data.findIndex((el, index) => {
                if (el.lang_id == ctx.session.selected_lng1) {
                    return true
                }
            })
            res.data.data.splice(index, 1)
        }
        if (ctx.session.selected_add_list1 !== undefined) {
            const index = res.data.data.findIndex((el, index) => {
                if (el.lang_id == ctx.session.selected_add_list1) {
                    return true
                }
            })
            res.data.data.splice(index, 1)
        }
        if (counter) {
            for (let i = counter; i < res.data.data.length; i += 2) {
                if (res.data.data[i + 1]) {
                    keyboard.push([{ 'text': res.data.data[i].lang_name, 'callback_data': (config + res.data.data[i].lang_id) }, { 'text': res.data.data[i + 1].lang_name, 'callback_data': (config + res.data.data[i + 1].lang_id) }])
                } else {
                    keyboard.push([{ 'text': res.data.data[i].lang_name, 'callback_data': (config + res.data.data[i].lang_id) }])
                }
            }
        } else {
            for (let i = 0; i < res.data.data.length; i += 2) {
                if (res.data.data[i + 1]) {
                    keyboard.push([{ 'text': res.data.data[i].lang_name, 'callback_data': (config + res.data.data[i].lang_id) }, { 'text': res.data.data[i + 1].lang_name, 'callback_data': (config + res.data.data[i + 1].lang_id) }])
                } else {
                    keyboard.push([{ 'text': res.data.data[i].lang_name, 'callback_data': (config + res.data.data[i].lang_id) }])
                }
            }
        }
        for (let i = 0; i < 7; i++) {
            if (keyboard[i]) {
                ready.push(keyboard[i])
            }
        }
        if (counter == 0 || counter == undefined) {
            let all
            if (res.data.data.length % 14 !== 0) {
                all = Math.floor(res.data.data.length / 14) + 1
            } else {
                all = Math.floor(res.data.data.length / 14)
            }
            let page = 1 + '/' + all
            if (res.data.data.length <= 14) {
                ready.push([{ 'text': '⛔️', 'callback_data': ('no_action') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '⛔️', 'callback_data': ('no_action') }])
            } else {
                ready.push([{ 'text': '⛔️', 'callback_data': ('no_action') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '▶️', 'callback_data': ('next_' + plus) }])
            }
        } else {
            let all
            if (res.data.data.length % 14 !== 0) {
                all = Math.floor(res.data.data.length / 14) + 1
            } else {
                all = Math.floor(res.data.data.length / 14)
            }
            if (res.data.data.length - counter <= 14) {
                let page = Math.floor(counter / 14) + 1 + '/' + all
                ready.push([{ 'text': '◀️', 'callback_data': ('back_' + plus) }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '⛔️', 'callback_data': ('no_action') }])
            } else {
                let page = Math.floor(counter / 14 + 1) + '/' + all
                ready.push([{ 'text': '◀️', 'callback_data': (`back_${plus}`) }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '▶️', 'callback_data': (`next_${plus}`) }])
            }
        }
        // ready.push([{ 'text': 'Back◀️', 'callback_data': ('words') }])
        return ready
    },
    keyboardGenerator_lists: async(res, counter, config) => {
        let keyboard = []
        let ready = []
        if (counter) {
            for (let i = counter; i < res.data.data.length; i += 2) {
                if (res.data.data[i + 1]) {
                    keyboard.push([{ 'text': res.data.data[i].list_name, 'callback_data': (config + res.data.data[i].list_id) }, { 'text': res.data.data[i + 1].list_name, 'callback_data': (config + res.data.data[i + 1].list_id) }])
                } else {
                    keyboard.push([{ 'text': res.data.data[i].list_name, 'callback_data': (config + res.data.data[i].list_id) }])
                }
            }
        } else {
            for (let i = 0; i < res.data.data.length; i += 2) {
                if (res.data.data[i + 1]) {
                    keyboard.push([{ 'text': res.data.data[i].list_name, 'callback_data': (config + res.data.data[i].list_id) }, { 'text': res.data.data[i + 1].list_name, 'callback_data': (config + res.data.data[i + 1].list_id) }])
                } else {
                    keyboard.push([{ 'text': res.data.data[i].list_name, 'callback_data': (config + res.data.data[i].list_id) }])
                }
            }
        }
        for (let i = 0; i < 7; i++) {
            if (keyboard[i]) {
                ready.push(keyboard[i])
            }
        }
        if (counter == 0 || counter == undefined) {
            let all
            if (res.data.data.length % 14 !== 0) {
                all = Math.floor(res.data.data.length / 14) + 1
            } else {
                all = Math.floor(res.data.data.length / 14)
            }
            let page = 1 + '/' + all
            if (res.data.data.length <= 14) {
                ready.push([{ 'text': '⛔️', 'callback_data': ('no_action') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '⛔️', 'callback_data': ('no_action') }])

            } else {
                ready.push([{ 'text': '⛔️', 'callback_data': ('no_action') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '▶️', 'callback_data': ('next_lst') }])
            }


        } else {
            let all
            if (res.data.data.length % 14 !== 0) {
                all = Math.floor(res.data.data.length / 14) + 1
            } else {
                all = Math.floor(res.data.data.length / 14)
            }
            if (res.data.data.length - counter <= 14) {
                let page = Math.floor(counter / 14) + 1 + '/' + all
                ready.push([{ 'text': '◀️', 'callback_data': ('back_lst') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '⛔️', 'callback_data': ('no_action') }])
            } else {
                let page = Math.floor(counter / 14 + 1) + '/' + all
                ready.push([{ 'text': '◀️', 'callback_data': ('back_lst') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '▶️', 'callback_data': ('next_lst') }])
            }
        }
        ready.push([{ 'text': 'Add list➕', 'callback_data': ('add_list') }])
        ready.push([{ 'text': 'Back◀️', 'callback_data': ('back-main') }])
            // console.log(ready)
        return ready
    },
    keyboardGenerator_lists_words: async(res, res2, counter, config, ctx) => {
        let result = []
        let keyboard = []
        let ready = []
            // console.log(counter)
        for (let i = 0; i < res2.data.data.length; i++) {
            let find = res.data.data.find(el => el.word_id === res2.data.data[i].word_id)
            result.push(find)
        }
        ctx.session.words_from_list = { list_id: ctx.session.selected_list, list_name: res2.data.list_name, words: result }
        if (counter) {
            for (let i = counter; i < result.length; i += 2) {
                if (result[i + 1]) {
                    keyboard.push([{ 'text': result[i].word_lang1 + ' - ' + result[i].word_lang2, 'callback_data': (config + result[i].word_id) }, { 'text': result[i].word_lang1 + ' - ' + result[i].word_lang2, 'callback_data': (config + result[i + 1].word_id) }])
                } else {
                    keyboard.push([{ 'text': result[i].word_lang1 + ' - ' + result[i].word_lang2, 'callback_data': (config + result[i].word_id) }])
                }
            }
        } else {
            for (let i = 0; i < result.length; i += 2) {
                if (result[i + 1]) {
                    keyboard.push([{ 'text': result[i].word_lang1 + ' - ' + result[i].word_lang2, 'callback_data': (config + result[i].word_id) }, { 'text': result[i + 1].word_lang1 + ' - ' + result[i + 1].word_lang2, 'callback_data': (config + result[i + 1].word_id) }])
                } else {
                    keyboard.push([{ 'text': result[i].word_lang1 + ' - ' + result[i].word_lang2, 'callback_data': (config + result[i].word_id) }])
                }
            }
        }
        for (let i = 0; i < 7; i++) {
            if (keyboard[i]) {
                ready.push(keyboard[i])
            }
        }
        if (counter == 0 || counter == undefined) {
            let all
            if (result.length % 14 !== 0) {
                all = Math.floor(result.length / 14) + 1
            } else {
                all = Math.floor(result.length / 14)
            }
            let page = 1 + '/' + all
            if (result.length <= 14) {
                ready.push([{ 'text': '⛔️', 'callback_data': ('no_action') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '⛔️', 'callback_data': ('no_action') }])

            } else {
                ready.push([{ 'text': '⛔️', 'callback_data': ('no_action') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '▶️', 'callback_data': ('next_lst_words') }])
            }


        } else {
            let all
            if (result.length % 14 !== 0) {
                all = Math.floor(result.length / 14) + 1
            } else {
                all = Math.floor(result.length / 14)
            }
            if (result.length - counter <= 14) {
                let page = Math.floor(counter / 14) + 1 + '/' + all
                ready.push([{ 'text': '◀️', 'callback_data': ('back_lst_words') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '⛔️', 'callback_data': ('no_action') }])
            } else {
                let page = Math.floor(counter / 14 + 1) + '/' + all
                ready.push([{ 'text': '◀️', 'callback_data': ('back_lst_words') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '▶️', 'callback_data': ('next_lst_words') }])
            }
        }
        ready.push([{ 'text': 'Edit✏️', 'callback_data': ('list_edit') }, { 'text': 'Alerts🕐', 'callback_data': ('notifications') }, { 'text': 'Delete❌', 'callback_data': ('delete_list_') }])
        ready.push([{ 'text': 'Add word➕', 'callback_data': ('add_word_list') }])
        ready.push([{ 'text': 'Back to lists◀️', 'callback_data': ('words-lists') }])
        return ready
    },
    keyboardGenerator_lists_word_add: async(res, res2, counter, config) => {
        let result = []
        let keyboard = []
        let ready = []
        if (res2.status == 200) {
            for (let i = 0; i < res2.data.data.length; i++) {
                let to_find = res2.data.data[i].word_id
                const index = await res.data.data.findIndex((el, index) => {
                    if (el.word_id == to_find) {
                        return true
                    }
                })
                await res.data.data.splice(index, 1)
            }
        }
        for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].lang1_id == res2.data.lang1_id && res.data.data[i].lang2_id == res2.data.lang2_id) {
                result.push(res.data.data[i])
            }
        }
        if (counter) {
            for (let i = counter; i < result.length; i += 2) {
                if (result[i + 1]) {
                    keyboard.push([{ 'text': result[i].word_lang1 + '-' + result[i].word_lang2, 'callback_data': (config + result[i].word_id) }, { 'text': result[i + 1].word_lang1 + '-' + result[i + 1].word_lang2, 'callback_data': (config + result[i + 1].word_id) }])
                } else {
                    keyboard.push([{ 'text': result[i].word_lang1 + '-' + result[i].word_lang2, 'callback_data': (config + result[i].word_id) }])
                }
            }
        } else {
            for (let i = 0; i < result.length; i += 2) {
                if (result[i + 1]) {
                    keyboard.push([{ 'text': result[i].word_lang1 + '-' + result[i].word_lang2, 'callback_data': (config + result[i].word_id) }, { 'text': result[i + 1].word_lang1 + '-' + result[i + 1].word_lang2, 'callback_data': (config + result[i + 1].word_id) }])
                } else {
                    keyboard.push([{ 'text': result[i].word_lang1 + '-' + result[i].word_lang2, 'callback_data': (config + result[i].word_id) }])
                }
            }
        }
        for (let i = 0; i < 7; i++) {
            if (keyboard[i]) {
                ready.push(keyboard[i])
            }
        }
        if (counter == 0 || counter == undefined) {
            let all
            if (result.length % 14 !== 0) {
                all = Math.floor(result.length / 14) + 1
            } else {
                all = Math.floor(result.length / 14)
            }
            let page = 1 + '/' + all
            if (result.length <= 14) {
                ready.push([{ 'text': '⛔️', 'callback_data': ('no_action') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '⛔️', 'callback_data': ('no_action') }])

            } else {
                ready.push([{ 'text': '⛔️', 'callback_data': ('no_action') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '▶️', 'callback_data': ('next_lst_words_add') }])
            }
        } else {
            let all
            if (result.length % 14 !== 0) {
                all = Math.floor(result.length / 14) + 1
            } else {
                all = Math.floor(result.length / 14)
            }
            if (result.length - counter <= 14) {
                let page = Math.floor(counter / 14) + 1 + '/' + all
                ready.push([{ 'text': '◀️', 'callback_data': ('back_lst_words_add') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '⛔️', 'callback_data': ('no_action') }])
            } else {
                let page = Math.floor(counter / 14 + 1) + '/' + all
                ready.push([{ 'text': '◀️', 'callback_data': ('back_lst_words_add') }, { 'text': `${page}`, 'callback_data': ('no_action') }, { 'text': '▶️', 'callback_data': ('next_lst_words_add') }])
            }
        }
        ready.push([{ 'text': 'Back◀️', 'callback_data': ('words-lists') }])
        return ready
    }

}