"use client";
import React, { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import googleImg from "../../../public/images/google.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";

const SigninForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, isDetecting } = useLanguage();
  const displayLanguage = isDetecting ? "en" : language;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  // Check for OAuth callback errors in URL
  useEffect(() => {
    const error = searchParams?.get("error");
    if (error) {
      // Clear the error from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
      
      // Show appropriate error message
      if (error === "Callback") {
        toast.error("Facebook login failed during authentication. This may be due to account linking issues. Please try again or contact support if the problem persists.");
      } else if (error === "OAuthSignin") {
        toast.error("Facebook sign-in failed. Please check your Facebook app configuration.");
      } else if (error === "OAuthCallback") {
        toast.error("Facebook login callback failed. Please verify your redirect URI is configured correctly in Facebook App settings.");
      } else if (error === "AccessDenied") {
        toast.error("Facebook login was denied. Please grant the necessary permissions.");
      } else {
        toast.error(`Login error: ${error}. Please try again.`);
      }
    }
  }, [searchParams]);

  // Handle email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error(getTranslation(displayLanguage, "auth.invalidEmail"));
      return;
    }
    if (!password || password.length < 6) {
      toast.error(getTranslation(displayLanguage, "auth.passwordTooShort"));
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(getTranslation(displayLanguage, "auth.invalidCredentials"));
      } else {
        toast.success(getTranslation(displayLanguage, "auth.loginSuccess"));
        // Force a full page reload to update navbar with new session
        window.location.href = "/";
      }
    } catch (error) {
      toast.error(getTranslation(displayLanguage, "auth.loginFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setIsSocialLoading(true);
    try {
      const result = await signIn("google", {
        callbackUrl: window.location.origin,
        redirect: false,
      });
      
      if (result?.error) {
        if (result.error === "OAuthSignin" || result.error === "Configuration") {
          toast.error("Google sign-in is not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env file and restart the server.");
        } else {
          toast.error(`Google login failed: ${result.error}`);
        }
        setIsSocialLoading(false);
      } else if (result?.ok) {
        // Success - redirect will happen automatically
        window.location.href = result.url || window.location.origin;
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please check your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env file and restart the server.");
      setIsSocialLoading(false);
    }
  };

  // Handle Facebook login
  const handleFacebookLogin = async () => {
    setIsSocialLoading(true);
    try {
      const result = await signIn("facebook", {
        callbackUrl: window.location.origin,
        redirect: false,
      });
      
      if (result?.error) {
        if (result.error === "OAuthSignin" || result.error === "Configuration") {
          toast.error(
            "Facebook login is unavailable. Make sure: 1) Facebook app is in Live mode (not Development), 2) Redirect URI is configured. See FACEBOOK_LOGIN_QUICK_FIX.md",
            { duration: 6000 }
          );
        } else if (result.error === "AccessDenied") {
          toast.error("Facebook login was denied. Please make sure you grant permission and that your Facebook app is configured correctly.");
        } else if (result.error === "OAuthCallback") {
          const redirectUri = `${window.location.origin}/api/auth/callback/facebook`;
          toast.error(
            `Redirect URI mismatch! Add this exact URI to Facebook App Settings → Valid OAuth Redirect URIs: ${redirectUri}`,
            { duration: 8000 }
          );
        } else {
          toast.error(`Facebook login failed: ${result.error}. The most common fix is switching your Facebook app to Live mode. See FACEBOOK_LOGIN_QUICK_FIX.md`, { duration: 6000 });
        }
        setIsSocialLoading(false);
      } else if (result?.ok) {
        // Success - redirect will happen automatically
        toast.success("Logged in successfully!");
        window.location.href = result.url || window.location.origin;
      }
    } catch (error) {
      console.error("Facebook login error:", error);
      toast.error("Facebook login failed. Please check your Facebook app configuration. See FACEBOOK_LOGIN_SETUP.md for setup instructions.");
      setIsSocialLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
    }} className="signin-container">
      {/* Left Side - Form */}
      <div style={{
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        padding: "40px 60px",
      }}>
        {/* Back Arrow */}
        <div style={{ marginBottom: "auto" }}>
          <button
            onClick={() => window.history.back()}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              marginLeft: "-8px",
            }}
          >
            <ArrowLeft size={24} color="#222222" />
          </button>
        </div>

        {/* Main Content */}
        <div style={{
          maxWidth: "460px",
          width: "100%",
          margin: "0 auto",
        }}>
          {/* Header */}
          <div style={{ marginBottom: "40px" }}>
            <h1 style={{
              fontSize: "32px",
              fontWeight: "600",
              color: "#222222",
              marginBottom: "12px",
              lineHeight: "1.2",
            }}>
              Welcome back
            </h1>
            <p style={{
              fontSize: "16px",
              color: "#767676",
              lineHeight: "1.5",
            }}>
              {getTranslation(displayLanguage, "auth.loginTitle")}
            </p>
          </div>

          {/* Social Login Buttons */}
          <div style={{ marginBottom: "24px" }}>
            {/* Google Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading || isSocialLoading}
              style={{
                width: "100%",
                padding: "14px 20px",
                border: "1px solid #E0E0E0",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: isLoading || isSocialLoading ? "not-allowed" : "pointer",
                backgroundColor: "#FFFFFF",
                color: "#222222",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                marginBottom: "12px",
                transition: "all 0.2s",
                opacity: isLoading || isSocialLoading ? 0.6 : 1,
              }}
              onMouseOver={(e) => {
                if (!isLoading && !isSocialLoading) {
                  e.currentTarget.style.borderColor = "#222222";
                  e.currentTarget.style.backgroundColor = "#F8F8F8";
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading && !isSocialLoading) {
                  e.currentTarget.style.borderColor = "#E0E0E0";
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                }
              }}
            >
              <Image 
                src={googleImg} 
                alt="Google" 
                width={20} 
                height={20} 
              />
              {getTranslation(displayLanguage, "auth.continueWith")} Google
            </button>

            {/* Facebook Button */}
            <button
              onClick={handleFacebookLogin}
              disabled={isLoading || isSocialLoading}
              style={{
                width: "100%",
                padding: "14px 20px",
                border: "1px solid #E0E0E0",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: isLoading || isSocialLoading ? "not-allowed" : "pointer",
                backgroundColor: "#1877F2",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                transition: "all 0.2s",
                opacity: isLoading || isSocialLoading ? 0.6 : 1,
              }}
              onMouseOver={(e) => {
                if (!isLoading && !isSocialLoading) {
                  e.currentTarget.style.backgroundColor = "#166FE5";
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading && !isSocialLoading) {
                  e.currentTarget.style.backgroundColor = "#1877F2";
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              {getTranslation(displayLanguage, "auth.continueWith")} Facebook
            </button>
          </div>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
            gap: "16px",
          }}>
            <div style={{
              flex: 1,
              height: "1px",
              backgroundColor: "#E0E0E0",
            }} />
            <span style={{ color: "#767676", fontSize: "14px" }}>OR</span>
            <div style={{
              flex: 1,
              height: "1px",
              backgroundColor: "#E0E0E0",
            }} />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin}>
            {/* Email Input */}
            <div style={{ marginBottom: "16px" }}>
              <input
                type="email"
                placeholder={getTranslation(displayLanguage, "auth.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isSocialLoading}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.2s",
                  opacity: isLoading || isSocialLoading ? 0.6 : 1,
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#E61E4D"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#E0E0E0"}
              />
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: "8px" }}>
              <input
                type="password"
                placeholder={getTranslation(displayLanguage, "auth.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isSocialLoading}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.2s",
                  opacity: isLoading || isSocialLoading ? 0.6 : 1,
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#E61E4D"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#E0E0E0"}
              />
            </div>

            {/* Forgot Password Link */}
            <div style={{ marginBottom: "24px", textAlign: "right" }}>
              <Link
                href="/auth/forgot-password"
                style={{
                  color: "#E61E4D",
                  fontSize: "14px",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) => {
                  e.target.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.target.style.textDecoration = "none";
                }}
              >
                {getTranslation(displayLanguage, "auth.forgotPassword")}
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSocialLoading || !email.includes("@") || !password}
              style={{
                width: "100%",
                padding: "14px 20px",
                background: "linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: isLoading || isSocialLoading || !email.includes("@") || !password ? "not-allowed" : "pointer",
                opacity: isLoading || isSocialLoading || !email.includes("@") || !password ? 0.5 : 1,
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                if (!isLoading && !isSocialLoading && email.includes("@") && password) {
                  e.currentTarget.style.background = "linear-gradient(to right, #D01346 0%, #C7124D 50%, #B0035C 100%)";
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading && !isSocialLoading && email.includes("@") && password) {
                  e.currentTarget.style.background = "linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)";
                }
              }}
            >
              {isLoading ? `${getTranslation(displayLanguage, "common.loading")}` : getTranslation(displayLanguage, "auth.loginButton")}
            </button>
          </form>

          {/* Sign up Link */}
          <div style={{
            textAlign: "center",
            marginTop: "32px",
          }}>
            <p style={{
              fontSize: "15px",
              color: "#767676",
            }}>
              {getTranslation(displayLanguage, "auth.dontHaveAccount")}{" "}
              <Link href="/auth/signup" style={{
                color: "#E61E4D",
                textDecoration: "none",
                fontWeight: "500",
              }}>
                {getTranslation(displayLanguage, "common.signup")}
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div style={{
          display: "flex",
          gap: "24px",
          justifyContent: "center",
          paddingTop: "40px",
        }}>
          <button style={{
            background: "none",
            border: "none",
            color: "#717171",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              <path d="M2 12h20"/>
            </svg>
            English
          </button>
          <button style={{
            background: "none",
            border: "none",
            color: "#717171",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            Help and support
          </button>
        </div>
      </div>

      {/* Right Side - Image */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        height: "100vh",
      }} className="signin-image">
        <img 
          src="https://www.fresha.com/assets/_next/static/images/Image5-db2e8204dd7d58aedfee81f58fb0c570.webp"
          alt="AmberHomes"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>
      <style jsx>{`
        /* Tablet: 768px - 991px */
        @media (max-width: 991px) {
          .signin-container {
            grid-template-columns: 1fr !important;
          }
          .signin-image {
            display: none !important;
          }
        }

        /* Mobile: < 768px */
        @media (max-width: 767px) {
          .signin-container {
            grid-template-columns: 1fr !important;
          }
          .signin-image {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SigninForm;
