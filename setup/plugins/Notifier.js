const notifier = require('node-notifier');

class Notifier {
    apply(compiler) {
        compiler.plugin('done' , this.notification)
    }


    notification(stats) {
        const time = ((stats.endTime - stats.startTime) / 1000).toFixed(2)
        notifier.notify({
            title : 'My notification',
            message: `Webpack is done!\n${stats.compilation.errors.length} errors in ${time}s`,
        });
    }
}

module.exports = Notifier;