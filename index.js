const express = require('express');
const Jimp = require('jimp');
const assert = require('assert');

const app = express();

app.get('/api/1/images/:dimensions', function(req, res){ 
    Jimp.read('./public/img/Cat_November_2010-1a.jpg', function(err, img){
        assert.equal(err, null);

        const size = req.params.dimensions.split('x');
        const width = parseInt(size[0]);
        const height = parseInt(size[1]);
        
        const resizeType = req.query.resize_type;
        const bg = req.query.bg;
        switch(resizeType){
            case 'contain':
                img.background(parseInt('0x' + bg + 'ff'));
                img.contain(width, height);
                break;
            case 'stretch':
                img.resize(width, height);
                break;
            case 'cover':
            default:
                img.cover(width, height);
        }

        const text = req.query.text;
        if(text){
            Jimp.loadFont(Jimp.FONT_SANS_64_BLACK).then(function (font) {
                img.print(font, 10, 10, text);
                sendImage();
            });
        } else {
            sendImage();
        }

        function sendImage(){
            img.getBuffer(Jimp.MIME_JPEG, function(err, buffer){
                res.set("Content-Type", Jimp.MIME_JPEG);
                res.send(buffer);
            });
        }

    });
});

app.listen(3000, function(){
    console.log('servidor iniciado');
});