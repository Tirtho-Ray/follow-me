/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import config from '../config';
import httpStatus from 'http-status';
import AppError from '../errors/appError';

const ReadFile = promisify(fs.readFile);

const sendEmail = async (email: string, html: string, subject: string) => {
  try {
    // console.log('Attempting to send email to:', email);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.sender_email,
        pass: config.sender_app_password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: '"E-Commerce" <' + config.sender_email + '>',
      to: email,
      subject,
      html,
    });

    // console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    // console.error('Error sending email:', error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Email sending failed');
  }
};


const createEmailContent = async (data: object, templateType: string) => {
  try {
    const templatePath = path.join(
      process.cwd(),
      `src/views/${templateType}.template.hbs`
    );
    const content = await ReadFile(templatePath, 'utf8');

    const template = Handlebars.compile(content);

    return template(data);
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const EmailHelper = {
  sendEmail,
  createEmailContent,
};
