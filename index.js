const jsdom = require("jsdom")
const { JSDOM } = jsdom;

const fetch = require('node-fetch')

const yt_search = (title_yt_search, callback) => {
    fetch(`https://www.youtube.com/results?search_query=${title_yt_search}`).then(res => res.text()).then(body => {
        const dom = new JSDOM(body).window.document

        let entire_list = []

        dom.querySelectorAll('.yt-lockup').forEach((e, ind) => {
            const s = new JSDOM(e.outerHTML).window.document
            
            const check_title = s.querySelector(".yt-lockup-title a[title]")
            const check_duration = s.querySelector('.accessible-description').textContent.match(/\d+:\d+/g)
            const check_total_views = s.querySelector(".yt-lockup-meta-info")
            const check_realeased_date = s.querySelector(".yt-lockup-meta-info")
            const check_description = s.querySelector('.yt-lockup-description')
            const check_channel_link = s.querySelector('.yt-lockup-byline a')

            const title = (check_title) ? check_title.textContent : 'Cannot get the title'
            const video_cover = s.querySelector(".yt-thumb-simple img").src
            const total_views = (check_total_views) ? check_total_views.childNodes[1].textContent : 'Cannot get the views.'
            const released = (check_realeased_date ) ? check_realeased_date .childNodes[0].textContent: 'Connot get released date.'
            const duration = (check_duration) ? check_duration.join() : 'This may be a playlist, it doest not have a duration.'
            const description = (check_description) ? check_description.textContent.split('\n').map(x => x.trim()).join() : 'No description.'
            const video_link = s.querySelector('.yt-lockup-title a').href
            const channel_link = (check_channel_link) ? check_channel_link.href : 'Cannot find a channel.'

            entire_list.push({id: ind, title, video_cover, total_views, released, duration, description, video_link, channel_link})
        })
        
        
        return callback(entire_list)
         
    }).catch(err => {
        console.log(err);
        
        callback(null, `Error: Cannot get an response: ${err}`)
    })
}

module.exports.find = function(search_name, callback){
    if (search_name.length < 4) {
        callback(null, new Error('Searching a name require minumum 4 character.'))
    }
    yt_search(search_name, (itms, err) => {
        callback(itms, err)
    })
}