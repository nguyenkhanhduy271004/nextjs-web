import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { InActiveAccountError, InvalidEmailPasswordError } from "./utils/error";
import { sendRequest } from "./utils/api";
import { IUser } from "./types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                const res = await sendRequest<IBackendRes<ILogin>>({
                    method: "POST",
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
                    body: {
                        username: credentials.username,
                        password: credentials.password,
                    },
                });


                if (res.statusCode === 201) {
                    const user = {
                        _id: res?.data?.user?._id,
                        name: res?.data?.user?.name,
                        email: res?.data?.user?.email,
                        access_token: res?.data?.access_token,
                    };
                    return user;
                } else if (+res.statusCode === 401) {
                    throw new InvalidEmailPasswordError();
                } else if (+res.statusCode === 400) {
                    throw new InActiveAccountError();
                } else {
                    throw new Error("Internal server error");
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.user = (user as IUser);
            }
            return token;
        },
        session({ session, token }) {
            if (token.user) {
                (session.user as IUser) = token.user;
            }
            return session;
        },
        authorized: async ({ auth }) => {
            console.log('123');
            return !!auth
        },
    },
});
