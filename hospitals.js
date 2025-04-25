let map;
let userMarker;
let markers = [];

// Initialize map when page loads
window.addEventListener('load', () => {
    initializeMap();
});

function initializeMap() {
    try {
        // Check if map container exists
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }

        // Create map centered on India
        map = L.map('map', {
            center: [20.5937, 78.9629],
            zoom: 5,
            minZoom: 3,
            maxZoom: 18
        });

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add event listeners
        const locationBtn = document.querySelector('.location-btn');
        const searchBtn = document.querySelector('.search-btn');
        const searchInput = document.getElementById('location-search');

        if (locationBtn) locationBtn.addEventListener('click', getUserLocation);
        if (searchBtn) searchBtn.addEventListener('click', searchNearbyPlaces);
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchNearbyPlaces();
                }
            });
        }

        // Hide loading spinner if it's visible
        hideLoadingSpinner();
        
        console.log('Map initialized successfully');
    } catch (error) {
        console.error('Error initializing map:', error);
        alert('Error initializing map. Please try refreshing the page.');
    }
}

// Get user's location
function getUserLocation() {
    if (!map) {
        console.error('Map not initialized');
        return;
    }

    if (navigator.geolocation) {
        showLoadingSpinner();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = [position.coords.latitude, position.coords.longitude];
                updateUserLocation(userLocation);
                searchNearbyPlaces();
                hideLoadingSpinner();
            },
            (error) => {
                console.error('Geolocation error:', error);
                hideLoadingSpinner();
                alert('Could not get your location. Please check your browser settings.');
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

// Update user location on map
function updateUserLocation(location) {
    if (!map) return;

    // Remove existing user marker
    if (userMarker) {
        map.removeLayer(userMarker);
    }

    // Create custom icon for user location
    const userIcon = L.divIcon({
        className: 'user-marker',
        html: '<div class="user-marker-inner"></div>',
        iconSize: [20, 20]
    });

    // Add new user marker
    userMarker = L.marker(location, {
        icon: userIcon,
        zIndexOffset: 1000
    }).addTo(map);

    // Center map on user location with animation
    map.setView(location, 14, {
        animate: true,
        duration: 1
    });
}

// Search for nearby places
function searchNearbyPlaces() {
    if (!map) {
        console.error('Map not initialized');
        return;
    }

    const searchInput = document.getElementById('location-search').value;
    const facilityType = document.getElementById('facility-type').value;
    const radius = document.getElementById('search-radius').value;

    showLoadingSpinner();

    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // If search input is provided, geocode it
    if (searchInput) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}, India`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const location = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                    updateUserLocation(location);
                    searchHealthcareFacilities(location, radius, facilityType);
                } else {
                    hideLoadingSpinner();
                    alert('Location not found. Please try a different search.');
                }
            })
            .catch(error => {
                console.error('Error searching location:', error);
                hideLoadingSpinner();
                alert('Error searching location. Please try again.');
            });
    } else if (userMarker) {
        // Use current user location
        const location = userMarker.getLatLng();
        searchHealthcareFacilities([location.lat, location.lng], radius, facilityType);
    } else {
        hideLoadingSpinner();
        alert('Please enter a location or use your current location.');
    }
}

// Search for healthcare facilities using OpenStreetMap
function searchHealthcareFacilities(location, radius, facilityType) {
    const query = `
    [out:json][timeout:25];
    (
        node["amenity"="${facilityType}"]
            (around:${radius * 1000},${location[0]},${location[1]});
    );
    out body;
    >;
    out skel qt;
    `;

    fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
    })
        .then(response => response.json())
        .then(data => {
            hideLoadingSpinner();
            if (data.elements && data.elements.length > 0) {
                displayResults(data.elements);
            } else {
                document.querySelector('.results-list').innerHTML = 
                    '<p class="no-results">No healthcare facilities found in this area.</p>';
            }
        })
        .catch(error => {
            console.error('Error searching facilities:', error);
            hideLoadingSpinner();
            alert('Error searching for healthcare facilities. Please try again.');
        });
}

// Display results on map and in list
function displayResults(facilities) {
    if (!map || !userMarker) return;

    const resultsList = document.querySelector('.results-list');
    resultsList.innerHTML = `<h3>Found ${facilities.length} Results</h3>`;

    facilities.forEach(facility => {
        if (!facility.lat || !facility.lon) return;

        // Create marker
        const marker = L.marker([facility.lat, facility.lon])
            .bindPopup(`
                <div class="popup-content">
                    <h4>${facility.tags.name || 'Healthcare Facility'}</h4>
                    <p>${facility.tags.address || ''}</p>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lon}" 
                       target="_blank">Get Directions</a>
                </div>
            `)
            .addTo(map);

        markers.push(marker);

        // Create list item
        const card = document.createElement('div');
        card.className = 'facility-card';
        card.innerHTML = `
            <h4 class="facility-name">${facility.tags.name || 'Healthcare Facility'}</h4>
            <p class="facility-address">${facility.tags.address || 'Address not available'}</p>
            <div class="facility-details">
                <span>${calculateDistance(
                    userMarker.getLatLng().lat,
                    userMarker.getLatLng().lng,
                    facility.lat,
                    facility.lon
                ).toFixed(1)} km away</span>
            </div>
        `;

        card.addEventListener('click', () => {
            map.setView([facility.lat, facility.lon], 16);
            marker.openPopup();
        });

        resultsList.appendChild(card);
    });

    // Fit map bounds to show all markers
    if (markers.length > 0) {
        const bounds = L.latLngBounds([userMarker.getLatLng()]);
        markers.forEach(marker => bounds.extend(marker.getLatLng()));
        map.fitBounds(bounds, { 
            padding: [50, 50],
            maxZoom: 15
        });
    }
}

// Calculate distance between two points in kilometers
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Loading spinner functions
function showLoadingSpinner() {
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) spinner.style.display = 'flex';
}

function hideLoadingSpinner() {
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) spinner.style.display = 'none';
} 