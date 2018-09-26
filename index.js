const jsdom = require("jsdom")
const {JSDOM} = jsdom

const fetch = require('node-fetch')

module.exports = {
    search: function (title_yt_search, sort_by) {
        let sort_by_options = {
            relevance: 'CAASAhAB',
            uploadtime: 'CAISAhAB',
            viewcount: 'CAMSAhAB',
            rating: 'rCAESAhAB'
        }

        const domain_search = 'https://www.youtube.com/'


        return new Promise((resolve, reject) => {

            if (!sort_by) {
                sort_by = 'relevance'
            }

            if (!sort_by_options[`${sort_by}`]) {
                reject('You typed an invalid sort type!')
            }

            fetch(`${domain_search}results?sp=${sort_by_options[`${sort_by}`]}&search_query=${title_yt_search}`)
                .then(res => res.text())
                .then(body => {

                    const dom = new JSDOM(body).window.document

                    let entire_list = []

                    let content = dom.querySelectorAll('.yt-lockup')
                    if (content.length === 0) {
                        resolve('No search result!')
                    }


                    content.forEach((e, ind) => {

                        const s = new JSDOM(e.outerHTML).window.document

                        if (!s.querySelector('.yt-badge-live')) {

                            const check_description = s.querySelector('.yt-lockup-description')

                            const title = s.querySelector(".yt-lockup-title a[title]").textContent
                            const video_cover = s.querySelector(".yt-thumb-simple img").src
                            const total_views = s.querySelector(".yt-lockup-meta-info").childNodes[1].textContent
                            const released = s.querySelector(".yt-lockup-meta-info").childNodes[0].textContent
                            const duration = s.querySelector('.accessible-description').textContent.match(/\d+:\d+/g).join()
                            const description = (check_description) ? check_description.textContent.split('\n').map(x => x.trim()).join() : 'No description.'
                            const video_link = s.querySelector('.yt-lockup-title a').href
                            const channel_link = s.querySelector('.yt-lockup-byline a').href

                            entire_list.push({
                                id: ind,
                                title,
                                video_cover,
                                total_views,
                                released,
                                duration,
                                description,
                                video_link,
                                channel_link
                            })
                        }

                    })

                    resolve(entire_list)

                }).catch(err => {
                    reject(`Cannot get an response: ${err}`)
                })
        })

    }
}
