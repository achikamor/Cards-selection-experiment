//jshing esversion:6

var random_indexes = [];    //this array will be incahrge of the order of the trials display
for(var i=0; i<30;i++){     //initialize aray of indexes
    random_indexes[i] = i;
}
random_indexes.sort(() => Math.random() - 0.5); //randomize the indexes array


var blue_prices = [0.9, 0.4, 0.5, 0.3, 0.8, 0.6, 0.5, 0.7, 0.2, 0.7,
    0.4, 0.5, 0.7, 0.3, 0.9, 0.6, 0.1, 0.4, 0.8, 0.2,
    0.1, 0.6, 0.3, 0.5, 0.2, 0.4, 0.8, 0.2, 0.1, 0.3];
var red_prices = [0.8, 0.2, 0.4, 0.1, 0.6, 0.3, 0.3, 0.5, 0.1, 0.6,
    0.4, 0.5, 0.7, 0.3, 0.9, 0.6, 0.1, 0.4, 0.8, 0.2,
    0.2, 0.9, 0.7, 0.6, 0.3, 0.7, 0.9, 0.5, 0.4, 0.4];

var blue_result = [];
var red_result = [];
var blue_init = "pics/sad/";
var red_init = "pics/angry/";
if(blue_prices[random_indexes[0]] >= red_prices[random_indexes[0]]){
    blue_init = "pics/angry/";
    red_init = "pics/sad/";
}

for(j=0;j<30;j++){      //fillig the array of pictures (nedd to fill it without looping)
    blue_result[j] = blue_init + j + ".jpg";
    red_result[j] = red_init + j + ".jpg";
}

var runner = 0;
var blue_current_price = 0;
var red_current_price = 0;
var blue_current_pic = "";
var red_current_pic = "";
var selections = [];
var tirals_timing = [];
var total_amount_of_money = 0;
var begin_time = 0;
var end_time = 0;

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var util = require("util");
const fs = require("fs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get("/", function(req, res){
    res.set("content-type", "text/html");
    res.sendFile(__dirname + "/welcome.html");
})


app.get("/card", function(req, res){
    var get_timing = new Date();
    begin_time = get_timing.getTime();
    blue_current_price = blue_prices[random_indexes[runner]];
    red_current_price = red_prices[random_indexes[runner]];

    res.render("card", {redPrice: red_current_price, bluePrice: blue_current_price});
})

app.post("/card", function(req, res){
    selections[random_indexes[runner]] = req.body.selection;
    var post_timing = new Date();
    end_time = post_timing.getTime();
    var time_diff = (end_time - begin_time)/1000;   //make time difference in seconds
    tirals_timing[random_indexes[runner]] = time_diff;

    if(req.body.selection == 1){
        res.redirect("/showBluePic");
        total_amount_of_money += blue_prices[random_indexes[runner]];
    }

    if(req.body.selection == 2){
        res.redirect("/showRedPic");
        total_amount_of_money += red_prices[random_indexes[runner]];
    }
})

app.get("/showBluePic",function(req, res){
    blue_current_pic = blue_result[runner+1];
    runner++;
    if(runner < 30)
        res.render("showBluePic", {bluePic: blue_current_pic});
    else
        res.redirect("/finish");
})

app.get("/showRedPic",function(req, res){
    red_current_pic = red_result[runner+1];
    runner++;
    if(runner < 30)
        res.render("showRedPic", {redPic: red_current_pic});
    else
        res.redirect("/finish");
})

app.get("/finish", function(req, res){
    res.render("finish", {totalAmount: total_amount_of_money.toFixed(1) , RandIndx: random_indexes, Selcs: selections, times: tirals_timing});
})

app.post("/finish", function(req, res){
    fs.writeFileSync('data/mynewfile1.txt', util.inspect(new_result), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    res.sendFile(__dirname + "/goodbye.html");
})

app.listen(3000, function(){
    console.log("server started on port 3000");
})