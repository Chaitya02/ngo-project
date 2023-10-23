const express = require('express')
const cors = require('cors')
const pool = require('./db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const app = express()


//Middleware
app.use(cors())
app.use(express.json())


// Routes

app.post('/signup', async (req, res) => {
    try {
        const { name, email, mobile_no } = req.body
        bcrypt.hash(req.body.password, 10, async function (err, hash) {
            if (err) {
                res.json({ success: false, error: err.message })
            } else {
                const newUser = await pool.query('INSERT INTO "user" (name, email, password, mobile_no) VALUES($1, $2, $3, $4) RETURNING *',
                    [name, email, hash, mobile_no]
                )
                res.json({ success: true, user: newUser.rows[0] })
            }
        })
    } catch (err) {
        res.json({ success: false, error: err.message })
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await pool.query('SELECT * FROM "user" WHERE email = $1',
            [email]
        )
        const newUser = user.rows[0]
        bcrypt.compare(password, newUser.password).then(function (result) {
            if (result) {
                const token = jwt.sign({ user: { id: user._id } }, process.env.SECRET);
                return res.json({ success: true, authToken: token })
            } else {
                return res.status(400).json({ success: false, error: "Email or Password is incorrect!" })
            }
        });
    } catch (err) {
        res.json({ success: false, error: err.message })
    }
})

app.put('/reset', async (req, res) => {
    try {
        const { email } = req.body
        const user = await pool.query('SELECT * FROM "user" WHERE email = $1',
            [email]
        )
        const newUser = user.rows[0]
        bcrypt.hash(req.body.password, 10, async function (err, hash) {
            if (err) {
                res.json({ success: false, error: err.message })
            } else {
                const userUpdate = await pool.query('UPDATE "user" SET password = $1 WHERE email = $2',
                    [hash, newUser.email]
                )
                res.json({ success: true, message: 'User password updated successfully' })
            }
        })
    } catch (err) {
        res.json({ success: false, error: err.message })
    }
})

app.post('/donor', async (req, res) => {
    try {
        const { donor_name, mobile_no, blood_group, previous_donation_date, address } = req.body
        const newDonor = await pool.query('INSERT INTO "donor" (donor_name, mobile_no, blood_group, previous_donation_date, address) VALUES($1, $2, $3, $4, $5) RETURNING *',
            [donor_name, mobile_no, blood_group, previous_donation_date, address]
        )
        res.json({ success: true, donor: newDonor.rows[0] })
    } catch (err) {
        res.json({ success: false, error: err.message })
    }
})

app.put('/donor/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { donor_name, mobile_no, blood_group, previous_donation_date, address } = req.body
        const newDonor = await pool.query('UPDATE "donor" SET donor_name = $1, mobile_no = $2, blood_group = $3, previous_donation_date = $4, address = $5 WHERE id = $6',
            [donor_name, mobile_no, blood_group, previous_donation_date, address, id]
        )
        res.json({ success: true, message: 'Donor record updated successfully' });
    } catch (err) {
        res.json({ success: false, error: err.message })
    }
})

app.delete('/donor/:id', async (req, res) => {
    try {
        const { id } = req.params
        const newDonor = await pool.query('DELETE FROM "donor" WHERE id = $1',
            [id]
        )
        res.json({ success: true, message: 'Donor record deleted successfully' });
    } catch (err) {
        res.json({ success: false, error: err.message })
    }
})


app.get('/donor', async (req, res) => {
    try {
        const user = await pool.query('SELECT * FROM "donor"')
        res.json({ success: true, donor: user.rows[0] })
    } catch (err) {
        res.json({ success: false, error: err.message })
    }
})


app.get('/donor/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await pool.query('SELECT * FROM "donor" WHERE id = $1', [id])
        res.json({ success: true, donor: user.rows[0] })
    } catch (err) {
        res.json({ success: false, error: err.message })
    }
})

app.get('/count', async (req, res) => {
    try {
        const count = await pool.query('SELECT COUNT(id) FROM "donor"')
        res.json({ success: true, count: count.rows[0] })
    } catch (err) {
        res.json({ success: false, error: err.message })
    }
})


app.listen(5000, () => {
    console.log("Server running at port 5000.")
})
