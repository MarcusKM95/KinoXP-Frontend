document.addEventListener('DOMContentLoaded', function () {
    const showtimeSelect = document.getElementById('showtimeSelect');
    const seatContainer = document.getElementById('seatContainer');
    const selectedSeatsList = document.getElementById('selectedSeatsList');
    const selectedSeats = new Set();  // Holder styr på de valgte sæder

    // Håndter ændring af showtime
    showtimeSelect.addEventListener('change', function () {
        const showtimeId = this.value;
        if (showtimeId) {
            // Hent sæder for den valgte showtime
            fetch(`/api/seats?showtimeId=${showtimeId}`)
                .then(response => response.json())
                .then(seats => {
                    // Ryd containeren
                    seatContainer.innerHTML = '';

                    // Vis sæderne
                    seats.forEach(seat => {
                        const seatElement = document.createElement('div');
                        seatElement.textContent = seat.name;
                        seatElement.className = 'seat';

                        if (seat.isOccupied) {
                            seatElement.classList.add('occupied');
                            seatElement.setAttribute('disabled', 'true');
                        } else {
                            seatElement.addEventListener('click', function () {
                                toggleSeatSelection(seat, seatElement);
                            });
                        }

                        seatContainer.appendChild(seatElement);
                    });
                });
        } else {
            seatContainer.innerHTML = '';
        }
    });

    // Funktion til at håndtere valg af sæder
    function toggleSeatSelection(seat, seatElement) {
        if (selectedSeats.has(seat.id)) {
            // Fjern sædet fra udvalgte
            selectedSeats.delete(seat.id);
            seatElement.classList.remove('selected');
        } else {
            // Tilføj sædet til udvalgte
            selectedSeats.add(seat.id);
            seatElement.classList.add('selected');
        }

        // Opdater listen af valgte sæder
        updateSelectedSeatsList();
    }

    // Opdater visningen af de valgte sæder
    function updateSelectedSeatsList() {
        selectedSeatsList.innerHTML = '';
        selectedSeats.forEach(seatId => {
            const li = document.createElement('li');
            li.textContent = `Sæde: ${seatId}`;
            selectedSeatsList.appendChild(li);
        });
    }
});
