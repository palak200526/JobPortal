const pool = require("../config/db");

exports.uploadResume = async (req, res) => {

  try {

    const userId = req.body.user_id;
    const resumePath = req.file.filename;

    await pool.query(
      "UPDATE seeker_profiles SET resume_url = ? WHERE user_id = ?",
      [resumePath, userId]
    );

    res.json({
      message: "Resume uploaded successfully",
      file: resumePath
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Upload failed" });

  }

};