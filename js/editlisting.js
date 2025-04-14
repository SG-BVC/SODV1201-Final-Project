PORT = 3000;
document.addEventListener("DOMContentLoaded", async () => {
    const list_dropdown = document.getElementById("edit_listing_dropdown");
    const edit_form = document.getElementById("edit_listing_form");
    const message = document.getElementById("message2");
    const user = JSON.parse(localStorage.getItem("logged_in_user"));
    const delete_button = document.getElementById("delete");
    
    if (!user || user.role !== "owner") {
        message.innerText = "Access denied. You must be an owner to edit listings.";
        return;
    }
    
    async function fetchListings() {
        const response = await fetch(`http://localhost:${PORT}/get_listings`);
        const listings = await response.json();
        return listings.filter(listing => listing.owner_email === user.email);
    }    
    
    function populateDropdown(listings) {
        list_dropdown.innerHTML = '<option value="">-- Select a Listing --</option>';
        listings.forEach((listing, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = listing.property_name;
            list_dropdown.appendChild(option);
        });
    }
    
    async function loadListings() {
        const owner_listings = await fetchListings();
        populateDropdown(owner_listings);
    }
    
    list_dropdown.addEventListener("change", async () => {
        const owner_listings = await fetchListings();
        const selected_listing = owner_listings[list_dropdown.value];
        
        if (selected_listing) {
            edit_form.listed = selected_listing.listed;
            edit_form.property_name.value = selected_listing.property_name;
            edit_form.location.value = selected_listing.location;
            edit_form.neighborhood.value = selected_listing.neighborhood;
            edit_form.number_ppl.value = selected_listing.number_ppl;
            edit_form.workplace_type = selected_listing.workplace_type;
            edit_form.square_feet.value = selected_listing.square_feet;
            edit_form.has_parking.value = selected_listing.has_parking;
            edit_form.has_smoking.value = selected_listing.has_smoking;
            edit_form.public_transport.value = selected_listing.public_transport;
            edit_form.availability_date = selected_listing.availability_date;
            edit_form.lease_term = selected_listing.lease_term;
            edit_form.price = selected_listing.price;
            if (selected_listing.image) {
                document.getElementById("current_image").src = `../img/${selected_listing.image}`;
            }
        }
    });
    
    edit_form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const owner_listings = await fetchListings();
        const selected_index = list_dropdown.value;
        
        if (selected_index === "") {
            message.innerText = "Please select a listing to update.";
            return;
        }
        
        owner_listings[selected_index] = {
            listed: edit_form.querySelector("#listed_status").value,
            property_name: edit_form.property_name.value,
            location: edit_form.location.value,
            neighborhood: edit_form.neighborhood.value,
            number_ppl: edit_form.number_ppl.value,
            workplace_type: edit_form.workplace_type.value,
            square_feet: edit_form.square_feet.value,
            has_parking: edit_form.has_parking.value,
            has_smoking: edit_form.has_smoking.value,
            public_transport: edit_form.public_transport.value,
            availability_date: edit_form.availability_date.value,
            lease_term: edit_form.lease_term.value,
            price: edit_form.price.value,
            owner_email: user.email
        };
        
        await fetch(`http://localhost:${PORT}/update_listings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(owner_listings[selected_index])
        });
        
        message.innerText = "Listing updated successfully!";
        loadListings();
    });

    delete_button.addEventListener("click", async () => {
        const owner_listings = await fetchListings();
        const selected_index = list_dropdown.value;
    
        if (selected_index === "") {
            message.innerText = "Please select a listing to delete.";
            return;
        }
    
        const listing_delete = owner_listings[selected_index];
        const confirm_delete = confirm(`Are you sure you want to delete "${listing_delete.property_name}"?`);
        if (!confirm_delete) return;
    
        await fetch(`http://localhost:${PORT}/delete_listing`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: listing_delete.property_name,
                email: listing_delete.owner_email
            })
        });
    
        message.innerText = data.message;
        
        // Refresh the page after deletion
        if (res.ok) {
            location.reload();
        }
    });
    
    loadListings();
});
