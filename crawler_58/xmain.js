/**
 * Created by howe on 2016/11/16.
 */
'use strict';


let fs = require("fs");
let http = require('http');
let url = require("url");
let path = require("path");


let request = require("request");
let cheerio = require("cheerio");


let $lib = require("../libs/$lib.js");

let trace = console.log;


let startURL = 'http://sh.58.com/pudongxinqu/chuzu/b10j1/?PGTID=0d3090a7-0058-3c4f-886a-69e2708fddfb&ClickID=9';

const NUM = 100;

function startCrawler ( _url_ )
{
    trace("爬虫地址",_url_);

    $lib.getWebPageContent(_url_)
        .then(function (html) {
            let mainUrlObj = url.parse(_url_);
            let $ = cheerio.load(html);
            let infolist = $('.main').find('#infolist').find('table').find('tr');
            trace(`爬取到${infolist.length}条记录`);
            let _log = "";
            let p = Promise.resolve();
            infolist.each(function(id,element)
            {
                let _tr = $(element);
                let title = _tr.find("td:nth-child(2)").find("a:first-child").text();
                let price = _tr.find("td:last-child").find("b:first-child").text();
                let img = _tr.find("td:first-child").find("img").attr("lazy_src");
                if (title !== "")
                {
                    let log = `${title} ${' '.repeat( Math.max(1, NUM - title.length))}  价格:${price}\n`;
                    _log += log;
                }
                if (img)
                {
                    let fileName = path.basename(img);
                    p = p.then(()=>
                    {
                        trace("下载成功",img);
                        return $lib.getImage(img,path.join(__dirname,"img",fileName) );
                    });
                }
            });
            p.then(()=>
            {
                return $lib.appendFile(path.join(__dirname,"_log.txt"),_log,"utf-8");
            }).catch(function(e) {
                trace("下载错误,",e,e.url,e.savedPath);
            }).then(function() {
                let nextPageUrl = $('.main').find(".pager").find("a.next").attr("href");
                mainUrlObj.pathname = nextPageUrl;
                mainUrlObj.path = nextPageUrl;
                startCrawler(url.format(mainUrlObj));
            });
        })
        .catch(function (err) {
            trace(err);
        })
}

startCrawler(startURL);
