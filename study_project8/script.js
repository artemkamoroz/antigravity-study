const amountInput = document.getElementById("amount");
const fromDropdown = document.getElementById("from-dropdown");
const toDropdown = document.getElementById("to-dropdown");
const convertBtn = document.getElementById("convert-btn");
const resultRate = document.getElementById("exchange-rate");
const resultAmount = document.getElementById("final-amount");
const tickerContent = document.getElementById("ticker-content");
const swapIcon = document.querySelector(".swap-icon");

// Refs for internal lists and triggers
const fromSelected = fromDropdown.querySelector(".selected-option");
const fromList = fromDropdown.querySelector(".options-list");
const toSelected = toDropdown.querySelector(".selected-option");
const toList = toDropdown.querySelector(".options-list");

let cryptoData = [];
// Current selected IDs (defaults)
let fromId = "bitcoin";
let fromSymbol = "BTC";
let toId = "usd";
let toSymbol = "USD";

// Fallback Data (in case API is down/slow)
const fallbackData = [
    { id: "bitcoin", symbol: "btc", name: "Bitcoin", current_price: 64230.50, image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png", price_change_percentage_24h: 2.5 },
    { id: "ethereum", symbol: "eth", name: "Ethereum", current_price: 3450.12, image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png", price_change_percentage_24h: 1.2 },
    { id: "tether", symbol: "usdt", name: "Tether", current_price: 1.00, image: "https://assets.coingecko.com/coins/images/325/large/Tether.png", price_change_percentage_24h: 0.01 },
    { id: "binancecoin", symbol: "bnb", name: "BNB", current_price: 590.20, image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png", price_change_percentage_24h: -0.5 },
    { id: "solana", symbol: "sol", name: "Solana", current_price: 145.60, image: "https://assets.coingecko.com/coins/images/4128/large/solana.png", price_change_percentage_24h: 5.4 },
    { id: "ripple", symbol: "xrp", name: "XRP", current_price: 0.62, image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png", price_change_percentage_24h: 0.8 },
    { id: "dogecoin", symbol: "doge", name: "Dogecoin", current_price: 0.16, image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png", price_change_percentage_24h: 8.1 },
    { id: "cardano", symbol: "ada", name: "Cardano", current_price: 0.45, image: "https://assets.coingecko.com/coins/images/975/large/cardano.png", price_change_percentage_24h: -1.2 }
];

// Fetch Top 30 Coins from CoinGecko
const fetchCryptoData = async () => {
    // Top 30 coins by market cap, vs USD
    const apiURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false";

    // Fallback load function
    const loadFallback = () => {
        console.log("Using Fallback Data");
        cryptoData = fallbackData;
        populateDropdowns(fallbackData);
        updateTicker(fallbackData);
        convertCurrency();
        resultRate.innerText = "Simulated Mode (API limit)";
    };

    try {
        // 3 second timeout protection
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(apiURL, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("API Limit");

        const data = await response.json();
        cryptoData = data;

        populateDropdowns(data);
        updateTicker(data);
        convertCurrency(); // Initial conversion
    } catch (error) {
        console.error("Error fetching data, switching to fallback:", error);
        loadFallback();
    }
};

const populateDropdowns = (data) => {
    // Helper to create list items
    const createItem = (coin, listElement, selectedElement, isTo) => {
        const item = document.createElement("div");
        item.classList.add("option-item");
        // CONTENT: Symbol ONLY (as requested) + Image
        // If it's USD, custom handling
        if (coin === 'usd') {
            item.innerHTML = `<span style="font-weight:bold; color: #2ecc71">$</span> USD`;
            item.addEventListener("click", () => {
                selectOption('usd', 'USD', selectedElement, listElement, isTo);
            });
        } else {
            const symbol = coin.symbol.toUpperCase();
            item.innerHTML = `<img src="${coin.image}" alt=""> ${symbol}`;
            item.addEventListener("click", () => {
                selectOption(coin.id, symbol, selectedElement, listElement, isTo);
            });
        }
        listElement.appendChild(item);
    };

    // Clear lists
    fromList.innerHTML = "";
    toList.innerHTML = "";

    // 1. Add USD to "To" list (and From list if we want full flexibility)
    createItem('usd', toList, toSelected, true);
    createItem('usd', fromList, fromSelected, false);

    // 2. Add Top 30 Crypto
    data.forEach(coin => {
        createItem(coin, fromList, fromSelected, false);
        createItem(coin, toList, toSelected, true);
    });
};

// Selection Logic
const selectOption = (id, symbol, selectedEl, listEl, isTo) => {
    // Update global state
    if (isTo) {
        toId = id;
        toSymbol = symbol;
    } else {
        fromId = id;
        fromSymbol = symbol;
    }

    // Update UI
    selectedEl.innerText = symbol;
    selectedEl.setAttribute("data-value", id);

    // Close dropdown
    listEl.parentElement.classList.remove("active");

    // Recalculate
    convertCurrency();
};

const convertCurrency = () => {
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount)) {
        resultAmount.innerText = "0";
        return;
    }

    // Get prices
    let fromPriceUSD = 1;
    let toPriceUSD = 1;

    // Helper: Find price
    if (fromId !== "usd") {
        const fromCoin = cryptoData.find(c => c.id === fromId);
        fromPriceUSD = fromCoin ? fromCoin.current_price : 0;
    }

    if (toId !== "usd") {
        const toCoin = cryptoData.find(c => c.id === toId);
        toPriceUSD = toCoin ? toCoin.current_price : 0;
    }

    // Calculation
    if (toPriceUSD === 0) return; // Divide by    // Proper formatting function to avoid scientific notation on large numbers
    const formatValue = (val) => {
        if (val > 1) {
            return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else {
            return val.toPrecision(6);
        }
    };

    // Formatting logic
    let formattedResult = formatValue(result);
    let formattedRate = formatValue(fromPriceUSD / toPriceUSD);

    resultRate.innerText = `1 ${fromSymbol} ≈ ${formattedRate} ${toSymbol}`;
    resultAmount.innerText = `${formattedResult} ${toSymbol}`;
};

const updateTicker = (data) => {
    let tickerHTML = "";
    data.slice(0, 10).forEach(coin => {
        let changeClass = coin.price_change_percentage_24h >= 0 ? "color: #2ecc71" : "color: #e74c3c";
        tickerHTML += `
            <div class="ticker-item">
                ${coin.symbol.toUpperCase()}: $${coin.current_price.toLocaleString()} 
                <span style="${changeClass}">(${coin.price_change_percentage_24h.toFixed(2)}%)</span>
            </div>
        `;
    });
    tickerContent.innerHTML = tickerHTML + tickerHTML;
};

// Toggle Dropdowns
const toggleDropdown = (dropdown) => {
    // Close others
    document.querySelectorAll('.custom-dropdown').forEach(d => {
        if (d !== dropdown) d.classList.remove("active");
    });
    dropdown.classList.toggle("active");
};

// Custom Stepper Buttons
const stepUpBtn = document.getElementById("step-up");
const stepDownBtn = document.getElementById("step-down");

// Logic to determine step size
const getStepSize = () => {
    // Large Cap
    if (fromId === "bitcoin" || fromId === "wrapped-bitcoin") return 0.1;

    // Medium Cap (ETH, BNB, SOL, etc.)
    if (["ethereum", "binancecoin", "solana", "staked-ether"].includes(fromId)) return 1;

    // Default / Small Cap (High supply coins like ADA, XRP, DOGE)
    return 50;
};

// Handle Stepper Clicks
const handleStep = (direction) => {
    let currentVal = parseFloat(amountInput.value) || 0;
    const step = getStepSize();

    if (direction === "up") {
        currentVal += step;
    } else {
        currentVal -= step;
        if (currentVal < 0) currentVal = 0;
    }

    // Fix floating point errors (e.g. 0.1 + 0.2 = 0.30000004)
    // If step is decimal (0.1), fix to 1 decimal. If integer, no fix needed.
    if (step < 1) {
        currentVal = parseFloat(currentVal.toFixed(2));
    }

    amountInput.value = currentVal;
    convertCurrency();
};

stepUpBtn.addEventListener("click", () => handleStep("up"));
stepDownBtn.addEventListener("click", () => handleStep("down"));

// Update conversion when typing
amountInput.addEventListener("input", convertCurrency);

fromSelected.addEventListener("click", () => toggleDropdown(fromDropdown));
toSelected.addEventListener("click", () => toggleDropdown(toDropdown));


// Close on click outside
document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-dropdown")) {
        document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove("active"));
    }
});

// Swap button logic
swapIcon.addEventListener("click", () => {
    // Swap IDs
    const tempId = fromId;
    fromId = toId;
    toId = tempId;

    // Swap Symbols
    const tempSym = fromSymbol;
    fromSymbol = toSymbol;
    toSymbol = tempSym;

    // Update UI Text
    fromSelected.innerText = fromSymbol;
    toSelected.innerText = toSymbol;

    convertCurrency();
});
