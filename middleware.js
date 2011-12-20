exports.rawBodyParser = function (options){
    return function bodyParser(req, res, next) {
        if (req.body) return next();
        req.body = {};

        if ('GET' == req.method || 'HEAD' == req.method){
            return next();
        }

        var buf = '';
        req.setEncoding('utf8');
        req.on('data', function(chunk){ buf += chunk });
        req.on('end', function(){
            try {
                req.raw_body = buf;
                next();
            } catch (err){
                next(err);
            }
        });
    };
};
