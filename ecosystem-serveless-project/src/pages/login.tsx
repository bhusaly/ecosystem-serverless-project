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
            nav('/')
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
                nav('/login');
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">

                <h2 className="text-xl font-semibold mb-1 text-center">
                    {mode === "login" ? "Login" : mode === "signup" ? "Sign Up" : "Confirm Email"}
                </h2>
                <p className="text-xs text-gray-400 text-center mb-5">
                    {mode === "confirm"
                        ? "Check your email for a verification code"
                        : "User Login"}
                </p>

                {mode !== "confirm" && (
                    <>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full mb-3 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full mb-4 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </>
                )}

                {mode === "confirm" && (
                    <input
                        type="text"
                        placeholder="Enter verification code"
                        className="w-full mb-4 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                )}

                <button
                    onClick={
                        mode === "login"
                            ? handleLogin
                            : mode === "signup"
                                ? handleSignup
                                : handleConfirm
                    }
                    disabled={loading}
                    className="w-full bg-black text-white py-2 rounded-md text-sm hover:opacity-90 transition"
                >
                    {loading
                        ? "Please wait..."
                        : mode === "login"
                            ? "Login"
                            : mode === "signup"
                                ? "Sign Up"
                                : "Confirm"}
                </button>

                {mode !== "confirm" && (
                    <p className="text-xs text-center text-gray-500 mt-4">
                        {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                        <span
                            className="underline cursor-pointer text-black"
                            onClick={() => setMode(mode === "login" ? "signup" : "login")}
                        >
                            {mode === "login" ? "Sign up" : "Login"}
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Auth;