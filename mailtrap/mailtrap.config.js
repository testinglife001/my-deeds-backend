// const { MailtrapClient } = require("mailtrap");
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
    dotenv.config({
      path: "./config/.env",
    });
}


// const TOKEN = "94cfa92ce5d4de39819e5099d028c1bd";
// const TOKEN = process.env.MAILTRAP_TOKEN;

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  // name: "Testing Life",
  name: "User Undefined",
};

// const recipients = [
//  {
//    email: "testing.life001@gmail.com",
//    2nd mailtrap account's email
//    email: "user.undefined313@gmail.com",
//  }
// ];
/*
client
  .send({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);
*/

