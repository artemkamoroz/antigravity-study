// Initial References
const movieNameRef = document.getElementById("movie-name");
const searchBtn = document.getElementById("search-btn");
const result = document.getElementById("result");

// Placeholder API Key - User needs to provide this!
const key = "83e08d78";

// Function to fetch data from API
const getMovie = () => {
    let movieName = movieNameRef.value;
    let url = `http://www.omdbapi.com/?t=${movieName}&apikey=${key}`;

    // If input field is empty
    if (movieName.length <= 0) {
        result.innerHTML = `<h3 class="msg">Please enter a movie name 🎬</h3>`;
    }
    // If input field is NOT empty
    else {
        fetch(url)
            .then((resp) => resp.json())
            .then((data) => {
                // If movie exists in database
                if (data.Response == "True") {
                    result.innerHTML = `
                        <div class="info">
                            <img src=${data.Poster} class="poster">
                            <div>
                                <h2>${data.Title}</h2>
                                <div class="rating">
                                    <i class="fas fa-star"></i>
                                    <h4>${data.imdbRating}</h4>
                                </div>
                                <div class="details">
                                    <span>${data.Rated}</span>
                                    <span>${data.Year}</span>
                                    <span>${data.Runtime}</span>
                                </div>
                                <div class="genre">
                                    <div>${data.Genre.split(",").join("</div><div>")}</div>
                                </div>
                            </div>
                        </div>
                        <h3>Plot:</h3>
                        <p class="plot">${data.Plot}</p>
                        <h3>Cast:</h3>
                        <p>${data.Actors}</p>
                        
                         <!-- YouTube Trailer Link -->
                        <a href="https://www.youtube.com/results?search_query=${data.Title}+trailer" target="_blank" class="trailer-btn">
                            <i class="fab fa-youtube"></i> Watch Trailer
                        </a>
                    `;
                }
                // If movie doesn't exist
                else {
                    // Check if search contained Cyrillic (Russian) characters
                    if (/[а-яА-ЯёЁ]/.test(movieName)) {
                        result.innerHTML = `
                        <h3 class="msg">${data.Error}</h3>
                        <p style="color: #aaa; margin-top: 10px;">Совет: Попробуйте ввести название на английском (например, "Matrix" вместо "Матрица"). OMDb API лучше понимает оригинальные названия. 🇺🇸</p>
                    `;
                    } else {
                        result.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
                    }
                }
            })
            // If error occurs
            .catch(() => {
                result.innerHTML = `<h3 class="msg">Error Occurred</h3>`;
            });
    }
}

searchBtn.addEventListener("click", getMovie);
movieNameRef.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        getMovie();
    }
});
window.addEventListener("load", getMovie);
