const DomParser= require('dom-parser');
const fetch = require("node-fetch");

var parser = new DomParser();
let url = "https://www.google.com/search?q={QUERY}&num=1&tbm=isch&ie=UTF-8&oe=UTF-8"

const functions = {
    requestCode: (url) => {
        return new Promise((resolve, reject) => {
            fetch(url)
            .then( res => res.text() )
            .then( res => {
                resolve(res)
            })
            .catch( err => reject(err) )
        })
    },
    parseHtml: (code, classname) => {
        var dom = parser.parseFromString(code);
        return dom.getElementsByClassName(classname)
    }
}

module.exports = function(app) {  

  app.message(/imagen/, async ({message, say}) => {
    //Request code and format it to obtain a different code per image
    const queryParsed = String(message.text).replace('chuncho','').replace('imagen','')
    var images_code = functions
      .parseHtml(await functions.requestCode(url.replace(/{QUERY}/g, queryParsed)), "TxbwNb")
      .map(item => item = item.innerHTML)

    //Check that we have at least one image
    if(images_code.length == 0){
        return say('No encontré ninguna imagen')
    }

    //Parse the output
    var images_array = images_code.map(item => {
        var dom = parser.parseFromString(item)
        return {
            image: dom.getElementsByClassName("t0fcAb")[0]?.attributes[2].value || null,
            title: dom.getElementsByClassName("fYyStc")[0]?.innerHTML || null,
            from: dom.getElementsByClassName("fYyStc")[1]?.innerHTML || null
        }
    })
    
    say({
      "text": message.text,
      "blocks": [
        {
          "type": "image",
          "title": {
            "type": "plain_text",
            "text": "image1",
            "emoji": true
          },
          "image_url": images_array[0].image,
          "alt_text": message.text
        }
      ]
    })

  })

}
