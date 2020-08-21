import requests
from bs4 import BeautifulSoup
from retrying import retry
import pandas as pd
import json
import re


@retry
def getHtml(page):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36'
    }
    res = requests.get(
        f'https://www.goodreads.com/quotes/tag/inspirational?page={str(page)}', headers=headers)
    # if res.status_code ==200:
    res.raise_for_status()
    # print(res.text)
    return res.text


def parse(html):
    soup = BeautifulSoup(html, 'lxml')
    quotes = soup.select('.quote')
    onePageData = []
    for quote in quotes:
        text = quote.select('.quoteText')[0].getText().strip()
        text = re.sub('\n', '', text, re.S).strip()
        text = re.sub('   ― .*$', '', text, re.S)
        author = quote.select('.authorOrTitle')[0].string.strip()
        onePageData.append({
            "content": text,
            "author": author
        })
    return onePageData


if __name__ == "__main__":
    data = []
    for i in range(1, 100):
        print('page', i)
        html = getHtml(i)
        onePageData = parse(html)
        data += onePageData
        if i % 10 == 0:
            print(data)
            df = pd.DataFrame(data)
            print(df)
            df.to_csv('goodReader.csv', encoding="utf-8")
    print(data)
    df = pd.DataFrame(data)
    print(df)
    df.to_csv('goodReader.csv', encoding="utf-8")
