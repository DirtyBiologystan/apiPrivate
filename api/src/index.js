const http = require("http");
const fs = require("fs/promises");
const models = require("./services/models");
const mongoose = require("./services/mongoose");

const init = async () => {
  const mongooseInstance = await mongoose();

  const modelsFile = await fs.readdir(`${__dirname}/models`);
  let modelsArray = await modelsFile.map((modelPath) => {
    model = require(`${__dirname}/models/${modelPath}`);
    return model(mongooseInstance);
  });

  modelsArray = modelsArray.reduce(async (pAccu, pModel) => {
    const model = await pModel;
    const accu = await pAccu;
    accu[model.modelName] = model;
    return accu;
  }, {});
  Object.assign(models, await modelsArray);

  const routesFile = await fs.readdir(`${__dirname}/routes`);
  let routes = routesFile.reduce((accu, routePath) => {
    const route = require(`${__dirname}/routes/${routePath}`);
    if (!accu[route.method]) {
      accu[route.method] = [];
    }
    accu[route.method].push(route);
    return accu;
  }, {});

  const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    if (!routes[req.method]) {
      res.statusCode = 404;
      res.end();
      return;
    }
    const urlSplit = req.url.split("?");

    await Promise.all(
      routes[req.method].map(async (route) => {
        const dataInUrl = route.regex.exec(urlSplit[0]);

        if (dataInUrl) {
          let params = {};
          if (urlSplit[1]) {
            params = Object.fromEntries(new URLSearchParams(urlSplit[1]));
          }
          try {
            console.log(`${req.method} ${req.url} ${req.headers["referer"]}`);
            if (req.method === "GET") {
              if (route.schema) {
                const { error, value } = route.schema.validate(params);
                if (error) {
                  res.statusCode = 400;
                  const errors = error.details.map(
                    (errorDetail) => errorDetail.message
                  );
                  res.end(JSON.stringify({ errors: errors }));
                  resolve();
                  return;
                }
                console.log(value);
                params = value;
              }
              res.end(
                route.returnString
                  ? await route.handler(dataInUrl, params)
                  : JSON.stringify(await route.handler(dataInUrl, params))
              );
            } else {
              await new Promise((resolve, reject) => {
                let rawData = "";
                req.on("data", (chunk) => {
                  rawData += chunk;
                });
                req.on("end", async () => {
                  let data;
                  try {
                    data = JSON.parse(rawData);
                  } catch (e) {
                    console.log();
                    res.statusCode = 400;
                    res.end(JSON.stringify({ errors: e.message }));
                    resolve();
                    return;
                  }
                  const { error, value } = route.schema.validate(data);
                  if (error) {
                    res.statusCode = 400;
                    const errors = error.details.map(
                      (errorDetail) => errorDetail.message
                    );
                    res.end(JSON.stringify({ errors: errors }));
                    resolve();
                    return;
                  }
                  try {
                    res.end(await route.handler(dataInUrl, value));
                  } catch (e) {
                    console.error(e);
                    res.statusCode = 500;
                    res.end();
                    resolve();
                  }
                });
              });
            }
          } catch (e) {
            if(e.message==="not found"){
              res.statusCode = 404;
              res.end();
            }else{
              console.error(e);
              res.statusCode = 500;
              res.end();
            }

          }
        }
      })
    );
    if (!res.writableEnded) {
      res.statusCode = 404;
      res.end();
    }
  });

  server.listen(8000);
};
init();
