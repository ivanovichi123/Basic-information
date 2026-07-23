import http from 'node:http';
import fs from 'node:fs/promises';
import { URL } from 'node:url';

const server = http.createServer(async (req,res) => {
    console.log(req.method);
    console.log(req.url);
    const theTest = req.url;
    let theURL = new URL("http:localhost:8000" + req.url);

    if(theTest.match(/[/].*[/]/) === null) {
        let responseInfo = await htmlInfo(theURL.pathname);
        res.writeHead(responseInfo[0], {
            'content-type': responseInfo[1]
        });
        res.end(responseInfo[2]);
        return;
    }

    if(theTest.match(/[/]styles[/]/) !== null) {
        let responseInfo = await styleInfo(theURL.pathname);
        res.writeHead(responseInfo[0], {
            'content-type': responseInfo[1]
        });
        res.end(responseInfo[2]);
        return;
    }

    if(theTest.match(/[/]img[/]/) !== null) {
        let responseInfo = await imageInfo(theURL.pathname);
        res.writeHead(responseInfo[0], {
            'content-type': responseInfo[1]
        });
        res.end(responseInfo[2]);
        return;
    }

    let notFoundInfo = await notFound();
    res.writeHead(notFoundInfo[0], {
        'content-type': notFoundInfo[1]
    });
    res.end(notFoundInfo[2]);
});

async function htmlInfo(file) {
    if(file === "/") {
        file = "/index";
    }

    try {
        let data = await fs.readFile(`../pages${file}.html`, {encoding: 'utf8'});
        return [200, 'text/html', data];
    } catch (err) {
        if(err.code === "ENOENT") {
            try {
                let notFound = await fs.readFile("../pages/404.html", {encoding: 'utf8'});
                return [404, 'text/html', notFound];
            }
            catch (err2) {
                console.error(err2);
                return [500, 'text/plain', 'Oh no'];
            }
        } else {
            console.error(err);
            return [500, 'text/plain', 'Oh no'];
        }
    };
};

async function styleInfo(file) {
    try {
        let styleData = await fs.readFile(`..${file}`, {encoding: 'utf8'});
        return [200, 'text/css', styleData];
    } catch (err) {
        if (err.code === "ENOENT") {
            return [404, "text/plain", "Not Found"];
        }
        console.error(err);
        return [500, "text/plain", 'Oh no'];
    };
};

async function imageInfo(file) {
    try {
        let imageData = await fs.readFile(`..${file}`);
        if(/svg$/ !== null) {
            return [200, 'image/svg+xml', imageData];
        } else {
            return [200, 'image/png', imageData];
        }

    } catch (err) {
        if (err.code === "ENOENT") {
            return [404, "text/plain", "Not Found"];
        }
        console.error(err);
        return [500, "text/plain", 'Oh no'];
    };
};

async function notFound() {
    try {
        let errorData = await fs.readFile("../pages/404.html");
        return [404, 'text/html', errorData];
    } catch (err) {
        console.error(err);
        return[500, 'text/plain', 'Oh no'];
    }
}


server.listen(8000);