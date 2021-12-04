const { getFunctions } = require('./src/getFunctions')
const { walkDir } = require('./src/walkDir')
const fs = require('fs').promises
const async = require('async')


const dir = process.argv[2]
const resultName = process.argv[3] || 'functions'
const filesLimit = process.argv[4] || 5000
if (!dir) {
    console.log('Missing directory argument')
    return
}

walkDir(dir, (err, results) => {
    if (err) {
        return console.log(err)
    }
    const functions = []
    async.mapLimit(results.slice(0, filesLimit), 6000, async (filename) => {
        if (filename.split('.').pop() === 'js') {
            return fs.readFile(filename, 'utf8')
                .then((content) => {
                    try {
                        const newFunctions = getFunctions(content)
                        console.log(`Found ${newFunctions.length} functions at file ${filename}`)
                        functions.push(...newFunctions)
                    } catch (error) {
                        console.log(`Error parsing file ${filename}`)
                    }
                }).catch(console.log)
        }
    }, () => {
        console.log('Grabando...')
        fs.writeFile(`${resultName}.json`, JSON.stringify({ functions }, null, 2))
    })
})
