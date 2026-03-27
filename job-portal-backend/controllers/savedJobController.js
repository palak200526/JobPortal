const savedJobModel = require("../models/savedJobModel");

exports.saveJob = async (req, res) => {

  try {

    const { seeker_id, job_id } = req.body;

    const result = await savedJobModel.saveJob(seeker_id, job_id);

    res.status(201).json({
      message: "Job saved successfully",
      savedId: result.insertId
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Server error" });

  }

};


exports.getSavedJobs = async (req, res) => {

  try {

    const seekerId = req.params.seekerId;

    const jobs = await savedJobModel.getSavedJobs(seekerId);

    res.json(jobs);

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }

};


exports.deleteSavedJob = async (req, res) => {

  try {

    const id = req.params.id;

    await savedJobModel.deleteSavedJob(id);

    res.json({ message: "Saved job removed" });

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }

};