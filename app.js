const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const port = 4000
//set template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb://localhost:27017/todo", { useNewUrlParser: true, useUnifiedTopology: true })


const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})


//導入mongoDB
const Todo = require('./models/todo')

app.get('/', (req, res) => {
  Todo.find()
    .lean()
    .exec((err, todos) => { // 把 Todo model 所有的資料都抓回來
      if (err) return console.error(err)
      return res.render('index', { todos: todos }) // 將資料傳給 index 樣板
    })
})



//設定首頁
app.get('/', (req, res) => {
  return res.render('index')
})

//總覽全部todo list
app.get('/todos', (req, res) => {
  return res.redirect('/')
})

//開起新增頁面
app.get('/todos/new', (req, res) => {
  return res.render('new')
})

//新增一筆 Todo
app.post('/todos', (req, res) => {
  const todo = new Todo({ name: req.body.name })
  todo.save((err) => {
    console.log(err)
    if (err) return console.log(err)
    return res.redirect('/')
  })
})

//routes end

app.listen(4000, () => {
  console.log(`App is running on localhost:${port}`)
})