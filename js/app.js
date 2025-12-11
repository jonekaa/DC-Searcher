// js/app.js (V4.1 - With Optimized Listeners)

// =================================================================
// SECTION 1: GLOBAL VARIABLES & STATE INITIALIZATION
// =================================================================

let searchButton,
    clearButton,
    clearComparisonButton,
    cityInput,
    radiusInput,
    durationInput,
    factoryList,
    listTitle,
    targetCitySpan,
    factoryCountSpan,
    errorMessage,
    initialMessage,
    suggestionsContainer,
    listSearchInput,
    map,
    markersLayer;

// State variables
let allFactories = [];
let activeSuggestionIndex = -1;
let lastDisplayedFactories = [];
let currentlyDisplayedOnRadar = [];
let comparisonList = [];
let activeRoutingControls = [];
let factoryMarkers = {};
let lastRadarData = { factories: [], searchLocation: null };
let routeWarnings = {};
let currentAvoidedList = []; // NEW: Store persisted avoided list

// =================================================================
// SECTION 2: DATA FETCHING (FROM FIREBASE)
// =================================================================

const fetchDataFromFirebase = async () => {
    try {
        console.log("Fetching data from Firebase...");
        const dcsSnapshot = await window.getDocs(window.collection(window.db, "dcs"));
        allFactories = dcsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("Data fetched successfully.");
    } catch (error) {
        console.error("Error fetching data from Firebase:", error);
        throw new Error("Could not load data from the database.");
    }
};

// =================================================================
// SECTION 3: MAIN APPLICATION LOGIC
// =================================================================

