const fs = require('fs');
const path = require('path');

class Manifest {
    apply(compiler) {
        compiler.plugin('emit' , (compilation , callback) => {
            let manifest = JSON.stringify(compilation.getStats().toJson().assetsByChunkName);

            compilation.assets['manifest.json'] = {
                source : () => manifest,
                size : () => manifest.length
            }

            callback()
        })
    }
}

module.exports = Manifest;