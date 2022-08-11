var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getData', (req,res)=>{
  res.json({
    message: 'data ini sudah tersedia'
  })
})

module.exports = router;
