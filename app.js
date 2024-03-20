const express    = require('express')
const app        = express()
const exphbs     = require('express-handlebars')
const path       = require('path')
const db         = require('./db/connection')
const bodyparser = require('body-parser')
const Job        = require('./models/Job')
const Sequelize  = require('sequelize')
const Op         = Sequelize.Op


const PORT = 3000



app.listen(PORT, function() {
    console.log(PORT)
})

// body parser
app.use(bodyparser.urlencoded({extended: false}))

// handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// static folder
app.use(express.static(path.join(__dirname, 'public')))



// db connection
db
    .authenticate()
    .then(() =>{
        console.log('conectado à db')
    })
    .catch(err => {
        console.log(err)
    })

// routes
app.get('/', (req, res) => {

    let search = req.query.job
    let query = '%'+search+'%' // PH -> PHP OU WORD => WORDPRESS OU PRESS -> WORDPRESS

    // Job.destroy({
    //     where: {id: {[Op.like]: 1}},
    // })

    if(!search) {
        Job.findAll({order: [
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {
            res.render('index', {
                jobs
            });
        })
        .catch(err => {console.log(err)})
    } else {
        Job.findAll({
            where: {title: {[Op.like]: query}},
            order: [
                ['createdAt', 'DESC']
        ]})
        .then(jobs => {
            console.log(query)
            res.render('index', {
                jobs, query
            });
        })
        .catch(err => {console.log(err)})
    }
});

// jobs routes
app.use('/jobs', require('./routes/jobs'))