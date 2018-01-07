const WebSocket = require('ws');
const hight_price = 0.0005000;
const low_price = 0.0004500;
const user = 1735632;
const fs = require('fs');
const ws = new WebSocket('wss://stream.binance.com:9443/ws/cmteth@aggTrade');

ws.on('message', function incoming(data) {
  var price = 0;
  price = JSON.parse(data)["p"];
  var pre_time = 0;
  if(price < low_price || price > hight_price) {
    var dt = new Date();
    var fileData = fs.readFileSync("time.txt", "utf8");
    if (Math.abs(Date.now() - fileData)/1000 > 30){
      fs.writeFile('time.txt', Date.now(), (err) => {
        if (err) throw err;
      });
      sendMessage(price);
    }
  }
});

function sendMessage(price){
  var request = require('request');
  var body = "[info][title]Hi [To:" + user + "] Phuong! This best price to trade. [/title] [code]Price: " + price + " [/code]Link: https://www.binance.com[/info]";
  var room_id = 45438008;
  var options = {
    url: 'https://api.chatwork.com/v2/rooms/'+room_id+'/messages',
    headers: {
      'X-ChatWorkToken': '8b584c1da0eb6a89d2f63aa0b707f3a7'
    },
    form: { body: body },
    json: true
  };

  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log("Success");
    }else{
        console.log('error: '+ response.statusCode);
    }
  });
}
