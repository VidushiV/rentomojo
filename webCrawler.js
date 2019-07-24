var request = require('request');
var cheerio = require('cheerio');
var mysql = require('mysql');
var url = 'https://medium.com';
request(url, function(err, resp, body){
    var hyprMap = new Map();
    $ = cheerio.load(body);
    links = $('a'); //jquery get all hyperlinks
    $(links).each(function(i, link){
        console.log($(link).text() + ':\n  ' + $(link).attr('href'));
        if(hyprMap.has( $(link).attr('href'))){
            var s = hyprMap.get( $(link).attr('href'));
            hyprMap.set( $(link).attr('href'),s+1)
        }else{
            hyprMap.set( $(link).attr('href'),1)
        }
    });
    console.log('',hyprMap);

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "rentomojo"
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
            var sql = "INSERT INTO medium_hp (hyperlink, ref_count) VALUES ?";
            con.query(sql, [hyprMap], function(err) {
                console.log(sql);
                if (err) throw err;
                con.end();
            });
    });
});