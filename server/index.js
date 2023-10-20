const express = require('express')
const cors = require('cors')
const md5 = require('md5');
const pool = require('./db')

const app = express()


//Middleware
app.use(cors())
app.use(express.json())


// Routes

app.post('/signup', async (req, res) => {
    try {
        const { name, email, mobile_no } = req.body
        const password = md5(req.body.password)
        const newUser = await pool.query('INSERT INTO "user" (name, email, password, mobile_no) VALUES($1, $2, $3, $4) RETURNING *',
            [name, email, password, mobile_no]
        )
        res.json(newUser.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email } = req.body
        const password = md5(req.body.password)
        const user = await pool.query('SELECT * FROM "user" WHERE email = $1',
            [email]
        )
        const newUser = user ? user.rows[0] : ""
        if (newUser.password === password) {
            res.json({ "login": true, "user": newUser.email })
        } else {
            res.json({ "login": false, "user": newUser.email })
        }
    } catch (err) {
        console.error(err.message)
    }
})


app.post('/donor', async (req, res) => {
    try {
        const { donor_name, mobile_no, blood_group, previous_donation_date, address } = req.body
        const newDonor = await pool.query('INSERT INTO "donor" (donor_name, mobile_no, blood_group, previous_donation_date, address) VALUES($1, $2, $3, $4, $5) RETURNING *',
            [donor_name, mobile_no, blood_group, previous_donation_date, address]
        )
        res.json(newDonor.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

app.put('/donor/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { donor_name, mobile_no, blood_group, previous_donation_date, address } = req.body
        const newDonor = await pool.query('UPDATE "donor" SET donor_name = $1, mobile_no = $2, blood_group = $3, previous_donation_date = $4, address = $5 WHERE id = $6',
            [donor_name, mobile_no, blood_group, previous_donation_date, address, id]
        )
        res.json({ message: 'Donor record updated successfully' });
    } catch (err) {
        console.error(err.message)
    }
})

app.delete('/donor/:id', async (req, res) => {
    try {
        const { id } = req.params
        const newDonor = await pool.query('DELETE FROM "donor" WHERE id = $1',
            [id]
        )
        res.json({ message: 'Donor record deleted successfully' });
    } catch (err) {
        console.error(err.message)
    }
})


app.get('/donor', async (req, res) => {
    try {
        const user = await pool.query('SELECT * FROM "donor"')
        res.json(user.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})


app.get('/donor/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await pool.query('SELECT * FROM "donor" WHERE id = $1', [id])
        res.json(user.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

app.get('/count', async (req, res) => {
    try {
        const count = await pool.query('SELECT COUNT(id) FROM "donor"')
        res.json(count.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})


app.listen(5000, () => {
    console.log("Server running at port 5000.")
})