const findNearbyFactories = async () => {
    comparisonList = []; // Reset comparison on new search

    errorMessage.classList.add("hidden");
    const searchInput = cityInput.value.trim();
    if (!searchInput) {
        errorMessage.textContent = `Please enter a DC name to search for.`;
        errorMessage.classList.remove("hidden");
        return;
    }

    const lowercasedSearchInput = searchInput.toLowerCase();
    const searchFactory = allFactories.find(
        (f) =>
            f.name.toLowerCase() === lowercasedSearchInput ||
            f.name.toLowerCase().includes(lowercasedSearchInput) ||
            f.loc.toLowerCase() === lowercasedSearchInput ||
            f.loc.toLowerCase().includes(lowercasedSearchInput)
    );

    if (!searchFactory) {
        errorMessage.textContent = `Factory matching "${cityInput.value}" not found.`;
        errorMessage.classList.remove("hidden");
        return;
    }

    const searchLocation = { ...searchFactory };
    factoryList.innerHTML = '<p class="text-center text-gray-400 p-4">Searching...</p>';
    targetCitySpan.textContent = searchLocation.name;
    factoryCountSpan.textContent = `(0 results)`;

    let destinationsFromMatrix;
    try {
        const durationDocRef = window.doc(window.db, "durations", searchLocation.name);
        const durationDoc = await window.getDoc(durationDocRef);

        if (!durationDoc.exists()) {
            console.error(`Could not find a durations document matching '${searchLocation.name}'.`);
            errorMessage.textContent = `Route data for "${searchLocation.name}" not found.`;
            errorMessage.classList.remove("hidden");
            displayResults([], searchLocation, comparisonList, []);
            return;
        }

        destinationsFromMatrix = durationDoc.data().durations;
    } catch (error) {
        console.error("Error fetching duration document:", error);
        errorMessage.textContent = "Could not load route data for this DC.";
        errorMessage.classList.remove("hidden");
        factoryList.innerHTML = "";
        return;
    }

    const radiusValue = parseInt(radiusInput.value) || 0;
    const maxDurationMinutes = parseInputTimeToMinutes(durationInput.value.trim());

    const allMatrixRoutes = Object.keys(destinationsFromMatrix)
        .map((destinationName) => {
            const factoryData = allFactories.find((f) => f.name === destinationName);
            if (!factoryData) return null;
            const matrixEntry = destinationsFromMatrix[destinationName];
            return {
                ...factoryData,
                roadKm: matrixEntry.km,
                duration: matrixEntry.duration,
                durationMinutes: parseDurationToMinutes(matrixEntry.duration)
            };
        })
        .filter(Boolean);

    let filteredFactories = allMatrixRoutes;
    if (radiusValue > 0) {
        filteredFactories = filteredFactories.filter((factory) => parseInt(factory.roadKm) <= radiusValue);
    }
    if (maxDurationMinutes > 0) {
        filteredFactories = filteredFactories.filter((factory) => factory.durationMinutes <= maxDurationMinutes);
    }

    if (maxDurationMinutes > 0 && !(radiusValue > 0)) {
        listTitle.textContent = "Detailed List (Sorted by Duration)";
        filteredFactories.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else {
        listTitle.textContent = "Detailed List (Sorted by KM)";
        filteredFactories.sort((a, b) => parseInt(a.roadKm) - parseInt(b.roadKm));
    }

    lastDisplayedFactories = filteredFactories;
    currentlyDisplayedOnRadar = filteredFactories; // Init state

    // START: Fetch Avoided Destinations
    currentAvoidedList = []; // Reset before fetch
    try {
        const avoidedDocRef = window.doc(window.db, "avoided_destinations", searchLocation.name);
        const avoidedDoc = await window.getDoc(avoidedDocRef);
        if (avoidedDoc.exists()) {
            currentAvoidedList = avoidedDoc.data().avoid_list || [];
        }
    } catch (error) {
        console.warn("Could not fetch avoided destinations:", error);
        // We continue even if this fails, just without warnings
    }
    // END: Fetch Avoided Destinations

    setTimeout(() => displayResults(filteredFactories, searchLocation, comparisonList, currentAvoidedList), 300);
};

const updateMapFromSelection = () => {
    if (!lastRadarData.searchLocation) return;
    updateMapMarkers(lastDisplayedFactories, lastRadarData.searchLocation, comparisonList, currentAvoidedList);
};

const toggleComparison = (factoryId) => {
    const index = comparisonList.indexOf(factoryId);
    if (index > -1) {
        comparisonList.splice(index, 1); // Remove from list
    } else {
        comparisonList.push(factoryId); // Add to list
    }

    renderFactoryList(lastDisplayedFactories, comparisonList, currentAvoidedList);
    filterFactoryListDOM(listSearchInput.value);

    updateMapFromSelection();
};

// =================================================================
// SECTION 4: EVENT LISTENERS & INITIALIZATION
// =================================================================

function setupEventListeners() {
    searchButton.addEventListener("click", findNearbyFactories);

    clearButton.addEventListener("click", () => {
        cityInput.value = "";
        radiusInput.value = "";
        durationInput.value = "";
        listSearchInput.value = "";
        initialMessage.classList.remove("hidden");
        factoryList.innerHTML = "";
        factoryList.appendChild(initialMessage);
        targetCitySpan.textContent = "...";
        factoryCountSpan.textContent = "(0 results)";
        errorMessage.classList.add("hidden");
        if (markersLayer) markersLayer.clearLayers();
        if (activeRoutingControls.length > 0) {
            activeRoutingControls.forEach((control) => control.remove());
            activeRoutingControls = [];
        }
        lastRadarData = { factories: [], searchLocation: null };
        currentlyDisplayedOnRadar = [];
        lastDisplayedFactories = []; // Clear this state
        comparisonList = [];
        factoryMarkers = {}; // Clear markers
        cityInput.focus();
        renderAllDcsAsDots(allFactories);
    });

    clearComparisonButton.addEventListener("click", () => {
        comparisonList = [];
        renderFactoryList(lastDisplayedFactories, comparisonList, currentAvoidedList);
        filterFactoryListDOM(listSearchInput.value);
        updateMapFromSelection();
    });

    const handleCityInput = () => {
        const query = cityInput.value;
        const suggestions = getSuggestions(query);
        displaySuggestions(suggestions, query);
    };
    const debouncedCityInputHandler = debounce(handleCityInput, 250);
    cityInput.addEventListener("input", debouncedCityInputHandler);

    suggestionsContainer.addEventListener("click", (event) => {
        const item = event.target.closest(".suggestion-item");
        if (item) {
            cityInput.value = item.dataset.name;
            suggestionsContainer.classList.add("hidden");
            activeSuggestionIndex = -1;
            findNearbyFactories();
        }
    });

    cityInput.addEventListener("keydown", (event) => {
        const suggestionItems = suggestionsContainer.querySelectorAll(".suggestion-item");
        const isDropdownVisible = !suggestionsContainer.classList.contains("hidden");

        if (isDropdownVisible && suggestionItems.length > 0) {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                if (activeSuggestionIndex > -1) {
                    suggestionItems[activeSuggestionIndex].classList.remove("suggestion-active");
                }
                if (event.key === "ArrowDown") {
                    activeSuggestionIndex++;
                    if (activeSuggestionIndex >= suggestionItems.length) activeSuggestionIndex = 0;
                } else {
                    activeSuggestionIndex--;
                    if (activeSuggestionIndex < 0) activeSuggestionIndex = suggestionItems.length - 1;
                }
                const newActiveItem = suggestionItems[activeSuggestionIndex];
                newActiveItem.classList.add("suggestion-active");
                newActiveItem.scrollIntoView({ block: "nearest" });
            } else if (event.key === "Enter") {
                event.preventDefault();
                if (activeSuggestionIndex > -1) {
                    suggestionItems[activeSuggestionIndex].click();
                } else {
                    findNearbyFactories();
                    suggestionsContainer.classList.add("hidden");
                }
            } else if (event.key === "Escape") {
                suggestionsContainer.classList.add("hidden");
                activeSuggestionIndex = -1;
            }
        } else if (event.key === "Enter") {
            findNearbyFactories();
        }
    });

    document.addEventListener("click", (event) => {
        if (!cityInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
            suggestionsContainer.classList.add("hidden");
        }
    });

    factoryList.addEventListener("click", (event) => {
        const card = event.target.closest(".factory-card");
        if (!card) return;

        const factoryId = parseInt(card.dataset.id);
        if (isNaN(factoryId)) return;

        // Check if the click was on the checkbox itself
        if (event.target.type === "checkbox") {
            toggleComparison(factoryId);
            return; // Let the checkbox handle its state
        }

        // Check if the card is hidden (due to search filtering in the list)
        const isDisabled = card.classList.contains("hidden");
        if (isDisabled) return; // Don't toggle hidden cards

        // If clicking the card area (not the checkbox), toggle it
        toggleComparison(factoryId);
    });

    listSearchInput.addEventListener("input", () => {
        const query = listSearchInput.value;

        // 1. Filter the DOM List (fast)
        // (This function is in ui.js)
        filterFactoryListDOM(query);

        // 2. Filter the Map Markers (fast)
        // (This function is in ui.js)
        filterMapMarkers(query);
    });

    radiusInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") findNearbyFactories();
    });
    durationInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") findNearbyFactories();
    });
}

