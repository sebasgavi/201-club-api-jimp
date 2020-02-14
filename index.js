const express = require('express');
const Jimp = require('jimp');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const app = express();

app.get('/api/1/images/:dimensions', function(req, res){ 
    var type = req.query.type;

    fs.readdir('./public/img/', function(err, files){
        assert.equal(err, null);

        const typeExists = files.includes(type);

        if(!typeExists){
            // creo un número random desde 0 hasta el tamaño del arreglo
            const random = Math.floor(Math.random() * files.length);
            // uso el número random para sacar la carpeta en esa posición
            type = files[random];
        }

        
        fs.readdir('./public/img/' + type, function(err, files){
            assert.equal(err, null);
            console.log(files);
            // creo un número random desde 0 hasta el tamaño del arreglo
            const random = Math.floor(Math.random() * files.length);
            // uso el número random para sacar el nombre de la imagen en esa posición
            const imgName = files[random];

            Jimp.read('./public/img/' + type + '/' + imgName, function(err, img){
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
    });
});

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(3000, function(){
    console.log('servidor iniciado');
});