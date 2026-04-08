import "dotenv/config"
import { NextAuthOptions, getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getUserByEmail } from "@/server/services/user.service"
import bcrypt from "bcryptjs"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
        } & DefaultSession["user"]
    }

    interface User {
        role: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: string
    }
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                try {
                    const user = await getUserByEmail(credentials.email)

                    if (!user) {
                        return null
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.passwordHash
                    )

                    if (!isPasswordValid) {
                        return null
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    }
                } catch (error) {
                    console.error("[AUTH] FAIL:", error)
                    // If it failed with the connection error, we'll see it here in the logs
                    return null
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role
                session.user.id = token.id
            }
            return session
        },
    },
}

export const auth = () => getServerSession(authOptions)
