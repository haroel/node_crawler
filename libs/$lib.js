/**
 * Created by howe on 2016/11/16.
 */
let http = require('http');
let url = require("url");

let trace = console.log;

module.exports.getWebPageContent = function (_url) {

    let handler = function(resolve,reject)
    {
        let html = "";
        let req = http.get(_url, function(res){
            res.setEncoding('utf8');
            res.on('data', function(chunk){
                html += chunk;
            });
            res.on('error', function(err){
                trace("error",err);
                reject(err);
            });
            res.on('end', function(err){
                resolve(html);
            });
        });
    };
    return new Promise(handler);
};