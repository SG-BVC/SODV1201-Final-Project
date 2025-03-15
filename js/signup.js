PORT = 3000
document.addEventListener("DOMContentLoaded", () => {
    const signup_form = document.getElementById("signup_form");
    const message = document.getElementById("message");

    signup_form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent blank submissons

        const user_data = {
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            role: document.getElementById("role").value
            // Add Passwords for login
        };

        fetch(`http://localhost:${PORT}/signup`, { // For some reason, I need a literal path for fetch to work, need to fix for real servers
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user_data)
        })        
        .then(response => response.json())
        .then(data => {
            message.innerText = data.message;
            setTimeout(function() {
                window.location.href = "../index.html"
              }, 2000);
        })
        .catch(error => console.error("Error:", error));
    });
});