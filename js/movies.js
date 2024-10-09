document.addEventListener("DOMContentLoaded", () => {
    const movieGrid = document.getElementById("movie-grid");

    // Fetch movies from the backend
    fetch('http://localhost:8080/movies')
        .then(response => response.json())
        .then(movies => {
            console.log("Fetched movies:", movies);
            renderMovies(movies);
        })
        .catch(error => console.error('Error fetching movies:', error));

    // Render movies
    function renderMovies(movies) {
        movies.forEach(movie => {
            if (!movie.title) {
                console.error("Movie ID is undefined for movie:", movie);
                return;
            }
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");
            movieCard.className = 'movie-card';
            movieCard.id = `movie-${movie.title}`;

            // Movie info
            movieCard.innerHTML = `
                <img src="${movie.posterURL}" alt="${movie.title}" class="movie-poster">
                <h3>${movie.title}</h3>
                <p class="release-date">Release: ${new Date(movie.releaseDate).toLocaleDateString()}</p>
                <p>Duration: ${movie.durationMinutes} min</p>
                <p>Age Limit: ${movie.ageLimit}+</p>
                <p>Instructor: ${movie.instructor}</p>
                <p>Genre: ${movie.genre}</p>
                <button class="showtimes-btn" data-title="${movie.title}">Show Showtimes</button>
                <button class="delete-button" onclick="deleteMovie('${movie.title}')">Delete Movie</button>
            `;

            // Append to grid
            movieGrid.appendChild(movieCard);
        });

        // Event listeners for 'Show Showtimes' buttons
        const showtimesButtons = document.querySelectorAll('.showtimes-btn');
        showtimesButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const movieTitle = e.target.getAttribute('data-title');
                fetchShowtimes(movieTitle);
            });
        });
    }
});

// Delete movie function needs to be globally accessible
function deleteMovie(movieTitle) {
    const cleanedTitle = movieTitle.trim();  // Remove any leading/trailing spaces
    const encodedTitle = encodeURIComponent(cleanedTitle);  // Properly encode the title

    fetch(`http://localhost:8080/movies/${encodedTitle}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                alert('Movie deleted successfully.');
                // Remove the HTML element for the deleted movie
                document.getElementById(`movie-${cleanedTitle.replace(/\s/g, '')}`).remove();
            } else {
                alert('Failed to delete the movie. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error deleting movie:', error);
            alert('Error deleting movie. Please try again later.');
        });
}

// Specific showtimes
function fetchShowtimes(movieTitle) {
    fetch(`http://localhost:8080/movies/${encodeURIComponent(movieTitle)}/showTimes`)
        .then(response => response.json())
        .then(showtimes => {
            renderShowtimes(movieTitle, showtimes);
        })
        .catch(error => console.error('Error fetching showtimes:', error));
}

// Render showtimes
function renderShowtimes(movieTitle, showtimes) {
    const movieCard = document.querySelector(`button[data-title='${movieTitle}']`).parentNode;
    let showtimesList = `<ul class="showtimes-list">`;
    showtimes.forEach(showtime => {
        showtimesList += `<li>${new Date(showtime.showTimeAndDate).toLocaleString()} (${showtime.is3D ? '3D' : '2D'})</li>`;
    });
    showtimesList += `</ul>`;

    movieCard.insertAdjacentHTML('beforeend', showtimesList);
}
