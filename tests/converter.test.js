const fs = require("fs");
const path = require("path");
const BabelASTConvertor = require("../src/converter");
const traverse = require("@babel/traverse").default;
const babelCore = require("@babel/core");
const babelPresetFlow = require("@babel/preset-flow");
const babelPresetEnv = require("@babel/preset-env");

const code = fs.readFileSync(path.join(__dirname, "./code.js"), "utf8");

function createBabel7AST() {
  const options = {
    parserOpts: {
      allowReturnOutsideFunction: true,
      allowHashBang: true,
      ecmaVersion: Infinity,
      strictMode: false,
      sourceType: "module",
      locations: true,
      tokens: true
    },
    presets: [babelPresetFlow, babelPresetEnv]
  };

  return babelCore.parse(code, options);
}

test("Convert babel 7 to babel 6", async function() {
  let ast = createBabel7AST();

  ast = BabelASTConvertor(ast, 7);

  let elementCount = {};
  traverse(ast, {
    enter(path) {
      if (!elementCount[path.node.type]) {
        elementCount[path.node.type] = 0;
      }
      elementCount[path.node.type]++;

      if (path.node.variance) {
        expect(path.node.variance.kind).toBeFalsy();
      }

      if (path.node.type === "ForAwaitStatement") {
        expect(path.node.await).toBeFalsy();
      }

      if (path.node.type === "ArrowFunctionExpression") {
        expect(path.node.expression !== undefined).toBeTruthy();
      }
    }
  });

  // Check Renaming/Removal of Nodes
  expect(elementCount["ExistsTypeAnnotation"]).toBe(undefined);
  expect(elementCount["ExistentialTypeParam"]).toBe(1);

  expect(elementCount["NumberLiteralTypeAnnotation"]).toBe(undefined);
  expect(elementCount["NumericLiteralTypeAnnotation"]).toBe(1);

  expect(elementCount["ForOfStatement"]).toBe(undefined);
  expect(elementCount["ForAwaitStatement"]).toBe(1);

  expect(elementCount["SpreadElement"]).toBe(undefined);
  expect(elementCount["SpreadProperty"]).toBe(2);

  expect(elementCount["RestElement"]).toBe(undefined);
  expect(elementCount["RestProperty"]).toBe(2);

  // Check node count
  expect(elementCount["TypeParameter"]).toBe(6);
  expect(elementCount["ArrowFunctionExpression"]).toBe(2);
});

test("Convert babel 6 to babel 7", async function() {
  let ast = BabelASTConvertor(createBabel7AST(), 7);
  ast = BabelASTConvertor(ast, 6);

  let elementCount = {};
  traverse(ast, {
    enter(path) {
      if (!elementCount[path.node.type]) {
        elementCount[path.node.type] = 0;
      }
      elementCount[path.node.type]++;

      if (path.node.variance) {
        expect(path.node.variance.kind).toBeTruthy();
      }

      if (path.node.type === "ForAwaitStatement") {
        expect(path.node.await).toBeTruthy();
      }

      if (path.node.type === "ArrowFunctionExpression") {
        expect(path.node.expression).toBe(undefined);
      }
    }
  });

  // Check Renaming/Removal of Nodes
  expect(elementCount["ExistsTypeAnnotation"]).toBe(1);
  expect(elementCount["ExistentialTypeParam"]).toBe(undefined);

  expect(elementCount["NumberLiteralTypeAnnotation"]).toBe(1);
  expect(elementCount["NumericLiteralTypeAnnotation"]).toBe(undefined);

  expect(elementCount["ForOfStatement"]).toBe(1);
  expect(elementCount["ForAwaitStatement"]).toBe(undefined);

  expect(elementCount["SpreadElement"]).toBe(2);
  expect(elementCount["SpreadProperty"]).toBe(undefined);

  expect(elementCount["RestElement"]).toBe(2);
  expect(elementCount["RestProperty"]).toBe(undefined);

  // Check node count
  expect(elementCount["TypeParameter"]).toBe(6);
  expect(elementCount["ArrowFunctionExpression"]).toBe(2);
});
