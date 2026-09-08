import nodemailer from "nodemailer";

const DEFAULT_FROM = "lukas@ambachtio.nl";

export function getMailConfiguration() {
  const user = process.env.INFOMANIAK_SMTP_USER ?? DEFAULT_FROM;
  const password = process.env.INFOMANIAK_SMTP_PASSWORD;
  return {
    from: process.env.OUTREACH_FROM_EMAIL ?? user,
    configured: Boolean(password),
    transporter: password
      ? nodemailer.createTransport({
          host: "mail.infomaniak.com",
          port: 587,
          secure: false,
          requireTLS: true,
          auth: { user, pass: password },
        })
      : null,
  };
}
