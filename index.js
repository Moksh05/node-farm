//ROUTING - use express to do this in real world
//but will do here from scratch using module url

const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");

//reading the data
const dataArr = fs.readFileSync("./dev-data/data.json", "utf-8");
const prodData = JSON.parse(dataArr);
const overviewtemp = fs.readFileSync("./templates/overview.html", "utf-8");
const prodtemp = fs.readFileSync("./templates/template-product.html", "utf-8");
const prodCard = fs.readFileSync("./templates/product_card.html", "utf-8");

const filltemplate = (template, product) => {
  let output = template.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%PRODUCT_DESC%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }

  return output;
};

const server = http.createServer((req, res) => {
    const {query,pathname} = url.parse(req.url);
  
  //OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });

    //we are filling the template for every element in the dataArr , also it get filled in the html template
    // now joining those array objects to make a string i.e html file
    const cardHTML = prodData.map((el) => filltemplate(prodCard, el)).join('');
    //lets check the html is updated or not
    //console.log(cardHTML);
    //lastly filling our product_card space with these filled templates

    const output = overviewtemp.replace('{%PRODUCT_CARDS%}',cardHTML);

    res.end(output);
  }
  //API PAGE
  else if (pathname === "/API") {
    //converting json to aray
    
    //sending the json data to show on the site
    res.writeHead(200, { "content-type": "application/json" });

    res.end(dataArr);
  }
  //PRODUCT PAGE
  else if (pathname === "/product") {
    const prodoutput = filltemplate(prodtemp,prodData[query[3]]);
    //res headers are always set before the response
    res.writeHead(200, { "content-type": "text/html" });
    res.end(prodoutput);
  }
  //NOT FOUND
  else {
    //telling the site the response error from the server and the short des of it,
    //in contetn type we specify the type of response that the site can expect from server
    res.writeHead(404, {
      "content-type": "text/html",
    });
    res.end("Page not found");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("server is listening");
});
