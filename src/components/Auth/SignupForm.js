"use client";
import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Link from "next/link";
import googleImg from "../../../public/images/google.png";

const SignupForm = () => {
  const router = useRouter();
  
  // Part 1: Email & OTP
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  
  // Part 2: Signup Form (shown after email OTP verification)
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState(["", "", "", "", "", ""]);
  const [phoneOtpError, setPhoneOtpError] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const inputRefs = useRef([]);
  const phoneOtpRefs = useRef([]);

  // Load OTP from localStorage on mount
  useEffect(() => {
    const storedOtp = localStorage.getItem("signup_otp");
    const storedEmail = localStorage.getItem("signup_email");
    
    if (storedOtp && storedEmail) {
      setEmail(storedEmail);
      setShowOtp(true);
    }
  }, []);

  // Handle email submit - Generate and send OTP
  const handleEmailSubmit = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setOtpError("");

    try {
      const checkResponse = await axios.post("/api/auth/send-otp", {
        email: email,
        forSignup: true,
      });

      if (checkResponse.data.success && checkResponse.data.otp) {
        localStorage.setItem("signup_otp", checkResponse.data.otp);
        localStorage.setItem("signup_email", email);
        localStorage.setItem("signup_otp_time", Date.now().toString());

        setShowOtp(true);
        toast.success("OTP sent to your email!");
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } catch (error) {
      if (error.response?.data?.error?.includes("already")) {
        toast.error("Email already registered. Please sign in instead.");
        return;
      }
      const errorMessage =
        error.response?.data?.error || "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError(""); // Clear error when user types

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are entered
    if (value && index === 5) {
      const otpCode = [...newOtp];
      otpCode[5] = value;
      if (otpCode.every(digit => digit !== "")) {
        setTimeout(() => handleVerifyOtp(otpCode.join("")), 100);
      }
    }
  };

  // Handle keyboard events
  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle Enter key
    if (e.key === "Enter" && otp.join("").length === 6) {
      handleVerifyOtp();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);
    setOtpError(""); // Clear error on paste
    
    // Focus last filled input or first empty
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();

    // Auto-verify if 6 digits pasted
    if (pastedData.length === 6) {
      setTimeout(() => handleVerifyOtp(pastedData), 100);
    }
  };

  // Verify Email OTP
  const handleVerifyOtp = async (otpCode = null) => {
    const enteredOtp = otpCode || otp.join("");
    
    if (enteredOtp.length !== 6) {
      setOtpError("Please enter a 6-digit code");
      return;
    }

    setIsLoading(true);
    setOtpError("");

    try {
      const storedEmail = localStorage.getItem("signup_email");
      const storedOtp = localStorage.getItem("signup_otp");
      const storedTime = localStorage.getItem("signup_otp_time");

      if (!storedOtp || !storedTime || !storedEmail) {
        setOtpError("OTP not found. Please request a new one.");
        setIsLoading(false);
        return;
      }

      if (!storedEmail || email !== storedEmail) {
        setOtpError("OTP not found. Please request a new one.");
        setIsLoading(false);
        return;
      }

      // Check expiration (10 minutes = 600000 ms)
      const currentTime = Date.now();
      const otpAge = currentTime - parseInt(storedTime);
      if (otpAge > 600000) {
        setOtpError("OTP has expired. Please request a new one.");
        localStorage.removeItem("signup_otp");
        localStorage.removeItem("signup_email");
        localStorage.removeItem("signup_method");
        localStorage.removeItem("signup_otp_time");
        setIsLoading(false);
        return;
      }

      // Compare OTPs for email
      if (enteredOtp !== storedOtp) {
        setOtpError("Invalid OTP code. Please try again.");
        setIsLoading(false);
        return;
      }

      // OTP matched! Show signup form
      toast.success("Email verified successfully!");
      setShowOtp(false);
      setShowSignupForm(true);
      // Clear OTP from localStorage after successful verification
      localStorage.removeItem("signup_otp");
      localStorage.removeItem("signup_otp_time");
      
    } catch (error) {
      setOtpError("An error occurred. Please try again.");
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    if (showSignupForm) {
      setShowSignupForm(false);
      setShowOtp(true);
    } else {
      setShowOtp(false);
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
      localStorage.removeItem("signup_otp");
      localStorage.removeItem("signup_email");
      localStorage.removeItem("signup_otp_time");
    }
  };

  // Handle email key press
  const handleEmailKeyPress = (e) => {
    if (e.key === "Enter") {
      handleEmailSubmit();
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
      await signIn("facebook", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      toast.error("Facebook login failed. Please try again.");
      setIsSocialLoading(false);
    }
  };

  // Handle resend Email OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    setOtpError("");
    setOtp(["", "", "", "", "", ""]);
    
    try {
      const response = await axios.post("/api/auth/send-otp", {
        email: email,
        forSignup: true,
      });
      
      if (response.data.success && response.data.otp) {
        localStorage.setItem("signup_otp", response.data.otp);
        localStorage.setItem("signup_email", email);
        localStorage.setItem("signup_otp_time", Date.now().toString());
        toast.success("OTP resent!");
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle phone OTP send
  const handleSendPhoneOtp = async () => {
    if (!phone) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    setPhoneOtpError("");

    try {
      const response = await axios.post("/api/auth/send-phone-otp", {
        phoneNumber: phone,
        forSignup: true,
      });

      if (response.data.success) {
        localStorage.setItem("signup_phone_otp_time", Date.now().toString());
        setShowPhoneOtp(true);
        toast.success("OTP sent to your phone!");
        setTimeout(() => phoneOtpRefs.current[0]?.focus(), 100);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle phone OTP input change
  const handlePhoneOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...phoneOtp];
    newOtp[index] = value;
    setPhoneOtp(newOtp);
    setPhoneOtpError("");

    if (value && index < 5) {
      phoneOtpRefs.current[index + 1]?.focus();
    }

    if (value && index === 5) {
      const otpCode = [...newOtp];
      otpCode[5] = value;
      if (otpCode.every(digit => digit !== "")) {
        setTimeout(() => handleVerifyPhoneOtp(otpCode.join("")), 100);
      }
    }
  };

  // Handle phone OTP keydown
  const handlePhoneOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !phoneOtp[index] && index > 0) {
      phoneOtpRefs.current[index - 1]?.focus();
    }
  };

  // Verify Phone OTP
  const handleVerifyPhoneOtp = async (otpCode = null) => {
    const enteredOtp = otpCode || phoneOtp.join("");
    
    if (enteredOtp.length !== 6) {
      setPhoneOtpError("Please enter a 6-digit code");
      return;
    }

    setIsLoading(true);
    setPhoneOtpError("");

    try {
      const response = await axios.post("/api/auth/verify-phone-otp", {
        phoneNumber: phone,
        otp: enteredOtp,
      });

      if (response.data.success) {
        toast.success("Phone verified successfully!");
        setShowPhoneOtp(false);
        setPhoneVerified(true);
        localStorage.removeItem("signup_phone_otp_time");
      } else {
        setPhoneOtpError(response.data.error || "Invalid OTP code. Please try again.");
      }
    } catch (error) {
      setPhoneOtpError(error.response?.data?.error || "Invalid OTP code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle final signup form submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!phone) {
      toast.error("Phone number is required");
      return;
    }
    if (!phoneVerified) {
      toast.error("Please verify your phone number first");
      return;
    }
    if (!gender) {
      toast.error("Please select your gender");
      return;
    }
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const storedEmail = localStorage.getItem("signup_email") || email;

      const response = await axios.post("/api/register", {
        email: storedEmail,
        name: fullName.trim(),
        password,
        phone: phone,
        address: address || null,
        gender: gender,
      });

      if (response.data) {
        toast.success("Account created successfully! Please sign in.");
        // Clear localStorage
        localStorage.removeItem("signup_email");
        localStorage.removeItem("signup_phone");
        localStorage.removeItem("signup_otp");
        localStorage.removeItem("signup_otp_time");
        localStorage.removeItem("signup_phone_otp_time");
        router.push("/auth/signin");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
    }}>
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
            onClick={showOtp || showSignupForm ? handleBack : () => window.history.back()}
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
          {!showOtp && !showSignupForm ? (
            <>
              {/* Part 1: Email/Phone Choice */}
              <div style={{ marginBottom: "40px" }}>
                <h1 style={{
                  fontSize: "32px",
                  fontWeight: "600",
                  color: "#222222",
                  marginBottom: "12px",
                  lineHeight: "1.2",
                }}>
                  AmberHomes
                </h1>
                <p style={{
                  fontSize: "16px",
                  color: "#767676",
                  lineHeight: "1.5",
                }}>
                  Create your account to get started.
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
                  Continue with Google
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
                  Continue with Facebook
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

              {/* Email Input */}
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && email.includes("@")) {
                      handleEmailSubmit();
                    }
                  }}
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid #E0E0E0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    marginBottom: "16px",
                    outline: "none",
                    transition: "all 0.2s",
                    opacity: isLoading ? 0.6 : 1,
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#E61E4D"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#E0E0E0"}
                />

                <button
                  onClick={handleEmailSubmit}
                  disabled={isLoading || !email.includes("@")}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    background: "linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: isLoading || !email.includes("@") ? "not-allowed" : "pointer",
                    opacity: isLoading || !email.includes("@") ? 0.5 : 1,
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading && email.includes("@")) {
                      e.currentTarget.style.background = "linear-gradient(to right, #D01346 0%, #C7124D 50%, #B0035C 100%)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isLoading && email.includes("@")) {
                      e.currentTarget.style.background = "linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)";
                    }
                  }}
                >
                  {isLoading ? "Sending..." : "Continue"}
                </button>
              </div>

              {/* Sign in Link */}
              <div style={{
                textAlign: "center",
                marginTop: "32px",
              }}>
                <p style={{
                  fontSize: "15px",
                  color: "#767676",
                }}>
                  Already have an account?{" "}
                  <Link href="/auth/signin" style={{
                    color: "#E61E4D",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}>
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          ) : showOtp ? (
            <>
              {/* Email OTP Verification */}
              <div style={{ marginBottom: "40px" }}>
                <h1 style={{
                  fontSize: "32px",
                  fontWeight: "600",
                  color: "#222222",
                  marginBottom: "12px",
                  lineHeight: "1.2",
                }}>
                  Verify your email
                </h1>
                <p style={{
                  fontSize: "16px",
                  color: "#767676",
                  lineHeight: "1.5",
                }}>
                  We've sent a 6-digit code to{" "}
                  <strong style={{ color: "#222222" }}>
                    {email}
                  </strong>
                </p>
              </div>

              {/* OTP Input */}
              <div>
                <div style={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "16px",
                  justifyContent: "center",
                }}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      disabled={isLoading}
                      style={{
                        width: "60px",
                        height: "60px",
                        textAlign: "center",
                        fontSize: "24px",
                        fontWeight: "600",
                        border: otpError ? "2px solid #EF4444" : digit ? "2px solid #E61E4D" : "2px solid #E0E0E0",
                        borderRadius: "8px",
                        outline: "none",
                        transition: "all 0.2s",
                        backgroundColor: "#FFFFFF",
                        opacity: isLoading ? 0.6 : 1,
                      }}
                      onFocus={(e) => {
                        if (!otpError) {
                          e.currentTarget.style.borderColor = "#E61E4D";
                        }
                      }}
                      onBlur={(e) => {
                        if (!digit && !otpError) {
                          e.currentTarget.style.borderColor = "#E0E0E0";
                        }
                      }}
                    />
                  ))}
                </div>

                {/* Error Message */}
                {otpError && (
                  <p style={{
                    color: "#EF4444",
                    fontSize: "14px",
                    textAlign: "center",
                    marginBottom: "16px",
                  }}>
                    {otpError}
                  </p>
                )}

                <button
                  onClick={() => handleVerifyOtp()}
                  disabled={isLoading || otp.join("").length !== 6}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    background: "linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: isLoading || otp.join("").length !== 6 ? "not-allowed" : "pointer",
                    opacity: isLoading || otp.join("").length !== 6 ? 0.5 : 1,
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading && otp.join("").length === 6) {
                      e.currentTarget.style.background = "linear-gradient(to right, #D01346 0%, #C7124D 50%, #B0035C 100%)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isLoading && otp.join("").length === 6) {
                      e.currentTarget.style.background = "linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)";
                    }
                  }}
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </button>
              </div>

              {/* Resend Code */}
              <div style={{
                textAlign: "center",
                marginTop: "24px",
              }}>
                <p style={{
                  fontSize: "15px",
                  color: "#767676",
                }}>
                  Didn't receive the code?{" "}
                  <button
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#E61E4D",
                      fontWeight: "500",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      fontSize: "15px",
                      textDecoration: "underline",
                      padding: 0,
                      opacity: isLoading ? 0.6 : 1,
                    }}
                  >
                    Resend
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Part 2: Signup Form */}
              <div style={{ marginBottom: "40px" }}>
                <h1 style={{
                  fontSize: "32px",
                  fontWeight: "600",
                  color: "#222222",
                  marginBottom: "12px",
                  lineHeight: "1.2",
                }}>
                  Complete your profile
                </h1>
                <p style={{
                  fontSize: "16px",
                  color: "#767676",
                  lineHeight: "1.5",
                }}>
                  Enter your details to create your account.
                </p>
              </div>

              <form onSubmit={handleSignupSubmit}>
                {/* Full Name */}
                <input
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  required
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid #E0E0E0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    marginBottom: "16px",
                    outline: "none",
                    transition: "all 0.2s",
                    opacity: isLoading ? 0.6 : 1,
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#E61E4D"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#E0E0E0"}
                />

                {/* Email (read-only) */}
                <input
                  type="email"
                  value={email}
                  disabled
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid #E0E0E0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    marginBottom: "16px",
                    outline: "none",
                    backgroundColor: "#F5F5F5",
                    opacity: 0.7,
                    cursor: "not-allowed",
                  }}
                />

                {/* Phone Number with OTP Verification */}
                <div style={{ marginBottom: "16px" }}>
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={phone}
                    onChange={setPhone}
                    disabled={isLoading || phoneVerified}
                    required
                    style={{
                      "--PhoneInput-color--focus": "#E61E4D",
                    }}
                    numberInputProps={{
                      style: {
                        padding: "14px 16px",
                        border: phoneVerified ? "2px solid #10b981" : "1px solid #E0E0E0",
                        borderRadius: "8px",
                        fontSize: "16px",
                        outline: "none",
                        transition: "all 0.2s",
                        opacity: isLoading ? 0.6 : 1,
                        width: "100%",
                        backgroundColor: phoneVerified ? "#F0FDF4" : "#FFFFFF",
                      },
                      placeholder: phoneVerified ? "Phone verified ✓" : "Phone number",
                      onFocus: (e) => {
                        if (!phoneVerified) {
                          e.currentTarget.style.borderColor = "#E61E4D";
                        }
                      },
                      onBlur: (e) => {
                        if (!phoneVerified) {
                          e.currentTarget.style.borderColor = "#E0E0E0";
                        }
                      },
                    }}
                  />
                  
                  {!phoneVerified && phone && (
                    <div style={{ marginTop: "12px" }}>
                      {!showPhoneOtp ? (
                        <button
                          type="button"
                          onClick={handleSendPhoneOtp}
                          disabled={isLoading}
                          style={{
                            width: "100%",
                            padding: "12px 20px",
                            backgroundColor: "#ffffff",
                            border: "2px solid #E61E4D",
                            borderRadius: "8px",
                            color: "#E61E4D",
                            fontSize: "15px",
                            fontWeight: "600",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            opacity: isLoading ? 0.5 : 1,
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            if (!isLoading) {
                              e.target.style.backgroundColor = "#E61E4D";
                              e.target.style.color = "#ffffff";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isLoading) {
                              e.target.style.backgroundColor = "#ffffff";
                              e.target.style.color = "#E61E4D";
                            }
                          }}
                        >
                          {isLoading ? "Sending..." : "Send OTP"}
                        </button>
                      ) : (
                        <div>
                          <div style={{
                            display: "flex",
                            gap: "8px",
                            marginBottom: "12px",
                            justifyContent: "center",
                          }}>
                            {phoneOtp.map((digit, index) => (
                              <input
                                key={index}
                                ref={(el) => (phoneOtpRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handlePhoneOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handlePhoneOtpKeyDown(index, e)}
                                disabled={isLoading}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  textAlign: "center",
                                  fontSize: "20px",
                                  fontWeight: "600",
                                  border: phoneOtpError ? "2px solid #EF4444" : digit ? "2px solid #E61E4D" : "2px solid #E0E0E0",
                                  borderRadius: "8px",
                                  outline: "none",
                                  transition: "all 0.2s",
                                  backgroundColor: "#FFFFFF",
                                  opacity: isLoading ? 0.6 : 1,
                                }}
                                onFocus={(e) => {
                                  if (!phoneOtpError) {
                                    e.currentTarget.style.borderColor = "#E61E4D";
                                  }
                                }}
                                onBlur={(e) => {
                                  if (!digit && !phoneOtpError) {
                                    e.currentTarget.style.borderColor = "#E0E0E0";
                                  }
                                }}
                              />
                            ))}
                          </div>
                          {phoneOtpError && (
                            <p style={{
                              color: "#EF4444",
                              fontSize: "13px",
                              textAlign: "center",
                              marginBottom: "8px",
                            }}>
                              {phoneOtpError}
                            </p>
                          )}
                          <button
                            type="button"
                            onClick={() => handleVerifyPhoneOtp()}
                            disabled={isLoading || phoneOtp.join("").length !== 6}
                            style={{
                              width: "100%",
                              padding: "12px 20px",
                              backgroundColor: "#E61E4D",
                              border: "none",
                              borderRadius: "8px",
                              color: "#ffffff",
                              fontSize: "15px",
                              fontWeight: "600",
                              cursor: isLoading || phoneOtp.join("").length !== 6 ? "not-allowed" : "pointer",
                              opacity: isLoading || phoneOtp.join("").length !== 6 ? 0.5 : 1,
                              transition: "all 0.2s",
                            }}
                          >
                            {isLoading ? "Verifying..." : "Verify Phone"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Gender */}
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  disabled={isLoading}
                  required
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid #E0E0E0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    marginBottom: "16px",
                    outline: "none",
                    transition: "all 0.2s",
                    opacity: isLoading ? 0.6 : 1,
                    backgroundColor: "#FFFFFF",
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#E61E4D"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#E0E0E0"}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                {/* Address (optional) */}
                <input
                  type="text"
                  placeholder="Address (Optional)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid #E0E0E0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    marginBottom: "16px",
                    outline: "none",
                    transition: "all 0.2s",
                    opacity: isLoading ? 0.6 : 1,
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#E61E4D"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#E0E0E0"}
                />

                {/* Password */}
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  minLength={6}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid #E0E0E0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    marginBottom: "16px",
                    outline: "none",
                    transition: "all 0.2s",
                    opacity: isLoading ? 0.6 : 1,
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#E61E4D"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#E0E0E0"}
                />

                {/* Confirm Password */}
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid #E0E0E0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    marginBottom: "24px",
                    outline: "none",
                    transition: "all 0.2s",
                    opacity: isLoading ? 0.6 : 1,
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#E61E4D"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#E0E0E0"}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    background: "linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.5 : 1,
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => !isLoading && (e.currentTarget.style.background = "linear-gradient(to right, #D01346 0%, #C7124D 50%, #B0035C 100%)")}
                  onMouseOut={(e) => !isLoading && (e.currentTarget.style.background = "linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)")}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: "auto",
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
      }}>
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
    </div>
  );
};

export default SignupForm;
