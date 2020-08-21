import requests
from bs4 import BeautifulSoup
from retrying import retry
import pandas as pd
import json

@retry
def getHtml(page):
    res = requests.get(f'http://quotes.toscrape.com/page/{str(page)}/')
    # if res.status_code ==200:
    res.raise_for_status()
    return res.text
    

def parse(html):
    soup = BeautifulSoup(html,'lxml')
    quotes = soup.select('.quote')
    onePageData = []
    for quote in quotes:
        text = quote.select('.text')[0].string
        author = quote.select('.author')[0].string
        onePageData.append({
            "content":text,
            "author":author
        })
    return onePageData

if __name__ == "__main__":
    data = []
    for i in range(1,11):
        print('page',i)
        html = getHtml(i)
        onePageData = parse(html)
        data += onePageData
    
    resultData = []
    for index,item in enumerate(data):
        item['index'] = str(index+1).zfill(3)
        resultData.append(item)
    print(resultData)
    # with open("result.json","a",encoding="utf-8") as f:
    #     f.write(json.dumps(resultData))
    #     f.close()
    df = pd.DataFrame(resultData)
    print(df)
    df.to_csv('quotes2.csv',encoding="utf-8")
