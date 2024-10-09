document.addEventListener("DOMContentLoaded", () => {
    const movieGrid = document.getElementById("movie-grid");

    // Fetch movies from the backend
    fetch('http://localhost:8080/movies')  // Replace with your correct endpoint
        .then(response => response.json())
        .then(movies => {
            renderMovies(movies);
        })
        .catch(error => console.error('Error fetching movies:', error));

    // Render movies
    function renderMovies(movies) {
        movies.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");

            // Movie info
            movieCard.innerHTML = `
                <img src="${movie.posterURL}" alt="${movie.title}" class="movie-poster">
                <h3>${movie.title}</h3>
                <p class="release-date">Release: ${new Date(movie.releaseDate).toLocaleDateString()}</p>
                <p>Duration: ${movie.durationMinutes} min</p>
                <p>Age Limit: ${movie.ageLimit}+</p>
                <p>Instructor: ${movie.instructor}</p>
                <p>Genre: ${movie.genre}</p>
                <button class="showtimes-btn" data-id="${movie.id}">Show Showtimes</button>
            `;

            // Append to grid
            movieGrid.appendChild(movieCard);
        });

        // Event listeners for 'Show Showtimes' buttons
        const showtimesButtons = document.querySelectorAll('.showtimes-btn');
        showtimesButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const movieId = e.target.getAttribute('data-id');
                fetchShowtimes(movieId);
            });
        });
    }

    // Specific showtimes
    function fetchShowtimes(movieId) {
        fetch(`http://localhost:8080/movies/${movieId}/showTimes`)  // Adjust the endpoint if needed
            .then(response => response.json())
            .then(showtimes => {
                renderShowtimes(movieId, showtimes);
            })
            .catch(error => console.error('Error fetching showtimes:', error));
    }

    // Render showtimes
    function renderShowtimes(movieId, showtimes) {
        const movieCard = document.querySelector(`button[data-id='${movieId}']`).parentNode;
        let showtimesList = `<ul class="showtimes-list">`;
        showtimes.forEach(showtime => {
            showtimesList += `<li>${new Date(showtime.showTimeAndDate).toLocaleString()} (${showtime.is3D ? '3D' : '2D'})</li>`;
        });
        showtimesList += `</ul>`;

        movieCard.insertAdjacentHTML('beforeend', showtimesList);
    }
});
