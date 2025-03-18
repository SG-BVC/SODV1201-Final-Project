PORT = 3000;
document.addEventListener("DOMContentLoaded", function () {
    const listing = JSON.parse(localStorage.getItem("selected_listing"));

    let text_convert = "";
    if (listing.workplace_type === "meeting_room") {
        text_convert = "Meeting Room";
    } else if (listing.workplace_type === "private_office") {
        text_convert = "Private Office";
    } else if (listing.workplace_type === "open_desk") {
        text_convert = "Open Desk";
    }

    if (listing) {
        document.getElementById("listing_details").innerHTML = `
            <h2>${listing.property_name}</h2>
            <p><strong>Location:</strong> ${listing.location}</p>
            <p><strong>Neighborhood:</strong> ${listing.neighborhood}</p>
            <p><strong>Workplace Type:</strong> ${text_convert}</p>
            <p><strong>Has Parking:</strong> ${listing.has_parking === "yes" ? "Yes" : "No"}</p>
            <p><strong>Public Transport:</strong> ${listing.public_transport === "yes" ? "Yes" : "No"}</p>
            <p><strong>Price:</strong> $${listing.price}/${listing.lease_term}</p>
            <p><strong>Capacity:</strong> ${listing.number_ppl} People</p>
        `;

        // Fetch users.json and find the owner
        fetch(`http://localhost:${PORT}/json/users.json`)
            .then(response => response.json())
            .then(users => {
                const owner = users.find(user => user.email === listing.owner_email);
                if (owner) {
                    document.getElementById("owner_details").innerHTML = `
                        <h3>Owner Information</h3>
                        <p><strong>Name:</strong> ${owner.name}</p>
                        <p><strong>Phone:</strong> ${owner.phone}</p>
                        <p><strong>Email:</strong> ${owner.email}</p>
                    `;
                } else {
                    // This should never happen, but just in case
                    document.getElementById("owner_details").innerHTML = "<p>Owner information not found.</p>";
                }
            })
            .catch(error => console.error("Error loading owner details:", error));
    } else {
        document.getElementById("listing_details").innerHTML = "<p>No listing selected.</p>";
    }
});