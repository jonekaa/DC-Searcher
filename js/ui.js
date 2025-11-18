// js/ui.js (V4.2 - With Pallet Info)

const comparisonColors = ["#3388ff", "#800080", "#008000", "#ff8c00", "#e30022", "#00ced1"]; // Blue, Purple, Green, Orange, Red, DarkTurquoise
const getComparisonColor = (factoryId) => {
    const currentComparisonList = (window.getComparisonList && window.getComparisonList()) || [];
    if (!currentComparisonList) return null; // Safety check
    const index = currentComparisonList.indexOf(factoryId);
    if (index === -1) return null;
    return comparisonColors[index % comparisonColors.length];
};

const initMap = () => {
    map = L.map("map").setView([-2.5489, 118.0149], 5); // Centered on Indonesia
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    markersLayer = L.layerGroup().addTo(map);
};

const updateMapMarkers = (factories, searchLocation, comparisonList) => {
    markersLayer.clearLayers();

    if (activeRoutingControls.length > 0) {
        activeRoutingControls.forEach((control) => control.remove());
        activeRoutingControls = [];
    }

    factoryMarkers = {};

    if (!searchLocation) return;

    const bounds = [];
    const isComparing = comparisonList.length > 0;

    const searchMarker = L.marker([searchLocation.lat, searchLocation.lon], {
        icon: L.icon({
            iconUrl:
                "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).addTo(markersLayer);

    searchMarker.bindPopup(`<b>Start: ${searchLocation.name}</b>`);
    if (!isComparing) {
        searchMarker.openPopup();
    }

    bounds.push([searchLocation.lat, searchLocation.lon]);

    searchMarker.on("mouseover", () => {
        searchMarker.openPopup();
    });

    searchMarker.on("mouseout", () => {
        searchMarker.closePopup();
    });

    factories.forEach((factory) => {
        if (isComparing && !comparisonList.includes(factory.id)) {
            return; // Skip this factory if it's not checked during comparison
        }

        const isChecked = comparisonList.includes(factory.id);

        let iconUrl;
        iconUrl = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png";

        // Add routes only for checked items
        if (isChecked) {
            const routeColor = getComparisonColor(factory.id) || "#3388ff";
            const control = L.Routing.control({
                waypoints: [L.latLng(searchLocation.lat, searchLocation.lon), L.latLng(factory.lat, factory.lon)],
                routeWhileDragging: false,
                addWaypoints: false,
                draggableWaypoints: false,
                show: false,
                lineOptions: { styles: [{ color: routeColor, opacity: 1, weight: 5 }] }
            }).addTo(map);
            activeRoutingControls.push(control);
        }

        const marker = L.marker([factory.lat, factory.lon], {
            icon: L.icon({
                iconUrl: iconUrl,
                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(markersLayer);

        // START: UPDATED POPUP CONTENT
        const popupContent = `
            <b>${factory.name}</b><br>
            ${factory.roadKm} (${factory.duration})
            <hr style="margin: 4px 0;">
            <small>Food: ${factory.fpallet || 0} / ${factory.fpalletcap || 0}</small><br>
            <small>Non-Food: ${factory.nfpallet || 0} / ${factory.nfpalletcap || 0}</small>
        `;
        marker.bindPopup(popupContent);
        // END: UPDATED POPUP CONTENT

        if (isChecked) {
            marker.openPopup();
        }

        // Marker hover event
        marker.on("mouseover", () => {
            marker.openPopup();
        });

        marker.on("mouseout", () => {
            if (!isChecked) {
                // Only close if it's not a checked item
                marker.closePopup();
            }
        });

        marker.on("click", () => {
            window.handleMarkerClick(factory.id);
            scrollCardIntoView(factory.id);
        });

        bounds.push([factory.lat, factory.lon]);
        factoryMarkers[factory.id] = marker;
    });

    if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
    }
};

const renderFactoryList = (factoriesToRender, comparisonList) => {
    factoryList.innerHTML = "";
    if (factoriesToRender.length === 0) {
        factoryList.innerHTML = `<p class="text-gray-500 italic p-4 text-center">No results match your filter.</p>`;
        return;
    }

    const isComparing = comparisonList.length > 0;

    factoriesToRender.forEach((factory) => {
        const routeColor = getComparisonColor(factory.id);
        factoryList.appendChild(createFactoryCard(factory, comparisonList, routeColor, isComparing));
    });
};

const createFactoryCard = (factory, comparisonList, routeColor, isComparing) => {
    const card = document.createElement("div");

    const distanceHtml =
        factory.roadKm && factory.duration
            ? `<p class="text-lg font-bold text-emerald-600">${factory.roadKm}</p><p class="text-xs text-gray-500">Duration: ${factory.duration}</p>`
            : `<p class="text-lg font-bold text-gray-400">N/A</p>`;

    const isCheckedBool = comparisonList.includes(factory.id);
    const isChecked = isCheckedBool ? "checked" : "";

    card.className = "factory-card bg-white p-4 rounded-lg shadow-sm flex items-center gap-x-3";
    card.dataset.id = factory.id;

    const clickableAreaClasses = ["flex-grow", "flex", "justify-between", "items-start", "cursor-pointer"];
    const checkboxStyle = routeColor ? `style="accent-color: ${routeColor};"` : "";

    // START: UPDATED CARD HTML
    card.innerHTML = `
        <input type="checkbox" data-id="${factory.id}" class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer mr-2 flex-shrink-0" ${isChecked} ${checkboxStyle}>
        <div class="${clickableAreaClasses.join(" ")}">
            <div>
                <p class="text-base font-semibold text-gray-900 pointer-events-none">${factory.name}</p>
                <p class="text-sm text-gray-500 pointer-events-none">${factory.loc}</p>
                <div class="text-xs text-gray-500 mt-1 pointer-events-none">
                    Food: <span class="font-medium">${factory.fpallet || 0}</span> / ${factory.fpalletcap || 0}  
                    <br>Non-Food: <span class="font-medium">${factory.nfpallet || 0}</span> / ${factory.nfpalletcap || 0}
                </div>
            </div>
            <div class="text-right flex-shrink-0 ml-4 pointer-events-none">
                ${distanceHtml}
            </div>
        </div>
	 <button class="search-from-here-btn p-2 text-gray-400 hover:text-blue-600" title="Search from ${factory.name}">
        	<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            		<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        	</svg>
    	 </button>
    `;
    // END: UPDATED CARD HTML

    const clickableArea = card;
    card.addEventListener("mouseover", () => {
        const clickableArea = card.querySelector("div.flex-grow");

        if (factoryMarkers[factory.id]) {
            factoryMarkers[factory.id].openPopup();
        }
        card.classList.add("bg-red-50");
    });

    card.addEventListener("mouseout", () => {
        const isChecked = window.getComparisonList && window.getComparisonList().includes(factory.id);
        if (!isChecked && factoryMarkers[factory.id]) {
            factoryMarkers[factory.id].closePopup();
        }
        card.classList.remove("bg-red-50");
    });

    card.querySelector(".search-from-here-btn").addEventListener("click", (e) => {
        e.stopPropagation(); // Stop the click from toggling the checkbox
        if (window.runSearchFrom) {
            window.runSearchFrom(factory.name);
        }
    });

    return card;
};

const displaySuggestions = (suggestions, query) => {
    suggestionsContainer.innerHTML = "";
    activeSuggestionIndex = -1;
    if (suggestions.length === 0 || !query) {
        suggestionsContainer.classList.add("hidden");
        return;
    }
    const escapedQuery = escapeRegex(query);
    const highlightRegex = new RegExp(`(${escapedQuery})`, "gi");
    suggestions.forEach((factory) => {
        const suggestionItem = document.createElement("div");
        suggestionItem.className = "p-3 hover:bg-emerald-50 cursor-pointer suggestion-item";
        suggestionItem.dataset.name = factory.name;
        const highlightedName = factory.name.replace(highlightRegex, '<strong class="text-red-500">$1</strong>');
        const highlightedLoc = factory.loc.replace(highlightRegex, '<strong class="text-red-500">$1</strong>');
        suggestionItem.innerHTML = `<p class="font-semibold text-gray-800 pointer-events-none">${highlightedName}</p><p class="text-sm text-gray-500 pointer-events-none">${highlightedLoc}</p>`;
        suggestionsContainer.appendChild(suggestionItem);
    });
    suggestionsContainer.classList.remove("hidden");
};

const displayResults = (foundFactories, searchLocation, comparisonList) => {
    initialMessage.classList.add("hidden");
    targetCitySpan.textContent = searchLocation.name;
    factoryCountSpan.textContent = `(${foundFactories.length} results)`;

    lastDisplayedFactories = foundFactories;
    currentlyDisplayedOnRadar = foundFactories;
    listSearchInput.value = "";

    if (foundFactories.length > 0) {
        lastRadarData = { factories: foundFactories, searchLocation };
        updateMapMarkers(foundFactories, searchLocation, comparisonList);
        renderFactoryList(foundFactories, comparisonList);
    } else {
        lastRadarData = { factories: [], searchLocation: null };
        currentlyDisplayedOnRadar = [];
        if (markersLayer) markersLayer.clearLayers();
        factoryList.innerHTML = `<p class="text-gray-500 p-4 border border-dashed border-gray-300 rounded-lg text-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>No routes found matching your filter criteria.</p>`;
    }
};

// =================================================================
// SECTION: NEW OPTIMIZATION FUNCTIONS
// =================================================================

/**
 * --- NEW FUNCTION ---
 * Finds the card in the list and scrolls it into view with a highlight.
 * @param {number} factoryId The ID of the factory card to scroll to.
 */
const scrollCardIntoView = (factoryId) => {
    // Note: 'factoryList' is the global variable defined in app.js
    if (!factoryList) return;

    const card = factoryList.querySelector(`.factory-card[data-id="${factoryId}"]`);
    if (!card) {
        console.warn(`Card with ID ${factoryId} not found in the list.`);
        return;
    }

    // Scroll the card into view
    card.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    // Add a temporary highlight
    card.style.transition = "outline 0.3s ease-out";
    card.classList.add("bg-red-50");

    // Remove the highlight after a short duration
    setTimeout(() => {
        card.style.outline = "none";
    }, 1200);
};

/**
 * Filters the factory list DOM by toggling the 'hidden' class
 * instead of rebuilding the HTML.
 * @param {string} query The search query.
 */
const filterFactoryListDOM = (query) => {
    const lowerQuery = query.toLowerCase().trim();
    const cards = factoryList.querySelectorAll(".factory-card");

    if (cards.length === 0) return; // No list to filter

    let visibleCount = 0;
    cards.forEach((card) => {
        const nameEl = card.querySelector("p.font-semibold");
        const locEl = card.querySelector("p.text-sm");

        if (!nameEl || !locEl) return; // Safety check

        const name = nameEl.textContent.toLowerCase();
        const loc = locEl.textContent.toLowerCase();

        if (name.includes(lowerQuery) || loc.includes(lowerQuery)) {
            card.classList.remove("hidden");
            visibleCount++;
        } else {
            card.classList.add("hidden");
        }
    });
};

/**
 * Filters map markers by showing/hiding them based on a query.
 * This does NOT affect routes or already-compared items.
 * @param {string} query The search query.
 */
const filterMapMarkers = (query) => {
    const lowerQuery = query.toLowerCase().trim();

    // Get the global state we need
    const comparisonList = (window.getComparisonList && window.getComparisonList()) || [];
    const lastDisplayedFactories = (window.getLastDisplayedFactories && window.getLastDisplayedFactories()) || [];

    for (const factoryId in factoryMarkers) {
        const marker = factoryMarkers[factoryId];
        const factory = lastDisplayedFactories.find((f) => f.id === parseInt(factoryId));

        if (!factory) continue;

        // --- This is the key logic ---
        // 1. If the marker is in the comparison list, ALWAYS show it.
        if (comparisonList.includes(factory.id)) {
            marker.addTo(markersLayer);
            continue;
        }

        // 2. If it's not compared, check if it matches the filter
        const name = factory.name.toLowerCase();
        const loc = factory.loc.toLowerCase();

        if (name.includes(lowerQuery) || loc.includes(lowerQuery)) {
            marker.addTo(markersLayer); // Show it
        } else {
            marker.remove(); // Hide it
        }
    }
};

// --- Add this new function to ui.js ---
const renderAllDcsAsDots = (factories) => {
    if (markersLayer) markersLayer.clearLayers();
    factoryMarkers = {};
    const bounds = [];

    factories.forEach((factory) => {
        const marker = L.marker([factory.lat, factory.lon], {
            icon: L.icon({
                iconUrl:
                    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(markersLayer);

        marker.bindPopup(`<b>${factory.name}</b><br>${factory.loc}`);
        bounds.push([factory.lat, factory.lon]);
        factoryMarkers[factory.id] = marker;

        // Marker hover event
        marker.on("mouseover", () => {
            marker.openPopup();
        });

        marker.on("mouseout", () => {
            marker.closePopup();
        });

        // Add click listener to run a search from this marker
        marker.on("click", () => {
            if (window.runSearchFrom) {
                window.runSearchFrom(factory.name);
            }
        });
    });

    if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
    }
};