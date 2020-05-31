const fs = require("fs");
const path = require("path");
const {parse} = require('@babel/parser');
const {default: traverse} = require("@babel/traverse");
const {transformSync} = require("@babel/core");

function describe(absolutePath) {
    const sourceCode = fs.readFileSync(absolutePath, "utf-8");
    const ast = parse(sourceCode, {
        sourceType: 'module',
    });
    let dependencies = [];
    traverse(ast, {
        ImportDeclaration({node}) {
            dependencies.push(node.source.value)
        }
    });
    return {
        dependencies: dependencies,
        sourceCode: transformSourceCode(sourceCode),
    }
}

function transformSourceCode(rawSource) {
    let {code} = transformSync(rawSource, {
        presets: ['@babel/preset-env']
    });
    return code;
}

function resolveModules(identifier, rootAbsolutePath) {
    let {dependencies, sourceCode} = describe(rootAbsolutePath);
    let modules = `['${identifier}'] : function(require,exports){ ${sourceCode} },`;
    dependencies.forEach((dependency) => {
        modules += resolveModules(dependency, path.resolve(path.dirname(rootAbsolutePath), dependency))
    });
    return modules;
}

function bundle(entryPoint) {
    let modules = `{${resolveModules(entryPoint, path.resolve(__dirname, entryPoint))}}`;
    return `
      (function(){
    let modules = ${modules};
    let cache = {};
    function require(module){
        let exports = {};
        if(!cache[module]){
            modules[module](require,exports)
            cache[module]=exports;
            return exports;
        }else{
            return cache[module];
        }
    }

    (modules['${entryPoint}'])(require,{})
})()     
    `
}

let entryFile = "../webapp/main.js";

fs.writeFileSync(path.join(__dirname, "./output.js"), bundle(entryFile));


