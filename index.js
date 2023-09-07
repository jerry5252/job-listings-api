const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const Joi = require('joi');
const JobListing= require("./model/job.model")(mongoose)
const PORT = process.env.PORT || 4000;
const DATABASE_URL = process.env.DATABASE_URL;


// Connect to MongoDB
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

// Create a job listing schema
// const jobSchema = new mongoose.Schema({
//   company: { type: String, required: true },
//   logo: { type: String, required: true },
//   new: { type: Boolean, required: true },
//   featured: { type: Boolean, required: true },
//   position: { type: String, required: true },
//   role: { type: String, required: true },
//   level: { type: String, required: true },
//   postedAt: { type: String, required: true },
//   contract: { type: String, required: true },
//   location: { type: String, required: true },
//   languages: { type: [String], required: true },
//   tools: { type: [String], required: true }
// });

// // Create a job listing model
// const JobListing = mongoose.model('Jobs', JobSchema);

// Create the Express app
const app = express();
app.use(express.json());

// Validation schema for creating job listings
const jobValidationSchema = Joi.object({
  company: Joi.string().required(),
  logo: Joi.string().required(),
  new: Joi.boolean().required(),
  featured: Joi.boolean().required(),
  position: Joi.string().required(),
  role: Joi.string().required(),
  level: Joi.string().required(),
  postedAt: Joi.string().required(),
  contract: Joi.string().required(),
  location: Joi.string().required(),
  languages: Joi.array().items(Joi.string()).required(),
  tools: Joi.array().items(Joi.string()).required()
});

// Validation schema for updating job listings
  const jobUpdateValidationSchema = Joi.object({
  company: Joi.string(),
  logo: Joi.string(),
  new: Joi.boolean(),
  featured: Joi.boolean(),
  position: Joi.string(),
  role: Joi.string(),
  level: Joi.string(),
  postedAt: Joi.string(),
  contract: Joi.string(),
  location: Joi.string(),
  languages: Joi.array().items(Joi.string()),
  tools: Joi.array().items(Joi.string())
});

// Create a job listing
app.post('/jobs', (req, res) => {
  const { error } = jobValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const jobListing = new JobListing(req.body);
  jobListing.save()
    .then(() => res.sendStatus(201))
    .catch(error => res.status(500).send(error.message));
});

// Get a single job listing
app.get('/jobs/:id', (req, res) => {
  JobListing.findById(req.params.id)
    .then((job) => res.json(job))
    .catch(error => res.sendStatus(500).send(error.message));
});

// Get job listings with pagination, sorting, and filtering
app.get('/jobs', (req, res) => {
  const { page = 1, limit = 10, sort, filter } = req.query;
  const skip = (page - 1) * limit;
  const sortOptions = sort ? { [sort]: 1 } : {};

  const filterOptions = filter ? {
    $or: [
      { company: { $regex: filter, $options: 'i' } },
      { position: { $regex: filter, $options: 'i' } },
      { role: { $regex: filter, $options: 'i' } },
      { level: { $regex: filter, $options: 'i' } },
      { contract: { $regex: filter, $options: 'i' } },
      { location: { $regex: filter, $options: 'i' } },
      { languages: { $regex: filter, $options: 'i' } },
      { tools: { $regex: filter, $options: 'i' } }
    ]
  } : {};

  JobListing.find(filterOptions)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .then(jobListings => res.json(jobListings))
    .catch(error => res.status(500).send(error.message));
});

// Update a job listing
app.put('/jobs/:id', (req, res) => {
  const { error } = jobUpdateValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  JobListing.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.sendStatus(200))
    .catch(error => res.status(500).send(error.message));
});

// Delete a job listing
app.delete('/jobs/:id', (req, res) => {
  JobListing.findByIdAndRemove(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(error => res.status(500).send(error.message));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
