var rp = require('request-promise');
var request = require('request');

function requestNotRedirect(url) {
    return new Promise((resolve, reject) => {
        var options = {
            uri: url,
            headers: {
                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
            },
            followRedirect: false,
            resolveWithFullResponse: true,
        };
        request.get(options, function (error, response, body) {
            // console.error('error:', error); // Print the error if one occurred
            // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            // console.log('body:', body); // Print the HTML for the Google homepage.
            resolve(response)
        })
    })

}


async function getParam(url) {
    const res = await requestNotRedirect(url)
    // console.log(res.body)
    var pattern = new RegExp("video\/(.*?)\/.*?mid=(.*?)&");
    if (pattern.test(res.body)) {
        item_id = RegExp.$1;
        mid = RegExp.$2;
        // console.log(item_id, mid);
        return {
            'item_id': item_id,
            'mid': mid
        }
    } else {
        return null
    }

}

async function getItemInfo(item_id, mid) {
    var url = `https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=${item_id}`
    // console.log(url)
    try {
        var options = {
            uri: url,
            headers: {
                'authority': 'www.iesdouyin.com',
                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
                'content-type': 'application/x-www-form-urlencoded',
                'accept': '*/*',
                'referer': `https://www.iesdouyin.com/share/video/${item_id}/?region=CN&mid=${mid}&u_code=15b9142gf&titleType=title&utm_source=copy_link&utm_campaign=client_share&utm_medium=android&app=aweme`,
                'accept-language': 'zh-CN,zh;q=0.9,en-GB;q=0.8,en;q=0.7'
            }
        };
        var res = await rp(options)
        return JSON.parse(res);
    } catch (err) {
        console.log(err)
    }

}

async function parse(res_json) {
    var playwm = res_json.item_list ? res_json['item_list'][0]['video']['play_addr']['url_list'][0] : null
    if (playwm) {
        var paly_address = playwm.replace('playwm', 'play')
        // console.log(paly_address)
        var realAddress = await getRealAddress(paly_address);
        var cover = res_json['item_list'][0]['video']['origin_cover']['url_list'][0]
        return {
            'palyAddress': realAddress,
            'cover': cover
        }
    }


}

async function getRealAddress(url) {
    const res = await requestNotRedirect(url);
    // console.log(res.body)
    var pattern = new RegExp('href=\"(.*?)\"');
    if (pattern.test(res.body)) {
        return RegExp.$1;
        // console.log(RegExp.$1)
    }

}


! async function () {
    var url = "https://v.douyin.com/JrvKMF/"
    var params = await getParam(url);
    // console.log(params)
    if (params) {
        var res_json = await getItemInfo(params.item_id, params.mid)
        var result = await parse(res_json);
        console.log(result);
    }

}()
