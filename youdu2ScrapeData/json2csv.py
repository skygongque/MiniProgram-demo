import pandas as pd
import json

with open('result3.json','r',encoding='utf-8') as f:
    content = json.loads(f.read())


df1 = pd.DataFrame(content)
df1.to_csv('result3.csv')