const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key";

exports.signup = async (req, res) => {

  const { role, name, email, password, skills, resume_url, company_name, company_website, role_title } = req.body;

  try {

    const userCheck = await userModel.findUserByEmail(email);

    if (userCheck.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await userModel.createUser(
      name,
      email,
      hashedPassword,
      role
    );

    if (role === "seeker") {

      await userModel.createSeekerProfile(
        userId,
        skills || "",
        resume_url || ""
      );

    } else {

      await userModel.createRecruiterProfile(
        userId,
        company_name || "",
        company_website || "",
        role_title || ""
      );

    }

    const token = jwt.sign(
      { id: userId, role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user: { id: userId, name, email, role }
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Server error" });

  }
};



exports.login = async (req, res) => {

  const { email, password } = req.body;

  try {

    const result = await userModel.findUserByEmail(email);

    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }
};