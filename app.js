const express = require('express')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const datapath = path.join(__dirname, 'todoApplication.db')
let db = null
app.use(express.json())
const initialization = async () => {
  try {
    db = await open({
      filename: datapath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('success')
    })
  } catch (e) {
    console.log(`${e.message}`)
    process.exit(1)
  }
}
initialization()
const b = requestquery => {
  return (
    requestquery.priority !== undefined && requestquery.status !== undefined
  )
}
const c = requestquery => {
  return requestquery.priority !== undefined
}
const d = requestquery => {
  return requestquery.status !== undefined
}
app.get('/todos/', async (request, response) => {
  let data = null
  let get_data = ''
  const {search_q = '', priority, status} = request.query
  switch (true) {
    case b(request.query):
      get_data = `SELECT *
                   FROM todo
                   WHERE todo LIKE "%${search_q}%" AND 
                   priority ="${priority}" AND status="${status}";`
      break
    case c(request.query):
      get_data = `SELECT *
                  FROM todo
                  WHERE todo LIKE "%${search_q}%" AND priority="${priority}";`
      break
    case d(request.query):
      get_data = `SELECT *
                    FROM todo
                    WHERE todo LIKE "%${search_q}%" AND status="${status}";`
      break
    default:
      get_data = `SELECT *
                  FROM todo
                  WHERE todo LIKE "%${search_q}%;"`
  }
  data = await db.all(get_data)
  response.send(data)
})
app.get('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const c = `SELECT *
          FROM todo
          WHERE id=${todoId};`
  const d = await db.get(c)
  response.send(d)
})
app.post('/todos/', async (request, response) => {
  const p = request.body
  const {id, todo, priority, status} = p
  const e = `INSERT INTO todo (id,todo,priority,status)
           VALUES (${id},"${todo}","${priority}","${status}";`
  const f = await db.run(e)
  response.send('Todo Successfully Added')
})
app.put('/todos/:todoId/', async (request, response) => {
  let updated_value = ''
  const {todoId} = request.params
  const f = request.body
  switch (true) {
    case f.status !== undefined:
      updated_value = 'Status'
      break
    case f.priority !== undefined:
      updated_value = 'Priority'
      break
    case f.todo !== undefined:
      updated_value = 'Todo'
  }
  const j = `SELECT *
           FROM todo
           WHERE id=${todoId};`
  const k = await db.get(j)
  const {todo = k.todo, priority = k.priority, status = k.status} = request.body
  const y = `UPDATE todo
           SET 
           todo="${todo}",
           priority="${priority}",
           status="${status}"
           WHERE id=${todoId};
           `
  const x = await db.run(y)
  response.send(`${updated_value} Updated `)
})
app.delete('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const a = `DELETE FROM todo
           WHERE id=${todoId};
           `
  const b = await db.run(a)
  response.send('Todo Deleted')
})
module.exports = app
