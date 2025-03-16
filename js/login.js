const { PORT } = require('./global');
document.addEventListener("DOMContentLoaded", () => {
    const login_form = document.getElementById("login_form");
    const message = document.getElementById("message");

    login_form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        const user_email = document.getElementById("email").value;

        fetch(`http://localhost:${PORT}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user_email })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Login response data:", data);
            if (data.success) {
                localStorage.setItem("logged_in_user", JSON.stringify(data.user));
                console.log("User stored in localStorage:", localStorage.getItem("logged_in_user"));
                message.innerText = "Login successful! Redirecting...";
                setTimeout(() => {
                    window.location.href = "../index.html"; // Redirect to home or dashboard
                }, 1500);
            } else {
                message.innerText = "Invalid email. Please sign up first.";
            }
        })
        .catch(error => console.error("Error:", error));        
    });
});
