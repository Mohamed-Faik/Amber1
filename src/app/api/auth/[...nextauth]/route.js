import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import prisma from "@/libs/prismadb";

// Build providers array conditionally
const providers = [];

// Add GitHub provider if credentials exist
if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
	providers.push(
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		})
	);
}

// Add Google provider if credentials exist
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
	providers.push(
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		})
	);
}

// Add Facebook provider if credentials exist
if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
	providers.push(
		FacebookProvider({
			clientId: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
		})
	);
}

// Create adapter with custom user creation to handle updated_at
const baseAdapter = PrismaAdapter(prisma);

const customAdapter = {
	...baseAdapter,
	async createUser(data) {
		// Ensure updated_at is set when creating user
		const userData = {
			...data,
			updated_at: new Date(),
		};
		return baseAdapter.createUser(userData);
	},
	async updateUser(data) {
		// Ensure updated_at is updated
		const userData = {
			...data,
			updated_at: new Date(),
		};
		return baseAdapter.updateUser(userData);
	},
};

export const authHandler = NextAuth({
	adapter: customAdapter,
	providers: [
		...providers,
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "email", type: "text" },
				password: { label: "password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Invalid credentials");
				}

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				// console.log('####', user)

				if (!user || !user?.hashedPassword) {
					throw new Error("Invalid credentials");
				}

				const isCorrectPassword = await bcrypt.compare(
					credentials.password,
					user.hashedPassword
				);

				if (!isCorrectPassword) {
					throw new Error("Invalid credentials");
				}

				return user;
			},
		}),
		CredentialsProvider({
			name: "otp",
			credentials: {
				email: { label: "email", type: "text" },
			},
			async authorize(credentials) {
				if (!credentials?.email) {
					throw new Error("Email is required");
				}

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				if (!user) {
					throw new Error("User not found");
				}

				// OTP verification is done in the verify-otp route
				// Here we just return the user if they exist
				return user;
			},
		}),
	],
	pages: {
		signIn: "/auth/signin",
		error: "/auth/signin",
	},
	callbacks: {
		async signIn({ user, account, profile }) {
			// Allow OAuth sign-ins - PrismaAdapter will handle user creation
			if (account?.provider === "google" || account?.provider === "github" || account?.provider === "facebook") {
				// Ensure user has required fields
				if (!user.email) {
					console.error("OAuth user missing email:", user);
					return false;
				}
				return true;
			}
			return true;
		},
		async jwt({ token, user, account }) {
			// Initial sign in
			if (account && user) {
				// Store user data in token
				return {
					...token,
					accessToken: account.access_token,
					refreshToken: account.refresh_token,
					accessTokenExpires: account.expires_at ? account.expires_at * 1000 : null,
					user: {
						id: user.id,
						email: user.email,
						name: user.name,
						image: user.image,
						role: user.role || "USER",
					},
				};
			}

			// On subsequent requests, fetch fresh user data from database if needed
			if (token?.user?.email && !token.user.role) {
				try {
					const dbUser = await prisma.user.findUnique({
						where: { email: token.user.email },
					});
					if (dbUser) {
						token.user.role = dbUser.role || "USER";
					}
				} catch (error) {
					console.error("Error fetching user role in JWT:", error);
				}
			}

			return token;
		},
		async session({ session, token }) {
			if (token?.user) {
				session.user = {
					...session.user,
					...token.user,
				};
				session.accessToken = token.accessToken;
			}
			return session;
		},
		async redirect({ url, baseUrl }) {
			// Allows relative callback URLs
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		},
	},
	events: {
		async createUser({ user }) {
			// Ensure updated_at is set after user creation
			try {
				await prisma.user.update({
					where: { id: user.id },
					data: { updated_at: new Date() },
				});
			} catch (error) {
				console.error("Error updating user after creation:", error);
			}
		},
		async signIn({ user, account, profile }) {
			// Log successful sign-ins for debugging
			if (process.env.NODE_ENV === "development") {
				console.log("Sign in successful:", {
					provider: account?.provider,
					email: user.email,
					userId: user.id,
				});
			}
		},
		async signInError({ error }) {
			// Log sign-in errors
			console.error("Sign in error:", error);
		},
	},
	debug: process.env.NODE_ENV === "development",
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	trustHost: true, // Required for OAuth to work properly
});

export { authHandler as GET, authHandler as POST };
