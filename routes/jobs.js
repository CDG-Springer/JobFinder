const express = require('express')
const router = express.Router()
const Job = require('../models/Job')

router.get('/test', (req, res) => {
    res.send('deu certo')
})

// detalhe da vaga -> view/1 ou view/2
router.get('/view/:id', (req, res) => Job.findOne({
        where: {id: req.params.id}
}).then(job => {

    res.render('view', {
        job
    })

}).catch( err => console.log(err))
)

// form da rota de envio

router.get('/add', (req, res) => {
    res.render('add')
})

// Adicionar trabalho via POST
router.post('/add', (req, res) => {
    const { title, salary, company, description, email, new_job } = req.body

    // Inserir novo trabalho
    Job.create({
        title,
        salary,
        company,
        description,
        email,
        new_job
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log('Erro ao adicionar trabalho: ' + err))
})

module.exports = router
