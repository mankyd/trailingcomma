exports.rawBodyParser = function (options){
    return function bodyParser(req, res, next) {
        if (req.raw_body) return next();
        req.raw_body = '';

        if ('GET' == req.method || 'HEAD' == req.method){
            return next();
        }

        var buf = '';
        //req.setEncoding('utf8');
        req.on('data', function(chunk){ buf += chunk; });
        req.on('end', function(){
            try {
                req.raw_body = buf;
                //next();
            } catch (err){
                next(err);
            }
        });

        return next();
    };
};
