import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { envInformation } from "../../../utils/envInfo";

const options: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credenciales",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email@ejemplo.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // hacer la peticion a la bbdd aquí
                if (!credentials?.email) { return null; }
                if (!credentials?.password) { return null; }

                // Petición login
                const rawResponse = await fetch(`${envInformation.ERPBACK_URL}api/session/authenticate`, {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: JSON.stringify({ email: credentials.email, password: credentials.password })
                });

                const resFromServer = await rawResponse.json();

                // Any object returned will be saved in `user` property of the JWT
                if (!resFromServer.success) return null;

                // If you return null or false then the credentials will be rejected
                return { nombre: resFromServer.message.nombre, apellidos: resFromServer.message.apellidos, email: resFromServer.message.email }
                // You can also Reject this callback with an Error or with a URL:
                // throw new Error("error message") // Redirect to error page
                // throw "/path/to/redirect"        // Redirect to a URL
            }
        })
    ],

    secret: "ayyorugitas",

    session: {
        // Use JSON Web Tokens for session instead of database sessions.
        // This option can be used with or without a database for users/accounts.
        // Note: `strategy` should be set to 'jwt' if no database is used.
        strategy: "jwt",

        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 60 * 60 * 4, // 4 Horas

        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        // updateAge: 24 * 60 * 60, // 24 hours
    },

    // JSON Web tokens are only used for sessions if the `jwt: true` session
    // option is set - or by default if no database is specified.
    // https://next-auth.js.org/configuration/options#jwt
    jwt: {
        secret: "ayyorugitas",
        // You can define your own encode/decode functions for signing and encryption
        // if you want to override the default behaviour.
        // async encode({ secret, token, maxAge }) { },
        // async decode({ secret, token }) { },
    },

    // You can define custom pages to override the built-in ones. These will be regular Next.js pages
    // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
    // The routes shown here are the default URLs that will be used when a custom
    // pages is not specified for that route.
    // https://next-auth.js.org/configuration/pages
    pages: {
        signIn: '/login',  // Displays signin buttons
        //signOut: '/auth/signout', // Displays form with sign out button
        //error: '/auth/error', // Error code passed in query string as ?error=
        //verifyRequest: '/auth/verify-request', // Used for check email page
        //newUser: null // If set, new users will be directed here on first sign in
    },

    // Callbacks are asynchronous functions you can use to control what happens
    // when an action is performed.
    // https://next-auth.js.org/configuration/callbacks
    callbacks: {
        // async signIn({ user, account, profile, email, credentials }) {
        //     const isAllowedToSignIn = true
        //     if (isAllowedToSignIn) {
        //         return true
        //     } else {
        //         // Return false to display a default error message
        //         return false
        //         // Or you can return a URL to redirect to:
        //         // return '/unauthorized'
        //     }
        // },
        // async signIn({ user, account, profile, email, credentials }) { return true },
        // async redirect({ url, baseUrl }) { return baseUrl },
        //async session({ session, token, user }) { return session },
        // async jwt({ token, user, account, profile, isNewUser }) {
        //     return token
        // }
    },

    // // Events are useful for logging
    // // https://next-auth.js.org/configuration/events
    // events: {},

    // // You can set the theme to 'light', 'dark' or use 'auto' to default to the
    // // whatever prefers-color-scheme is set to in the browser. Default is 'auto'
    // theme: {
    //     colorScheme: "light",
    // },

    // Enable debug messages in the console if you are having problems
    debug: true,
}

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);