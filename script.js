const API_KEY = "f5d18b12b0324c49aed70b3338018635";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        
        // Check for unexpected status codes
        if (res.status !== 200) {
            console.error(`Unexpected status code: ${res.status}`);
            console.error(`API Response:`, await res.json());
            return;
        }

        const data = await res.json();

        // Check if data.articles is defined and not empty
        if (data.articles && data.articles.length > 0) {
            bindData(data.articles);
        } else {
            console.warn("No valid articles found in the response:", data);
        }
    } catch (error) {
        console.error("Error fetching news:", error);
        // Handle the error, e.g., display a message to the user.
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim(); // Trim to remove leading and trailing spaces
    if (!query) {
        alert("Please enter a search query.");
        return;
    }
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
