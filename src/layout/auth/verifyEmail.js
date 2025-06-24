import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyEmailApi } from "../../api-calls/auth";

function VerifyEmail() {

    const navigate = useNavigate();
    const [status, setStatus] = useState("pending"); // 'pending' | 'success' | 'error'
    const [message, setMessage] = useState("Waiting for email verification...");

    useEffect(() => {
        const verify = async () => {
            const token = new URLSearchParams(window.location.search).get("token");
            console.log("Token:", token);

            if (!token) {
                setStatus("error");
                setMessage("Your token provided.");
                // setTimeout(() => {
                //     navigate("/login");
                // }, 3000);
                return;
            }

            try {
                console.log(token);

                const res = await verifyEmailApi(token);
                console.log(res);
                
                if (res.success) {
                    setStatus("success");
                    setMessage(res.message || "Your email has been verified successfully!");
                    // Redirect to login after a delay
                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
                }

            } catch (err) {
                setStatus("error")
                console.log(err);
                if (err.response && err.response.data && err.response.data.message) {
                    setMessage(err.response.data.message);
                } else {
                    setMessage("Verification failed. Invalid or expired link.");
                }
            }
        };
        verify();
    }, [navigate]);

    return (
        <>
            <div className="email-verify-container" style={{ padding: "2rem", textAlign: "center" }}>
                {(status === "pending" || status === "error") && <h2>Verifying...</h2>}
                {status === "success" && <h3>Success!</h3>}
                <p>{message}</p>
                {status && <p>Redirecting to login...</p>}
            </div>
        </>
    )
}

export default VerifyEmail;