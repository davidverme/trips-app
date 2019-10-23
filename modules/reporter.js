const helper = require('sendgrid').mail;
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

const config = require('config');

const sendEmail = (email, subject, text) => {
  const {
    sender,
  } = config.reporter.email;

  const fromEmail = new helper.Email(sender);
  const toEmail = new helper.Email('test@example.com');
  const content = new helper.Content('text/plain', text);
  const mail = new helper.Mail(fromEmail, subject, toEmail, content);
  
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });

  sg.API(request, function(error, response) {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
};

module.exports = {
  sendEmail,
};


