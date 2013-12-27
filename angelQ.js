var stats = require('statsjs')
var request = require('request');
var mongoose = require('mongoose')

var data = []
var oldData = []

var doStats = function(data){
    answer = stats(data).linReg();
    console.log('stats: ', answer)
}

intervalID = setInterval(function(){
    if (oldData.length === data.length){
        doStats(data)
        clearInterval(intervalID)
    }
    else{
        oldData = data
    }
},30000)

for(var p = 0; p < 72; p++){
    request('https://api.angel.co/1/startups?filter=raising&page=' + (p+1), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body)
            for (var i = 0; i < body.startups.length; i++){
                console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=')
                console.log(body.startups[i].name)
                console.log('Quality: ', body.startups[i].quality)
                console.log(body.startups[i].fundraising)
                if (body.startups[i].fundraising.raised_amount > 0){
                    var raised = body.startups[i].fundraising.raised_amount
                    var quality = body.startups[i].quality
                    data.push({x:raised,y:quality})
                }
            }
        }
    })  
}