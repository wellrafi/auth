const express = require('express'),
      app = express(),
      cors = require('cors'),
      morgan = require('morgan'),
      fs = require('fs'),
      path = require('path');

let v1Route = require('./v1/router/route')



// untuk parsing content type x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// untuk parsing content type json
app.use(express.json());


// enable cors
app.use(cors());

// logger pake morgan
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))
app.use(morgan('dev'));

// static directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1', v1Route);

app.use(function(req, res) {
  return res.status(404).json({
    message: "Not Found",
    success: 0
  })
})

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app


