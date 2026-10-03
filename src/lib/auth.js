import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
//import dns from "dns";
import { Resend } from 'resend';

//dns.setServers(["8.8.8.8"]);

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);
const db = client.db('better-auth-db');
const resend = new Resend(process.env.RESEND_API_KEY);



export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    "https://better-auth-md-39-t8ag.vercel.app",
  ],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
sendResetPassword: async ({user, url, token}, request) => {
      void resend.emails.send({
         from: 'Acme <onboarding@example.com>',
        to: user.email,
        subject: "Reset your password",
        html:`
        <h4> Reset your password</h4>
        Click the link to reset your password: ${url}
        <P>Ignore this email If you haven't requested a password reset
        `,
      });
    },


  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: 'Acme <onboarding@example.com>',
        to: user.email,
        subject: 'Verify your email address',
        html: `
        <h1>Please Verify your email adress</h1>
        Click <a href="${url}">here</a> to verify your email.`,


      })
    },
  sendOnSignUp: true,
		autoSignInAfterVerification: true,
		expiresIn:7*24*3600 // 7 days
  },

  socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET,
    },
    github: {
      clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET,
    },
  },

  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
});