document.addEventListener("DOMContentLoaded", () => {
    const drop_button = document.querySelector(".drop_button");
    const dropdown_content = document.querySelector(".dropdown_content");

    // Correctly select links regardless of the page location
    const login_link = document.querySelector(".dropdown_content a[href$='login.html']");
    const signup_link = document.querySelector(".dropdown_content a[href$='signup.html']");
    const edit_listing_link = document.querySelector(".dropdown_content a[href$='editlisting.html']");

    // Create the logout button (if it doesn't exist)
    let logout_link = document.getElementById("logout_link");
    if (!logout_link) {
        logout_link = document.createElement("a");
        logout_link.href = "#";
        logout_link.id = "logout_link";
        logout_link.innerText = "Log Out";
    }

    const user = JSON.parse(localStorage.getItem("logged_in_user"));

    if (user) {
        drop_button.innerText = `Welcome, ${user.name}`;

        // Hide login/signup links (if they exist)
        if (login_link) login_link.style.display = "none";
        if (signup_link) signup_link.style.display = "none";

        // Show "Edit Your Listings" only for owners
        if (user.role === "owner" && edit_listing_link) {
            edit_listing_link.style.display = "block";
        } else if (edit_listing_link) {
            edit_listing_link.style.display = "none"; // Hide for non-owners
        }

        // Make sure "Log Out" is added if not already present
        if (!document.getElementById("logout_link")) {
            dropdown_content.appendChild(logout_link);
        }
        
        // Make sure "Log Out" is visible
        logout_link.style.display = "block";

    } else {
        drop_button.innerText = "Sign Up / Log In";

        // Show login/signup links if they exist
        if (login_link) login_link.style.display = "block";
        if (signup_link) signup_link.style.display = "block";

        // Hide "Edit Your Listings"
        if (edit_listing_link) edit_listing_link.style.display = "none";

        // Remove "Log Out" if user is logged out
        if (document.getElementById("logout_link")) {
            document.getElementById("logout_link").remove();
        }
    }

    // Logout functionality
    logout_link.addEventListener("click", () => {
        localStorage.removeItem("logged_in_user");
        window.location.reload();
    });
});
