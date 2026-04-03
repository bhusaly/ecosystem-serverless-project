import { useEffect, useState } from "react";
import { signIn, signUp, confirmSignUp, fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import "../aws-config";
import { useNavigate } from "react-router-dom";

const Auth = () => {
    const [mode, setMode] = useState<"login" | "signup" | "confirm">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const handleLogin = async () => {
        try {
            setLoading(true);
            await signIn({ username: email, password });
            const session = await fetchAuthSession();
            const token = session.tokens?.idToken?.toString();
            console.log("TOKEN:", token);
            alert("Login successful!");
            nav("/");
        } catch (error: any) {
            alert(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkUser = async () => {
            try {
                await getCurrentUser();
            } catch {
                nav("/login");
            }
        };
        checkUser();
    }, []);

    const handleSignup = async () => {
        try {
            setLoading(true);
            await signUp({
                username: email,
                password,
                options: { userAttributes: { email } },
            });
            setMode("confirm");
        } catch (error: any) {
            alert(error.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await confirmSignUp({ username: email, confirmationCode: code });
            alert("Account confirmed! Please login.");
            setMode("login");
        } catch (error: any) {
            alert(error.message || "Confirmation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{ backgroundColor: "#F5F5F5" }}
            className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
        >
           

            {mode !== "confirm" && (
                <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm">
                    <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
                        Login / Register
                    </h2>

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full mb-4 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full mb-5 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        onClick={mode === "login" ? handleLogin : handleSignup}
                        disabled={loading}
                        className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition hover:opacity-90"
                        style={{ backgroundColor: "#00B000" }}
                    >
                        {loading ? "Please wait..." : mode === "login" ? "Enter" : "Sign Up"}
                    </button>

                    <p className="text-xs text-center text-gray-400 mt-4">
                        {mode === "login" ? "Do not have account?" : "Already have an account?"}{" "}
                        <span
                            className="underline cursor-pointer"
                            style={{ color: "#00B000" }}
                            onClick={() => setMode(mode === "login" ? "signup" : "login")}
                        >
                            {mode === "login" ? "Sign up" : "Login"}
                        </span>
                    </p>
                </div>
            )}

            {mode === "confirm" && (
                <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm">
                    <h2 className="text-xl font-semibold text-center mb-2 text-gray-800">
                        Confirm Email
                    </h2>
                    <p className="text-xs text-gray-400 text-center mb-6">
                        Check your email for a verification code
                    </p>

                    <input
                        type="text"
                        placeholder="Enter Verification Token"
                        className="w-full mb-5 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />

                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition hover:opacity-90"
                        style={{ backgroundColor: "#00B000" }}
                    >
                        {loading ? "Please wait..." : "Verify"}
                    </button>

                    <p className="text-xs text-center text-gray-400 mt-4">
                        Back to{" "}
                        <span
                            className="underline cursor-pointer"
                            style={{ color: "#00B000" }}
                            onClick={() => setMode("login")}
                        >
                            Login
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default Auth;