document.addEventListener("DOMContentLoaded", function () {
    const listings_container = document.getElementById("listings_container");
    const search_input = document.getElementById("search_input");
    const search_button = document.getElementById("search_button");
    const apply_filters_button = document.getElementById("apply_filters");
    const price_range = document.getElementById("price_range");
    const price_range_value = document.getElementById("price_range_value");
    const capacity_range = document.getElementById("capacity_range");
    const capacity_range_value = document.getElementById("capacity_range_value");

    async function fetchListings() {
        try {
            const response = await fetch("../json/listings.json");
            const listings = await response.json();
            displayListings(listings);
        } catch (error) {
            console.error("Error fetching listings:", error);
            listings_container.innerHTML = "<p>Failed to load listings.</p>";
        }
    }

    function displayListings(filtered_listings) {
        const listings_grid = document.getElementById("listings_container");
    
        // Clear existing listings before displaying new ones
        listings_grid.innerHTML = "";
    
        if (filtered_listings.length === 0) {
            listings_grid.innerHTML = "<p style='color: white; text-align: center;'>No listings match your search.</p>";
            return;
        }
    
        filtered_listings.forEach(listing => {
            if (listing.listed === "yes") {
                const listring_element = document.createElement("div");
                listring_element.classList.add("listing_box");
                listring_element.id = `listing-${listing.id}`;

                text_convert = ""
                if (listing.workplace_type = "meeting_room") {
                    text_convert = "Meeting Room";
                } else if (listing.workplace_type = "private_office") {
                    text_convert = "Private Office";
                } else if (listing.workplace_type = "open_desk") {
                    text_convert = "Open Desk";
                }
        
                // Create details
                listring_element.innerHTML = `
                    <h3>${listing.property_name}</h3>
                    <p><strong>Location:</strong> ${listing.location}</p>
                    <p><strong>Neighborhood:</strong> ${listing.neighborhood}</p>
                    <p><strong>Workplace Type:</strong> ${text_convert}</p>
                    <p><strong>Lease Term:</strong> ${listing.lease_term}</p>
                    <p><strong>Has Parking:</strong> ${listing.has_parking === "yes" ? "Yes" : "No"}</p>
                    <p><strong>Public Transport:</strong> ${listing.public_transport === "yes" ? "Yes" : "No"}</p>
                    <p><strong>Price:</strong> $${listing.price}/${listing.lease_term}</p>
                    <p><strong>Capacity:</strong> ${listing.number_ppl} People</p>
                `;
        
                // Apply box styling dynamically to prevent loss of styles
                listring_element.style.backgroundColor = "#363636";
                listring_element.style.padding = "15px";
                listring_element.style.margin = "15px 0";
                listring_element.style.borderRadius = "10px";
                listring_element.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                listring_element.style.borderLeft = "5px solid #d9534f";
                listring_element.style.transition = "0.3s ease-in-out";
                listring_element.style.color = "#fff";
                listring_element.addEventListener("mouseenter", () => {
                    listring_element.style.backgroundColor = "#23314d";
                });
                listring_element.addEventListener("mouseleave", () => {
                    listring_element.style.backgroundColor = "#363636";
                });
        
                listings_grid.appendChild(listring_element);
            }
        });
    }

    // Filter listings based on search
    function searchListings() {
        const search_term = search_input.value.toLowerCase();

        fetch("../json/listings.json")
            .then(response => response.json())
            .then(listings => {
                const filtered_listings = listings.filter(listing =>
                    listing.property_name.toLowerCase().includes(search_term)
                );
                displayListings(filtered_listings);
            })
            .catch(error => console.error("Error filtering listings:", error));
            filterListings();
    }

    function filterListings() {
        const search_term = document.getElementById("search_input").value.toLowerCase();
        const search_type = document.getElementById("search_type").value.toLowerCase(); // Get the search type filter value
        const workplace_type = document.getElementById("workplace_type").value;
        const lease_term = document.getElementById("lease_term").value;
        const has_parking = document.getElementById("has_parking").checked;
        const public_transport = document.getElementById("public_transport").checked;
        const price_range = document.getElementById("price_range").value;
        const capacity_range = document.getElementById("capacity_range").value;
    
        fetch("../json/listings.json")
            .then(response => response.json())
            .then(listings => {
                const filtered_listings = listings.filter(listing => {
                    // Apply search based on the selected search type
                    let matches_search = false;
    
                    if (search_type === "property_name") {
                        matches_Search = listing.property_name.toLowerCase().includes(search_term);
                    } else if (search_type === "location") {
                        matches_Search = listing.location.toLowerCase().includes(search_term);
                    } else if (search_type === "neighborhood") {
                        matches_Search = listing.neighborhood.toLowerCase().includes(search_term);
                    }
    
                    // Apply filters only if the filter is selected (non-default)
                    const matches_workplace_type = workplace_type ? listing.workplace_type === workplace_type : true;
                    const matches_lease_term = lease_term ? listing.lease_term === lease_term : true;
                    const matches_has_parking = has_parking !== false ? listing.has_parking === "yes" : true;
                    const matches_public_transport = public_transport !== false ? listing.public_transport === "yes" : true;
                    const matches_Price = price_range ? listing.price <= price_range : true;
                    const matches_Capacity = capacity_range ? listing.number_ppl <= capacity_range : true;
        
                    // Return true only if the listing matches all the selected filters
                    return (matches_Search || search_term === "") && matches_workplace_type && matches_lease_term &&
                        matches_has_parking && matches_public_transport && matches_Price && matches_Capacity;
                });
    
                displayListings(filtered_listings);
            })
            .catch(error => console.error("Error filtering listings:", error));
    }

    price_range.addEventListener("input", () => {
        price_range_value.textContent = `$${price_range.value}`;
    });

    capacity_range.addEventListener("input", () => {
        capacity_range_value.textContent = capacity_range.value;
    });

    search_button.addEventListener("click", searchListings);
    apply_filters_button.addEventListener("click", filterListings);

    fetchListings();
});
