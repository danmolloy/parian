#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const exec = require("child_process").exec;

const modules = fs.readdirSync("./node_modules"); // TODO: handle missing filepath
const moduleSizes = {};

const recursiveFindFiles = (base, ext, files, result) => {
  files = files || fs.readdirSync(base);
  result = result || [];
  files.forEach(file => {
    const newBase = path.join(base, file);
    if (fs.statSync(newBase).isDirectory()) {
      const newFiles = fs.readdirSync(newBase);
      result = recursiveFindFiles(newBase, ext, newFiles, result);
    } else {
      if (file.endsWith(`.${ext}`)) {
        result.push(newBase);
      }
    }
  });
  return result;
};

const countLines = async filePath => {
  const foo = await exec(`wc -l < ${filePath}`);
  console.log(foo);
};

for (const module of modules) {
  try {
    const jsFiles = recursiveFindFiles(`./node_modules/${module}`, "js");
    const tsFiles = recursiveFindFiles(`./node_modules/${module}`, "ts");
    countLines(jsFiles[0]);
    // console.log(countLines(jsFiles[0]));
    // console.log(jsFiles);
    moduleSizes[module] = { js: jsFiles.length, ts: tsFiles.length };
    // const packageFile = fs.readFileSync(
    //   `./node_modules/${module}/package.json`
    // );
    // const package = JSON.parse(packageFile);

    // const mainPath = package.main || "index.js";
    // const mainFile = fs.readFileSync(`./node_modules/${module}/${mainPath}`);
    // const fileString = mainFile.toString();
    // const lines = fileString.split("\n");
    // console.log(`${module} - ${lines.length}`);
  } catch (error) {
    // console.log(`ERROR reading module: ${module}`);
    // console.log(error);
  }
}

// console.log(moduleSizes);
