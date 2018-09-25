const jsdom = require("jsdom")
const { JSDOM } = jsdom;

const fetch = require('node-fetch')

let yt_search = (title_yt_search, callback) => {
    fetch(`https://www.youtube.com/results?search_query=${title_yt_search}`).then(res => res.text()).then(body => {
        const dom = new JSDOM(body).window.document

        let entire_list = []

        dom.querySelectorAll('.yt-lockup').forEach((e, ind) => {
            let s = new JSDOM(e.outerHTML).window.document
            
            let check_duration = s.querySelector('.accessible-description').textContent.match(/\d+:\d+/g)
            let check_total_views = s.querySelector(".yt-lockup-meta-info")
            let check_realeased_date = s.querySelector(".yt-lockup-meta-info")
            let check_description = s.querySelector('.yt-lockup-description')
            let check_channel_link = s.querySelector('.yt-lockup-byline a')

            let title = s.querySelector(".yt-lockup-title a[title]").textContent
            let video_cover = s.querySelector(".yt-thumb-simple img").src
            let total_views = (check_total_views) ? check_total_views.childNodes[1].textContent : 'Cannot get the views.'
            let released = (check_realeased_date ) ? check_realeased_date .childNodes[0].textContent: 'Connot get released date.'
            let duration = (check_duration) ? check_duration.join() : 'This may be a playlist, it doest not have a duration.'
            let description = (check_description) ? check_description.textContent.split('\n').map(x => x.trim()).join() : 'No description.'
            let video_link = s.querySelector('.yt-lockup-title a').href
            let channel_link = (check_channel_link) ? check_channel_link.href : 'Cannot find a channel.'

            entire_list.push({id: ind, title, video_cover, total_views, released, duration, description, video_link, channel_link})
        })
        
        return callback(entire_list)
         
    })
}


module.exports.find = function(search_name, callback){
    yt_search(search_name, (itms) => {
        callback(itms)
    })
}