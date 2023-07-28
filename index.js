const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require(`${__dirname}/modules/replaceTemplate`);

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log({ textIn });

// const textOut = `This is what we know about the avocado : ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);

// fs.writeFile("./txt/test.txt", "Testing Something", (err, data) => {
//   console.log({ data,err });
// });

//replace template card

// Read Data
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

//Read Template
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const server = http.createServer((req, res) => {
  const { query, pathname: path } = url.parse(req.url, true);
  const URLPATH = new URL(req.url, "http://localhost:3000/");

  // Overview Page
  if (path === "/" || path === "/overview") {
    const cardHtml = dataObj
      .map((product) => replaceTemplate(templateCard, product))
      .join("\n");

    const finalOutput = templateOverview.replace(
      /{%PRODUCT_CARDS%}/g,
      cardHtml
    );

    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(finalOutput);
  }
  // Product Page
  else if (path === "/product") {
    const product = dataObj[query.id];

    if (product) {
      res.end(replaceTemplate(templateProduct, product));
    } else {
      res.end("Product not found");
    }
  }
  // API
  else if (path === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  }
  // Not Found
  else {
    res.writeHead(400, {
      "Content-type": "text/html",
      "my-custom-header": "My Custom Header",
    });
    res.end("<h1>Page Not Found</h1>");
  }
});

server.listen(3000, () => {
  console.log("Starting server on port 3000");
});
