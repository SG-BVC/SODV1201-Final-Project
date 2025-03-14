PORT = 3000;
document.addEventListener("DOMContentLoaded", () => {
    const listing_form = document.getElementById("listing_form");
    const message = document.getElementById("message");

    listing_form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const form_data = {
            property_name: document.getElementById("property_name").value,
            location: document.getElementById("location").value,
            neighborhood: document.getElementById("neighborhood").value,
            square_feet: document.getElementById("square_feet").value,
            has_parking: document.getElementById("has_parking").value,
            public_transport: document.getElementById("public_transport").value,
            owner_email: JSON.parse(localStorage.getItem("logged_in_user")).email
        };

        try {
            const response = await fetch(`http://localhost:${PORT}/editlisting`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form_data)
            });

            const result = await response.json();
            message.innerText = result.message;
            message.style.color = response.ok ? "green" : "red";
            listing_form.reset();
        } catch (error) {
            message.innerText = "Error saving listing.";
            message.style.color = "red";
        }
    });
});
