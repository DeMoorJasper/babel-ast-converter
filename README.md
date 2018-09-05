[![npm version](https://badge.fury.io/js/babel-ast-converter.svg)](https://badge.fury.io/js/babel-ast-converter)

# Babel AST converter

Converts between Babel 6 and 7 ASTs

## Usage

### Parser options

Set the parserOpts `tokens` to `true` for Babel 7, as this has become optional in Babel 7

Example:

```Javascript
let options = {
  parserOpts: {
    filename: 'index.js',
    tokens: true
  }
}
```

### Using Babel AST converter

This library exports a function that takes in 2 arguments, the `ast` and the `babelVersion` of the AST.

The function will convert the AST to the other version, so 6 => 7 and 7 => 6.

`babelConvert(babel6AST, 6)` => Babel 7 AST

`babelConvert(babel7AST, 7)` => Babel 6 AST

This is necessary due to Babel not really keeping a version number in their AST.