document.addEventListener("firebaseReady", async () => {
    console.log("Firebase is ready. Initializing application v4.1.");
    try {
        // Select all DOM elements
        searchButton = document.getElementById("search-button");
        clearButton = document.getElementById("clear-button");
        clearComparisonButton = document.getElementById("clear-comparison-button");
        cityInput = document.getElementById("city-input");
        radiusInput = document.getElementById("radius-input");
        durationInput = document.getElementById("duration-input");
        factoryList = document.getElementById("factory-list");
        listTitle = document.getElementById("list-title");
        targetCitySpan = document.getElementById("target-city");
        factoryCountSpan = document.getElementById("factory-count");
        errorMessage = document.getElementById("error-message");
        initialMessage = document.getElementById("initial-message");
        suggestionsContainer = document.getElementById("suggestions-container");
        listSearchInput = document.getElementById("list-search-input");

        window.getComparisonList = () => comparisonList;
        window.getLastDisplayedFactories = () => lastDisplayedFactories; // <-- ADDED THIS
        window.handleMarkerClick = toggleComparison; // For ui.js to call
        window.runSearchFrom = (dcName) => {
            cityInput.value = dcName;
            findNearbyFactories();
        };

        // Fetch data first
        await fetchDataFromFirebase();

        // Then initialize the map and event listeners
        initMap();

        if (allFactories.length > 0) {
            renderAllDcsAsDots(allFactories); // Call the new UI function
        }

        setupEventListeners();

        // Hide loading screen and enable the app
        document.getElementById("loading-screen").style.display = "none";
        searchButton.disabled = false;
    } catch (error) {
        console.error("❌ CRITICAL ERROR DURING INITIALIZATION:", error);
        document.getElementById("loading-screen").innerHTML =
            `<p class="text-red-500 font-bold">Application failed to start!</p>`;
    }
});
