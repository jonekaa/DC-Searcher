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

const updateMapMarkers = (factories, searchLocation, comparisonList, avoidedList = []) => {
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

        // Check avoided status
        const avoidedItem = avoidedList.find(item => item.target === factory.name);

        // Add routes only for checked items
        if (isChecked) {
            let routeColor = getComparisonColor(factory.id) || "#3388ff";
            let lineStyles = [{ color: routeColor, opacity: 1, weight: 5 }];

            // Override color and style if avoided route
            if (avoidedItem) {
                lineStyles = [{ color: "#dc2626", opacity: 0.95, weight: 6, dashArray: "10, 8" }];
            }

            const control = L.Routing.control({
                waypoints: [L.latLng(searchLocation.lat, searchLocation.lon), L.latLng(factory.lat, factory.lon)],
                routeWhileDragging: false,
                addWaypoints: false,
                draggableWaypoints: false,
                show: false,
                lineOptions: { styles: lineStyles }
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
        let popupWarning = "";
        if (avoidedItem) {
            popupWarning = `
                <div style="background-color: #fee2e2; color: #991b1b; padding: 4px; border-radius: 4px; margin-bottom: 4px; font-weight: bold; font-size: 0.8em; text-align: center;">
                    ⚠️ AVOID: ${avoidedItem.reason}
                </div>
            `;
        }

        const foodDemand = Number(factory.fpallet) || 0;
        const foodCap = Number(factory.fpalletcap) || 0;
        const foodCapText = foodCap > 0 ? `${foodCap.toLocaleString()} pallets` : "N/A";

        const nfDemand = Number(factory.nfpallet) || 0;
        const nfCap = Number(factory.nfpalletcap) || 0;
        const nfCapText = nfCap > 0 ? `${nfCap.toLocaleString()} pallets` : "N/A";

        const popupContent = `
            ${popupWarning}
            <b>${factory.name}</b><br>
            <span style="color: #047857; font-weight: bold;">${factory.roadKm}</span> (${factory.duration})
            <hr style="margin: 6px 0; border-color: #e5e7eb;">
            <div style="font-size: 11px; line-height: 1.45; min-width: 175px;">
                <!-- Food Pallet List -->
                <div style="margin-bottom: 6px; padding: 6px 8px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; font-weight: 600; color: #111827; margin-bottom: 4px; font-size: 11px; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px;">
                        <span>Food Pallet</span>
                        <span style="font-size: 9px; font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;">Daily Specs</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 2px; color: #4b5563;">
                        <span>Daily Demand:</span>
                        <b style="color: #111827;">${foodDemand.toLocaleString()} pallets</b>
                    </div>
                    <div style="display: flex; justify-content: space-between; color: #4b5563;">
                        <span>Capacity:</span>
                        <span style="font-weight: 600; color: #111827;">${foodCapText}</span>
                    </div>
                </div>

                <!-- Non-Food Pallet List -->
                <div style="padding: 6px 8px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; font-weight: 600; color: #111827; margin-bottom: 4px; font-size: 11px; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px;">
                        <span>Non-Food Pallet</span>
                        <span style="font-size: 9px; font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;">Daily Specs</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 2px; color: #4b5563;">
                        <span>Daily Demand:</span>
                        <b style="color: #111827;">${nfDemand.toLocaleString()} pallets</b>
                    </div>
                    <div style="display: flex; justify-content: space-between; color: #4b5563;">
                        <span>Capacity:</span>
                        <span style="font-weight: 600; color: #111827;">${nfCapText}</span>
                    </div>
                </div>
            </div>
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

const renderFactoryList = (factoriesToRender, comparisonList, avoidedList = []) => {
    factoryList.innerHTML = "";
    if (factoriesToRender.length === 0) {
        factoryList.innerHTML = `<p class="text-gray-500 italic p-4 text-center">No results match your filter.</p>`;
        updateComparisonDrawer(factoriesToRender, comparisonList, avoidedList);
        return;
    }

    const isComparing = comparisonList.length > 0;

    factoriesToRender.forEach((factory) => {
        const routeColor = getComparisonColor(factory.id);
        factoryList.appendChild(createFactoryCard(factory, comparisonList, routeColor, isComparing, avoidedList));
    });

    updateComparisonDrawer(factoriesToRender, comparisonList, avoidedList);
};

const createFactoryCard = (factory, comparisonList, routeColor, isComparing, avoidedList = []) => {
    const card = document.createElement("div");

    const distanceHtml =
        factory.roadKm && factory.duration
            ? `<p class="text-base font-bold text-emerald-800">${factory.roadKm}</p><p class="text-xs text-gray-500 font-medium">${factory.duration}</p>`
            : `<p class="text-sm font-semibold text-gray-600">Distance N/A</p>`;

    const isCheckedBool = comparisonList.includes(factory.id);
    const isChecked = isCheckedBool ? "checked" : "";

    card.className = "factory-card bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-emerald-300 transition w-full";
    card.dataset.id = factory.id;
    if (isCheckedBool && routeColor) {
        card.style.borderLeft = `4px solid ${routeColor}`;
    } else {
        card.style.borderLeft = "4px solid transparent";
    }

    const checkboxStyle = routeColor ? `style="accent-color: ${routeColor};"` : "";

    const avoidedItem = avoidedList.find((item) => item.target === factory.name);
    let warningHtml = "";
    if (avoidedItem) {
        warningHtml = `
            <div class="mt-2.5 p-2 bg-red-50 border border-red-200 text-red-800 rounded-md text-xs font-semibold flex items-start gap-1.5 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                    <span class="font-bold">Avoided Route</span>
                    <span class="font-normal text-red-700 ml-1">— Reason: ${avoidedItem.reason}</span>
                </div>
            </div>
        `;
    }

    const foodDemand = Number(factory.fpallet) || 0;
    const foodCap = Number(factory.fpalletcap) || 0;
    const foodCapFormatted = foodCap > 0
        ? `${foodCap.toLocaleString()} <span class="text-[10px] font-normal text-gray-500">pallets</span>`
        : `<span class="text-gray-400 font-normal">N/A</span>`;

    const nfDemand = Number(factory.nfpallet) || 0;
    const nfCap = Number(factory.nfpalletcap) || 0;
    const nfCapFormatted = nfCap > 0
        ? `${nfCap.toLocaleString()} <span class="text-[10px] font-normal text-gray-500">pallets</span>`
        : `<span class="text-gray-400 font-normal">N/A</span>`;

    card.innerHTML = `
        <div class="flex items-start gap-3 w-full">
            <input type="checkbox" data-id="${factory.id}" aria-label="Select ${factory.name} for route comparison" class="h-5 w-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0" ${isChecked} ${checkboxStyle}>
            
            <div class="flex-grow min-w-0 cursor-pointer factory-card-body">
                <!-- Top Row: DC Name + Loc ID (left) and Distance + Action (right) -->
                <div class="flex justify-between items-start gap-2.5">
                    <div class="min-w-0 flex-grow pr-1">
                        <p class="text-base font-semibold text-gray-900 leading-tight truncate pointer-events-none">${factory.name}</p>
                        <p class="text-xs text-gray-500 mt-0.5 pointer-events-none">${factory.loc || "Loc ID: N/A"}</p>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0">
                        <div class="text-right pointer-events-none">
                            ${distanceHtml}
                        </div>
                        <!-- Search from here button -->
                        <button class="search-from-here-btn p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition" aria-label="Search routes originating from ${factory.name}" title="Search from ${factory.name}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Pallets: Daily Demand and Capacity Lists -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-gray-100 w-full pointer-events-none">
                    <!-- Food Pallet List Box -->
                    <div class="bg-gray-50/80 p-2.5 rounded-lg border border-gray-200">
                        <div class="flex items-center justify-between pb-1.5 mb-1.5 border-b border-gray-200">
                            <span class="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                                Food Pallet
                            </span>
                            <span class="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Demand / Cap</span>
                        </div>
                        <ul class="space-y-1 text-xs">
                            <li class="flex justify-between items-baseline">
                                <span class="text-gray-500 font-normal">Daily Demand</span>
                                <span class="font-semibold text-gray-900 tabular-nums">${foodDemand.toLocaleString()} <span class="text-[10px] font-normal text-gray-500">pallets</span></span>
                            </li>
                            <li class="flex justify-between items-baseline">
                                <span class="text-gray-500 font-normal">Capacity</span>
                                <span class="font-semibold text-gray-900 tabular-nums">${foodCapFormatted}</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Non-Food Pallet List Box -->
                    <div class="bg-gray-50/80 p-2.5 rounded-lg border border-gray-200">
                        <div class="flex items-center justify-between pb-1.5 mb-1.5 border-b border-gray-200">
                            <span class="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
                                Non-Food Pallet
                            </span>
                            <span class="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Demand / Cap</span>
                        </div>
                        <ul class="space-y-1 text-xs">
                            <li class="flex justify-between items-baseline">
                                <span class="text-gray-500 font-normal">Daily Demand</span>
                                <span class="font-semibold text-gray-900 tabular-nums">${nfDemand.toLocaleString()} <span class="text-[10px] font-normal text-gray-500">pallets</span></span>
                            </li>
                            <li class="flex justify-between items-baseline">
                                <span class="text-gray-500 font-normal">Capacity</span>
                                <span class="font-semibold text-gray-900 tabular-nums">${nfCapFormatted}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                ${warningHtml}
            </div>
        </div>
    `;

    card.addEventListener("mouseover", () => {
        if (factoryMarkers[factory.id]) {
            factoryMarkers[factory.id].openPopup();
        }
        card.classList.add("bg-emerald-50/40");
    });

    card.addEventListener("mouseout", () => {
        const isChecked = window.getComparisonList && window.getComparisonList().includes(factory.id);
        if (!isChecked && factoryMarkers[factory.id]) {
            factoryMarkers[factory.id].closePopup();
        }
        card.classList.remove("bg-emerald-50/40");
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
        const highlightedName = factory.name.replace(highlightRegex, '<strong class="text-emerald-700 font-bold">$1</strong>');
        const highlightedLoc = factory.loc.replace(highlightRegex, '<strong class="text-emerald-700 font-bold">$1</strong>');
        suggestionItem.innerHTML = `<p class="font-semibold text-gray-800 pointer-events-none">${highlightedName}</p><p class="text-sm text-gray-500 pointer-events-none">${highlightedLoc}</p>`;
        suggestionsContainer.appendChild(suggestionItem);
    });
    suggestionsContainer.classList.remove("hidden");
};

const displayResults = (foundFactories, searchLocation, comparisonList, avoidedList = []) => {
    initialMessage.classList.add("hidden");
    targetCitySpan.textContent = searchLocation.name;
    factoryCountSpan.textContent = `(${foundFactories.length} results)`;

    lastDisplayedFactories = foundFactories;
    currentlyDisplayedOnRadar = foundFactories;
    listSearchInput.value = "";

    if (foundFactories.length > 0) {
        lastRadarData = { factories: foundFactories, searchLocation };
        updateMapMarkers(foundFactories, searchLocation, comparisonList, avoidedList);
        renderFactoryList(foundFactories, comparisonList, avoidedList);
    } else {
        lastRadarData = { factories: [], searchLocation: null };
        currentlyDisplayedOnRadar = [];
        if (markersLayer) markersLayer.clearLayers();
        factoryList.innerHTML = `<p class="text-gray-500 p-4 border border-dashed border-gray-300 rounded-lg text-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>No distribution center routes match your filter criteria.</p>`;
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

    // Add a temporary subtle highlight (emerald)
    card.classList.add("bg-emerald-50", "ring-2", "ring-emerald-500");

    // Remove the highlight after a short duration
    setTimeout(() => {
        card.classList.remove("bg-emerald-50", "ring-2", "ring-emerald-500");
    }, 1500);
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

/**
 * Comparison drawer removed per design requirements.
 * Maintained as a no-op for backward compatibility.
 */
const updateComparisonDrawer = () => {
    // No-op: floating comparison drawer removed.
};