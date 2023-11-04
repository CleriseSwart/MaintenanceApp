// controllers/jobController.js
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// Create a new job
router.post('/jobs', async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List all jobs ordered by status and date submitted
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ status: 1, dateSubmitted: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update information about a single job
router.put('/jobs/single/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(job);
  } catch (err) {
    res.status(404).json({ error: 'Job not found' });
  }
});

// Route for batch updating jobs
router.put('/jobs/batch-update', async (req, res) => {
  const { jobIds, status } = req.body;

  try {
    // Update the selected jobs with the new status
    await Job.updateMany({ _id: { $in: jobIds } }, { status });

    res.json({ message: 'Batch update successful' });
  } catch (error) {
    console.error('Batch update error:', error);
    res.status(500).json({ message: 'Batch update failed' });
  }
});

// Archive a specific job
router.put('/jobs/archive/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { archived: true });
    res.status(200).json({ message: 'Job archived successfully' });
  } catch (err) {
    res.status(404).json({ error: 'Job not found' });
  }
});

// Filter jobs by status
router.get('/jobs/status/:status', async (req, res) => {
  const { status } = req.params;
  try {
    const jobs = await Job.find({ status });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
