PORT = 3000;
document.addEventListener("DOMContentLoaded", () => {
    const listing_form = document.getElementById("listing_form");
    const message = document.getElementById("message");

    listing_form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const form_data = new FormData();
        form_data.append("listed", document.getElementById("listed_status").value);
        form_data.append("property_name", document.getElementById("property_name").value);
        form_data.append("location", document.getElementById("location").value);
        form_data.append("neighborhood", document.getElementById("neighborhood").value);
        form_data.append("number_ppl", document.getElementById("number_ppl").value);
        form_data.append("workplace_type", document.getElementById("workplace_type").value);
        form_data.append("square_feet", document.getElementById("square_feet").value);
        form_data.append("has_parking", document.getElementById("has_parking").value);
        form_data.append("has_smoking", document.getElementById("has_smoking").value);
        form_data.append("public_transport", document.getElementById("public_transport").value);
        form_data.append("availability_date", document.getElementById("availability_date").value);
        form_data.append("lease_term", document.getElementById("lease_term").value);
        form_data.append("price", document.getElementById("price").value);
        form_data.append("owner_email", JSON.parse(localStorage.getItem("logged_in_user")).email);
        form_data.append("listing_image", document.getElementById("listing_image").files[0]); // Add image

        try {
            const response = await fetch(`http://localhost:${PORT}/edit_listing`, {
                method: "POST",
                body: form_data
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
