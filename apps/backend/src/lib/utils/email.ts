import { createTransport } from "nodemailer"

export const sendEmail = async (
  email: string,
  subject: string,
  message: string
) => {
  const auth = {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  }

  const transporter = createTransport({
    name: process.env.SMTP_HOST!.split(".").slice(-2).join("."),
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth,
  })

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject,
    text: message,
  })
}
