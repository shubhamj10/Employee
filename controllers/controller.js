const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

const employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    location: String,
    phone: Number,
    title: String,
    address: String,
    age: Number,
    gender: String,
    salary: Number
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = (app) => { 
    app.get('/employee/:id', async (req, res) => {
        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) {
                return res.status(404).send('Employee not found');
            }
            res.render('employee', { employee: employee });
        } catch (err) {
            console.error('Error fetching employee:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    app.get('/favicon.ico', (req, res) => {
        res.status(204);
    });

    app.get('/', async (req, res) => {
        try {
            const employees = await Employee.find();
            res.render('index', { employee: employees });
        } catch (err) {
            console.error('Error fetching employees:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    app.post('/', urlencodedParser, async (req, res) => {
        try {
            await Employee.create(req.body);
            res.redirect('/');
        } catch (err) {
            console.error('Error adding employee:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    app.get('/:_id', async (req, res) => {
        try {
            const employee = await Employee.findById(req.params._id);
            res.render('employee', { employee: employee });
        } catch (err) {
            console.error('Error fetching employee:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    app.delete('/:_id', async (req, res) => {
        try {
            await Employee.findByIdAndDelete(req.params._id);
            res.json({ message: 'Employee deleted successfully' });
        } catch (err) {
            console.error('Error deleting employee:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    app.post('/:_id', urlencodedParser, async (req, res) => {
        try {
            const id = req.params._id;
            await Employee.findByIdAndUpdate(id, req.body);
            res.redirect('back');
        } catch (err) {
            console.error('Error updating employee:', err);
            res.status(500).send('Internal Server Error');
        }
    });
};


