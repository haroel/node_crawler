

let handler1 = function(resolve,reject)
{
    console.log("handler1 run");
    setTimeout(function()
    {
        console.log("handler1 end");
        resolve();
    },1000);
};

let handler2 = function(resolve,reject)
{
    console.log("handler2 run");
    setTimeout(function()
    {
        console.log("handler2 end");
        resolve();
    },2200);
};
let p = new Promise(handler1);
p = p.then(function () {
    return new Promise(handler2);
});
p.then(function()
{
    console.log("over");
})
console.log("run begin");

let fs = require("fs");
let path = require("path");

 fs.appendFile(path.join(__dirname,"_log1.txt"),"hellp111111","utf-8",function(){});
