PORT = 3000;
document.addEventListener("DOMContentLoaded", () => {
    const listing_form = document.getElementById("listing_form");
    const message = document.getElementById("message");

    listing_form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("listed", document.getElementById("listed_status").value);
        formData.append("property_name", document.getElementById("property_name").value);
        formData.append("location", document.getElementById("location").value);
        formData.append("neighborhood", document.getElementById("neighborhood").value);
        formData.append("number_ppl", document.getElementById("number_ppl").value);
        formData.append("workplace_type", document.getElementById("workplace_type").value);
        formData.append("square_feet", document.getElementById("square_feet").value);
        formData.append("has_parking", document.getElementById("has_parking").value);
        formData.append("public_transport", document.getElementById("public_transport").value);
        formData.append("availability_date", document.getElementById("availability_date").value);
        formData.append("lease_term", document.getElementById("lease_term").value);
        formData.append("price", document.getElementById("price").value);
        formData.append("owner_email", JSON.parse(localStorage.getItem("logged_in_user")).email);
        formData.append("listing_image", document.getElementById("listing_image").files[0]); // Add image

        try {
            const response = await fetch(`http://localhost:${PORT}/editlisting`, {
                method: "POST",
                body: formData
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
