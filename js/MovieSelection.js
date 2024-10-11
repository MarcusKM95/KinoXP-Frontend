const moviesURL = 'http://localhost:8080/movies/all';

document.addEventListener("DOMContentLoaded", () => {
    const movieSelect = document.getElementById("movieSelect");
    const nextButton = document.getElementById("nextButton");
    const reservationSection = document.getElementById("reservationSection");
    const showtimeSelect = document.getElementById("showtimeSelect");
    const seatContainer = document.getElementById("seatContainer");
    const reservationForm = document.getElementById("reservationForm");
    const selectedSeatsInput = document.getElementById("selectedSeats");
    console.log("movieSelect:", movieSelect);
    console.log("nextButton:", nextButton);
    console.log("reservationSection:", reservationSection);
    console.log("showtimeSelect:", showtimeSelect);
    console.log("seatContainer:", seatContainer);
    console.log("reservationForm:", reservationForm);
    console.log("selectedSeatsInput:", selectedSeatsInput);


    console.log(movieSelect, nextButton, reservationSection, showtimeSelect, seatContainer, reservationForm, selectedSeatsInput);  // Debugging

    if (!movieSelect || !nextButton || !reservationSection || !showtimeSelect  /*!seatContainer */|| !reservationForm /* !selectedSeatsInput*/) {
        console.error("One or more elements were not found in the DOM.");
    }

    let selectedSeats = [];
    let user = { isLoggedIn: false, name: "", phone: "" }; // Default guest user

    // Login and guest section
    const loginForm = document.getElementById("loginForm");
    const mainContent = document.getElementById("mainContent");
    const loginSection = document.getElementById("loginSection");
    const guestButton = document.getElementById("guestButton");

    // Login validation
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Simple login validation (for demo purposes)
        if (username === "admin" && password === "password123") {
            alert("Login successful!");
            user.isLoggedIn = true;
            user.name = "Admin"; // For demo purposes
            user.phone = "12345678"; // For demo purposes
            loginSection.style.display = "none"; // Hide login section
            mainContent.style.display = "block"; // Show reservation content
        } else {
            alert("Wrong username or password.");
        }
    });

    // Guest function
    guestButton.addEventListener("click", () => {
        alert("Continuing as guest");
        loginSection.style.display = "none"; // Hide login section
        mainContent.style.display = "block"; // Show reservation content
    });

    // Populate the movie dropdown with options from the backend
    fetchMovies();

    // Show reservation section and fetch showtimes when a movie is selected
    nextButton.addEventListener("click", () => {
        const movieId = movieSelect.value;

        if (movieId) {
            reservationSection.style.display = "block"; // Display reservation section
            fetchShowtimes(movieId);
        } else {
            alert("Vælg venligst en film.");
        }
    });

    // After selecting a showtime, display available seats
    showtimeSelect.addEventListener("change", (e) => {
        const showtimeId = e.target.value;

        if (showtimeId) {
            fetchSeats(showtimeId);
        }
    });

    // Handle reservation form submission
    reservationForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const age = document.getElementById("age").value;
        const showtimeId = showtimeSelect.value;

        // Check if at least one seat is selected
        if (!selectedSeats.length) {
            alert("Please select at least one seat.");
            return;
        }

        // Create reservation data
        const reservationData = {
            age,
            showtimeId,
            seats: selectedSeats
        };

        // If user is logged in, add name and phone
        if (user.isLoggedIn) {
            reservationData.name = user.name;
            reservationData.phone = user.phone;
        }

        // Send reservation data to backend
        makeReservation(reservationData);
    });

    // Helper functions

    // Fetch movies and populate dropdown
    function fetchMovies() {
        fetch(moviesURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Fetched movies data:", data);
                const movies = Array.isArray(data) ? data : data.movies;

                if (movies && movies.length > 0) {
                    populateMovieSelect(movies);
                } else {
                    alert("Der er ingen tilgængelige film.");
                }
            })
            .catch(error => {
                console.error("Error fetching movies:", error);
                alert("Error fetching movies.");
            });
    }

    // Populate movie select dropdown
    function populateMovieSelect(movies) {
        movieSelect.innerHTML = '<option value="">Vælg en film</option>'; // Reset dropdown
        movies.forEach(movie => {
            if (movie.id && movie.movieName) {
                const option = document.createElement("option");
                option.value = movie.id;
                option.textContent = movie.movieName; // Use movieName here
                movieSelect.appendChild(option);
            } else {
                console.error("Movie ID or movieName is missing:", movie);
            }
        });
    }

    // Fetch showtimes based on selected movie
    function fetchShowtimes(movieId) {
        showtimeSelect.innerHTML = '<option value="">Vælg en showtime</option>'; // Reset showtimes

        fetch(`http://localhost:8080/movies/${movieId}/showtimes`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Fetched showtimes data:", data);
                const showtimes = Array.isArray(data) ? data : data.showtimes;
                populateShowtimeSelect(showtimes);
            })
            .catch(error => {
                console.error("Error fetching showtimes:", error);
                alert("Der opstod en fejl, da showtiderne blev hentet.");
            });
    }

    // Populate showtime select dropdown
    function populateShowtimeSelect(showtimes) {
        if (showtimes.length > 0) {
            showtimes.forEach(showtime => {
                const option = document.createElement("option");
                option.value = showtime.id;
                option.textContent = `${showtime.showTime} - ${showtime.theater.theaterName}`;
                showtimeSelect.appendChild(option);
            });
        } else {
            alert("Der er ingen tilgængelige showtider for denne film.");
        }
    }

    // Fetch available seats for selected showtime
    function fetchSeats(showtimeId) {
        fetch(`/showtimes/${showtimeId}/seats`)
            .then(response => response.json())
            .then(seatsData => {
                console.log("Fetched seats data:", seatsData);
                renderSeats(seatsData);
            })
            .catch(error => {
                console.error("Error fetching seats:", error);
                alert("Error fetching seats.");
            });
    }

    // Render available seats in the seat container
    function renderSeats(seatsData) {
        seatContainer.innerHTML = ''; // Clear previous seats
        seatsData.forEach(seat => {
            const seatElement = document.createElement("div");
            seatElement.classList.add("seat");
            seatElement.dataset.seatId = seat.id;
            seatElement.dataset.seatNumber = seat.seatNumber;
            seatElement.addEventListener("click", toggleSeatSelection);
            seatContainer.appendChild(seatElement);
        });
    }

    // Toggle seat selection
    function toggleSeatSelection(e) {
        const seatElement = e.target;
        if (seatElement.classList.contains("selected")) {
            seatElement.classList.remove("selected");
            selectedSeats = selectedSeats.filter(id => id !== seatElement.dataset.seatId);
        } else {
            seatElement.classList.add("selected");
            selectedSeats.push(seatElement.dataset.seatId);
        }
        updateSelectedSeats();
    }

    // Update selected seats input
    function updateSelectedSeats() {
        selectedSeatsInput.value = selectedSeats.join(", ");
    }

    // Handle reservation submission
    function makeReservation(reservationData) {
        fetch('/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservationData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Reservation failed!');
                }
                return response.json(); // Parse JSON response
            })
            .then(result => {
                document.getElementById("response").textContent = "Reservation successful!";
                console.log("Reservation result:", result);
            })
            .catch(error => {
                console.error("Error making reservation:", error);
                document.getElementById("response").textContent = "Reservation failed!";
            });
    }
}); // End of DOMContentLoaded
