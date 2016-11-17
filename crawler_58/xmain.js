/**
 * Created by howe on 2016/11/16.
 */
'use strict';


let cheerio = require("cheerio");
let fs = require("fs");
let http = require('http');
let url = require("url");


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
            let _log = "";
            infolist.each(function()
            {
                let _tr = $(this);
                let title = _tr.find("td:nth-child(2)").find("a:first-child").text();
                let price = _tr.find("td:last-child").find("b:first-child").text();

                if (title !== "")
                {
                    let log = `${title} ${' '.repeat( Math.max(1, NUM - title.length))}  价格:${price}\n`;
                    _log += log;
                }
            });
            trace(`爬取到${infolist.length}条记录`);
            fs.appendFile(__dirname + "_log.txt",_log,"utf-8", function () {
            });
            let nextPageUrl = $('.main').find(".pager").find("a.next").attr("href");
            mainUrlObj.pathname = nextPageUrl;
            mainUrlObj.path = nextPageUrl;
            startCrawler(url.format(mainUrlObj));
        })
        .catch(function (err) {
            trace(err);
        })
}

startCrawler(startURL);
