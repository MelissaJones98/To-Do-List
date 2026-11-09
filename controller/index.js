const formidable = require('formidable');
const { create, get, delId } = require('../model/todo');

// Create: uses create() from todo.js
exports.create = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields) => {
    const { description } = fields;
    // check to see if the description field exists in the form
    // if description doesn't exist, send error
    if (!fields.description) {
      return res.status(400).json({
        error: 'Description is required',
      });
    }
    // if description exists, add to database using create() function
    try {
      const newTask = await create(description);
      return res.status(201).send({ data: newTask.rows[0] });
    } catch (error) {
      // if description cannot be added to database, send error
      console.log(error);
      return res.status(400).json({
        error,
      });
    }
  });
};

// Read: uses get() from todo.js
exports.read = async (req, res) => {
  try {
    const task = await get();
    return res.json({ data: task.rows });
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

// removeTodo: uses remove() from todo.js
exports.removeTodo = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await delId(id);
    return res.status(200).send({ data: id });
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
};
