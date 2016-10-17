var express = require('express');
var angular_ui_router = require('angular-ui-router');
var app = express();

app.use(express.static('public'));

app.listen(5000);
