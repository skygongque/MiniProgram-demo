import requests
import json
import pandas as pd


def get_html(page):
    url = f"https://ma.youdu.duzaa.com/article?page={str(page)}&size=10&type=2&sort=2"
    headers = {
    'Host': 'ma.youdu.duzaa.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
    'content-type': 'application/json',
    'Referer': 'https://servicewechat.com/wx2c71e03a29a225d6/19/page-frame.html'
    }

    response = requests.request("GET", url, headers=headers,verify= False)
    if response.status_code == 200:
        return response.json()


    


if __name__ == "__main__":
    articles_list = []
    for i in range(1,100):
        print('page',i)
        res_json = get_html(i)
        if res_json["code"] == 0:
            articles_list += res_json['articles']
        else:
            break
    print(articles_list)
    df1 = pd.DataFrame(articles_list)
    df1.to_csv('result4.csv')
    # with open('result4.json','w',encoding='utf-8') as f:
    #     f.write(json.dumps(articles_list,ensure_ascii=False))