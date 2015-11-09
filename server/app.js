/*jshint camelcase: false */
'use strict';

var path = require('path'),
    express = require('express'),
    app = module.exports = express();

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'public', 'tpl'));
app.engine('.tpl', require('ejs').__express);
app.set('view engine', 'tpl');
app.use(express.static(path.join(__dirname, 'public')));
//…Ë÷√øÁ”Ú∑√Œ 
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

function renderTpl(req, res, appConfig) {
    res.render('index', {
    });
}

app.get('/', function (req, res) {
        renderTpl(req, res);
    }
);

app.get('/index', function (req, res) {
        renderTpl(req, res);
    }
);

app.get('*', function (req, res) {
    res.sendStatus(404);
});

if (require.main === module) {
    //cluster
    app.listen(app.get('port'), function () {
        console.log('[%s] Express server listening on port %d',
            app.get('env').toUpperCase(), app.get('port'));
    });
}