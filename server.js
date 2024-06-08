import pg from "pg"
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src', 'pages'))
app.use(express.static(path.join(__dirname, 'src')))

app.use(cors())

const { Client } = pg;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '14881488',
  port: 5432,
})

app.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM news')
    const news = result.rows

    res.render('index', { news })
  } catch (err) {
    console.error('Database connection error', err.stack)
  }
})

app.get('/playbills', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM playbill')
    const playbills = result.rows

    res.render('playbills', { playbills })
  } catch (err) {
    console.error('Database connection error', err.stack)
  }
})

app.get('/timetable', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM time')
    const time = result.rows

    res.render('timetable', { time })
  } catch (err) {
    console.error('Database connection error', err.stack)
  }
})

app.get('/new/:id', async (req, res) => {
  const id = req.params.id
  try {
    const result = await client.query(`SELECT * FROM news WHERE id = $1`, [id]);
    const newsItems = result.rows;

    res.render('new', { newsItems });
  } catch (err) {
    console.error('Database connection error', err.stack)
  }
})

app.get('/playbill/:id', async (req, res) => {
  const id = req.params.id
  try {
    const result = await client.query(`SELECT * FROM playbill WHERE id = $1`, [id]);
    const playbillItems = result.rows;

    res.render('playbill', { playbillItems });
  } catch (err) {
    console.error('Database connection error', err.stack)
  }
})

app.listen(3000, async () => {
  try {
    await client.connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to database:', error.stack);
    await client.end();
    process.exit(1);
  }
})