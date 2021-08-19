/* eslint-disable no-unused-vars */
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { promisify } from 'util';
import fs from 'fs';
import handlebars from 'handlebars';

const sendMail = async (emails: string) => {
  const readFile = promisify(fs.readFile);

  const mailer = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    secure: false,
    auth: {
      user: 'ebc49738e21533',
      pass: '4e99af3525e64b',
    },
  });

  mailer.use('compile', hbs({
    viewEngine: {
      extname: '.edge',
    },
    viewPath: 'src/templates/deafult/emails',
    extName: '.edge',
  }));

  const html = await readFile('./src/templates/deafult/emails/new_bet.edge', 'utf8');
  const template = handlebars.compile(html);
  const htmlToSend = template(template);

  mailer.sendMail({
    from: 'Your name username@domain.com',
    to: emails,
    subject: 'New Bet',
    html: htmlToSend,
  }, (err, response) => {
    if (err) {
      console.log(err);
    }
    console.log('Email send successed to you email.');
  });
};

export default sendMail;
