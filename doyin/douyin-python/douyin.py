import requests
import re
from requests.exceptions import InvalidURL
from requests.exceptions import ConnectionError
import time

def getParam(url):
    headers = {
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
    }
    try:
        res = requests.get(url,
                        headers=headers, allow_redirects=False)
        hasItemidMid = re.search('video\/(.*?)\/.*?mid=(.*?)&', res.text, re.S)
        if hasItemidMid:
            item_id = hasItemidMid.group(1)
            mid = hasItemidMid.group(2)
            return {
                'item_id': item_id,
                'mid': mid
            }
        else:
            return None
    except InvalidURL:
        return None
    except ConnectionError:
        return None


def getItemInfo(item_id, mid):
    headers = {
        'authority': 'www.iesdouyin.com',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        'content-type': 'application/x-www-form-urlencoded',
        'accept': '*/*',
        'referer': f'https://www.iesdouyin.com/share/video/{item_id}/?region=CN&mid={mid}&u_code=15b9142gf&titleType=title&utm_source=copy_link&utm_campaign=client_share&utm_medium=android&app=aweme',
        'accept-language': 'zh-CN,zh;q=0.9,en-GB;q=0.8,en;q=0.7'
    }
    url = f'https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids={item_id}'
    res = requests.get(url, headers=headers)
    if res.status_code == 200:
        return res.json()


def parse(res_json):
    if 'item_list' in res_json.keys():
        playwm = res_json['item_list'][0]['video']['play_addr']['url_list'][0]
        paly_address = re.sub('playwm', 'play', playwm, re.S)
        palyAddress = getRealAddress(paly_address)
        cover = res_json['item_list'][0]['video']['origin_cover']['url_list'][0]
        return {
            'palyAddress':palyAddress,
            'cover':cover
        }
        # return paly_address


def getRealAddress(url):
    headers = {
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
    }
    res = requests.get(url,
                       headers=headers, allow_redirects=False)
    if res.status_code == 302:
        hasRealAddress = re.search('href=\"(.*?)\"', res.text, re.S)
        if hasRealAddress:
            realAddress = hasRealAddress.group(1)
            return realAddress
            # print(realAddress)
        # href="http://v5-dy.ixigua.com/e5fe3b2018831915c9bf49b3c7888e3d/5f41f235/video/tos/cn/tos-cn-ve-15/ed5e6cce647f49b496e34025d7009123/?a=1128&amp;br=3345&amp;bt=1115&amp;cr=0&amp;cs=0&amp;dr=0&amp;ds=6&amp;er=&amp;l=2020082311284001019806620624FD7E62&amp;lr=&amp;mime_type=video_mp4&amp;qs=0&amp;rc=M29xb2ZoeDZrdzMzZGkzM0ApZGU2aTZmPDs7Nzs8NWQ4ZWdscjZqNXIzLS1fLS0vLS9zc2EzYjVfY2EvLTFhNWBjMWE6Yw%3D%3D&amp;vl=&amp;vr="


if __name__ == "__main__":
    url = "https://v.douyin.com/JrvKMF6/ "
    params = getParam(url)
    if params:
        res_json = getItemInfo(item_id=params['item_id'], mid=params['mid'])
        for i in range(20):
            time.sleep(2)
            play_address_cover = parse(res_json)
            print(play_address_cover['palyAddress'])
        # getRealAddress(paly_address)
    else:
        print('item_id or mid was not found')
        print('链接是否正确？')
