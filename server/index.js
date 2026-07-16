import http from 'node:http';
import fs from 'node:fs/promises';

const server = http.createServer((req,res) => {
    console.log(req.method);
    console.log(req.url);

    if(req.url === '/index' || req.url === '/') {
        async function info () {
            try {
                let data = await fs.readFile('../pages/index.html', {encoding: 'utf8'});
                res.writeHead(200, {
                    'content-type': 'text/html'
                });
                res.end(data);
            } catch (err) {
                console.error(err);
                res.writeHead(500, {
                    'content-type': 'text/plain'
                });
                res.end('Oh no');
            }      
        }
        info();
        return;
    }

    if(req.url === '/styles/index-style.css') {
        async function info() {
            try {
                let styleData = await fs.readFile('../styles/index-style.css', {encoding: 'utf8'});
                res.writeHead(200, {
                    'content-type': 'text/css'
                });
                res.end(styleData);
            } catch (err) {
                console.error(err);
                res.writeHead(500, {
                    'content-type': 'text/plain'
                });
                res.end('Oh no');
            }
        }
        info();
        return;
    }

    if(req.url === '/img/Logo.png?v=2' || req.url === '/img/Logo.png') {
        async function info() {
            try{ 
                let logoData = await fs.readFile('../img/Logo.png');
                res.writeHead(200, {
                    'content-type': 'image/png'
                });
                res.end(logoData);
            } catch (err) {
                console.error(err);
                res.writeHead(500, {
                    'content-type': 'text/plain'
                });
                res.end('Oh no');
            }
        }
        info();
        return;
    }




    if(req.url === '/about') {
        res.end('<h1>About</h1>');
        return;
    }

    if(req.url === '/contact') {
        res.end('<h1>Contact</h1>');
        return;
    }

    res.writeHead(404);
    res.end('<h1>404</h1>');
});

server.listen(8000);