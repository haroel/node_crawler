/**
 * Created by howe on 2016/11/16.
 */
let http = require('http');
let url = require("url");
let fs = require("fs");


let request = require("request");

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

module.exports.getHtml = function (url) {
    return new Promise(
        (resolve,reject)=>
        {
            request(url, (error,response,body) =>
            {
                if (error)
                {
                    reject(error);
                }else
                {
                    if (response.statusCode == 200)
                    {
                        resolve(body)
                    }
                }
            })
        }
    )
};

module.exports.getImage = function (url, savedPath ) {
    return new Promise(
        (resolve,reject)=>
        {
            request({uri: url, encoding: 'binary'}, function (error, response, body)
            {
                if (!error ) {
                    if (response.statusCode == 200)
                    {
                        fs.writeFile(savedPath, body, 'binary', function (err) {
                            if (err) {
                                error.url = url;
                                error.savedPath = savedPath;
                                reject(error);
                            } else {
                                resolve(url, savedPath);
                            }
                        });
                    }
                }else {
                    error.url = url;
                    error.savedPath = savedPath;
                    reject(error);
                }
            });
        }
    )
};