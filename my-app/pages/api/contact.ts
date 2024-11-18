// src/api/contact.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

interface FormData {
  email: string;
  username: string;
  phonenumber: string;
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, username, phonenumber, message }: FormData = req.body;

    // Create a transporter (using Gmail for example)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    // Path to the EJS template
    const templatePath = path.resolve('templates', 'contact.ejs');

    // Render the EJS template with dynamic data
    ejs.renderFile(templatePath, { email, username, phonenumber, message }, (err, htmlContent) => {
      if (err) {
        console.error('Error rendering EJS template:', err);
        return res.status(500).json({ message: 'Error generating email content' });
      }

      // Create email options
      const mailOptions = {
        from: email, // Sender's email
        to: process.env.EMAIL_USER, // Receiver's email
        subject: 'New Contact Us Message',
        html: htmlContent, // Use the rendered EJS HTML content
      };

      // Send email using Nodemailer
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ message: 'Error sending message' });
        }
        res.status(200).json({ message: 'Message sent successfully' });
      });
    });
  } 

  else if(req.method === 'GET'){
    res.json({
      message : "testing api"
    })
  }
  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
