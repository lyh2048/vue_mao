# 毛泽东选集

ʕ•̫͡•ʔ-̫͡-ʕ•͓͡•ʕ•̫͡•ʔ-̫͡-ʕ•͓͡•ʔ-̫͡-ʔ

[技术架构](#技术架构) | [项目部署](#项目部署) | [数据来源](#数据来源) | [参考资料](#参考资料)

## 技术架构

- 后端：Python Flask
- 前端：Vue
- 数据库：MongoDB

## 项目部署

数据库采用`MongoDB Cloud`

[MongoDB Cloud](https://www.mongodb.com/zh-cn/cloud)

MongoDB Cloud 是构建数据驱动型应用程序的最佳方式

后端使用Python Flask框架，采用腾讯云函数来部署后端服务

> 云函数（Serverless Cloud Function，SCF）是腾讯云为企业和开发者们提供的无服务器执行环境，帮助您在无需购买和管理服务器的情况下运行代码。您只需使用平台支持的语言编写核心代码并设置代码运行的条件，即可在腾讯云基础设施上弹性、安全地运行代码。SCF 是实时文件处理和数据处理等场景下理想的计算平台。

前端使用了Vue、ElementUI、Axios等技术

前端部署采用了`Github Pages`

## 数据来源

- [毛泽东选集 第一卷](https://www.bilibili.com/read/readlist/rl330029)
- [毛泽东选集 第二卷](https://www.bilibili.com/read/readlist/rl331197)
- [毛泽东选集 第三卷](https://www.bilibili.com/read/readlist/rl334156)
- [毛泽东选集 第四卷](https://www.bilibili.com/read/readlist/rl336027)
- ……

🎃爬虫代码：

```python
import requests
import json
import pymongo
from lxml import etree


'''
毛泽东选集 第一卷
https://www.bilibili.com/read/readlist/rl330029
毛泽东选集 第二卷
https://www.bilibili.com/read/readlist/rl331197
毛泽东选集 第三卷
https://www.bilibili.com/read/readlist/rl334156
毛泽东选集 第四卷
https://www.bilibili.com/read/readlist/rl336027
'''


read_list_urls = [
    'https://www.bilibili.com/read/readlist/rl330029',
    'https://www.bilibili.com/read/readlist/rl331197',
    'https://www.bilibili.com/read/readlist/rl334156',
    'https://www.bilibili.com/read/readlist/rl336027',
]
headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 Edg/98.0.1108.62'
}
global_index = 1
db = None


def parse_read_list(read_list_url):
    global global_index
    index = read_list_url.find('rl')
    if index == -1:
        return
    idx = read_list_url[index+2:]
    api_url = f'https://api.bilibili.com/x/article/list/web/articles?id={idx}&jsonp=jsonp'
    r = requests.get(url=api_url, headers=headers)
    if r.status_code != 200:
        print(f'{api_url}请求失败, 状态码: {r.status_code}')
        return
    data = json.loads(r.text)
    if data['code'] != 0:
        print(data['message'])
        return
    articles = data['data']['articles']
    for article in articles:
        id = article['id']
        title = article['title']
        publish_time = article['publish_time']
        content = get_article_content(id)
        article_data = {
            'index': global_index,
            'title': title,
            'content': content,
            'publish_time': publish_time
        }
        save_article(article_data=article_data)
        global_index += 1


def get_article_content(id):
    content_url = f'https://www.bilibili.com/read/cv{id}'
    r = requests.get(url=content_url, headers=headers)
    if r.status_code != 200:
        return ''
    html = etree.HTML(r.text)
    content_node = html.xpath('//div[@id="read-article-holder"]')
    if len(content_node) == 0:
        return ''
    return etree.tostring(content_node[0], encoding='utf-8', pretty_print=True).decode('utf-8')


def save_article(article_data):
    db.articles.insert_one(article_data)
    print(f'{article_data["title"]}')


if __name__ == '__main__':
    client = pymongo.MongoClient('mongodb+srv://<用户名>:<密码>@cluster0.uiahx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    db = client['mao']
    for url in read_list_urls:
        parse_read_list(url)
```

## 参考资料

[腾讯云函数](https://cloud.tencent.com/document/product/583)

[Element，一套为开发者、设计师和产品经理准备的基于 Vue 2.0 的桌面端组件库](https://element.eleme.cn/#/zh-CN)

