const {Parser} = require("acorn")
const walk = require("acorn-walk")

exports.getFunctions = (code) => {
    const functions = []
    const tree = Parser.parse(code)
    walk.simple(tree, {
        FunctionDeclaration(node) {
            functions.push('function ' + code.substring(node.id.start, node.end))
        },
        ArrowFunctionExpression(node) {
            functions.push('const arrow = ' + code.substring(node.start, node.end))
        }
    })
    return functions
}