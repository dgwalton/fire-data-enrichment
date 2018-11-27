var express = require('express');
var router = express.Router();
var fs = require('fs');
var utils = require('../utilities');


router.get('/', async function(req, res, next) {
  const rawContent = fs.readFileSync("./data/data.json");
  const incidentJson = JSON.parse(rawContent);
  const enrichedData = await utils.enrich(incidentJson);
  res.set('Content-Type', 'application/json');
  res.set('Content-Disposition', 'inline');
  res.send(enrichedData);
});

module.exports = router;
