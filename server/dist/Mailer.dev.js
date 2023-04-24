"use strict";

var nodemailer = require('nodemailer'); // Создаем транспорт SMTP


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'seno1801@gmail.com',
    pass: '3560041ABu_95'
  }
}); // Определяем опции письма

var mailOptions = {
  from: 'seno1801@gmail.com',
  to: 'buketov.95@mail.ri',
  subject: 'Test email with attachment',
  text: 'Please find the attached file',
  attachments: [{
    filename: 'Anton_Buketov_03.xlsx',
    path: './excelGenerator/Anton_Buketov_03.xlsx'
  }]
}; // Отправляем письмо

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});