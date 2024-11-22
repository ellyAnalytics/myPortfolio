const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000; // Use the PORT from the environment variable or fallback to 3000 for local dev

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data
app.use(bodyParser.json()); // Parse JSON data

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Explicitly map "/" to "index.html" inside the "public/html" folder
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // This is the SMTP port causing the timeout issue
  secure: false, // SSL/TLS
  auth: {
    user: "elijahmutinda2000@gmail.com", // Replace with your Gmail address
    pass: "ktbvrdjhxjohinkv", // Replace with your Gmail App Password
  },
});

// Email route
app.post("/send-email", (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Validate input
  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Email content
  const mailOptions = {
    from: email,
    to: "elijahmutinda2000@gmail.com",
    subject: `Contact Form: ${subject}`,
    text: `
      You received a new message:
      
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Subject: ${subject}
      Message: ${message}
    `,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Failed to send email" });
    }
    res.status(200).json({ message: "Email sent successfully!" });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
