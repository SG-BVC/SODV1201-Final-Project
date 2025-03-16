module.exports = {
    PORT: 3000
};

document.addEventListener("DOMContentLoaded", () => {
    const drop_button = document.querySelector(".drop_button");
    const dropdown_content = document.querySelector(".dropdown_content");
    const login_link = document.querySelector(".dropdown_content a[href='html/login.html']");
    const signup_link = document.querySelector(".dropdown_content a[href='html/signup.html']");
    const edit_listing_link = document.querySelector(".dropdown_content a[href='html/editlisting.html']");
    
    const logout_link = document.createElement("a");
    logout_link.href = "#";
    logout_link.id = "logout_link";
    logout_link.innerText = "Log Out";
    logout_link.style.display = "none"; // Initially hidden

    const user = JSON.parse(localStorage.getItem("logged_in_user"));

    if (user) {
        drop_button.innerText = `Welcome, ${user.name}`;

        // Hide login/signup links and show logout
        login_link.style.display = "none";
        signup_link.style.display = "none";
        dropdown_content.appendChild(logout_link);
        logout_link.style.display = "block";

        // Show "Edit Your Listings" only for space owners
        if (user.role === "owner") {
            edit_listing_link.style.display = "block";
        } else {
            edit_listing_link.style.display = "none"; // Hide for non-owners
        }
    } else {
        drop_button.innerText = "Sign Up / Log In";
        login_link.style.display = "block";
        signup_link.style.display = "block";
        edit_listing_link.style.display = "none"; // Hide for logged-out users
    }

    // Logout functionality
    logout_link.addEventListener("click", () => {
        localStorage.removeItem("logged_in_user");
        window.location.reload();
    });
});