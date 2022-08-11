var express = require('express');
var router = express.Router();
// const { QueryTypes } = require('sequelize');
const Validator = require('fastest-validator')
// const Sequelize = require('sequelize');

const { Product,db, sequelize } = require('../models')
// let sequelize;
const v = new Validator()

// router.get('/', async (req, res)=>{
//     const product = await Product.findAll()
//     return res.json(product)
// })

router.get('/:id', async (req, res)=>{
    const id = req.params.id;
    //ORM BUILDER
    // const product = await Product.findAll({
    //     where:{
    //         id: id
    //     }
    // })

    //raw query
   let product = await sequelize.query('SELECT * from products where id=(:id)', {
        replacements: {id: req.params.id},
        type: sequelize.QueryTypes.SELECT
      });
      console.log(product)
      return;
    // if (!product) return res.json({message: 'data is not found'})
    // return res.json(product)
})

router.post('/', async (req,res) => {
    const schema ={
        name: 'string',
        brand: 'string',// short-hand def  
        description: 'string|optional'
    }
    // return console.log(req.body) 
    
    const validate = v.validate(req.body, schema)

    if(validate.length){
        return res.status(400).json(validate)
    }
   
    
    const product = await Product.create(req.body)
    
    res.status(200).json(product)
})


router.put('/:id', async (req, res) => {
    const id = req.params.id;

    let product = await Product.findByPk(id);

    if(!product) return res.json({ message: 'product not found'})
    
    const schema ={
        name: 'string|optional',
        brand: 'string|optional',// short-hand def  
        description: 'string|optional'
    }

    const validate = v.validate(req.body, schema)

    if(validate.length){
        return res.status(400).json(validate)
    }

    product = await product.update(req.body)
    
    res.send(product)
})

router.delete('/:id', async (req, res)=>{
    const id = req.params.id;
    const product = await Product.findByPk(id)

    if (!product) return res.json({message: 'Product is not found'})
    
    await product.destroy()

    res.json({ message: 'Product has been deleted'})
    // return res.json(product)
})
module.exports = router;