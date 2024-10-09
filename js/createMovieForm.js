function submitMovieForm() {
    const fileInput = document.getElementById('poster');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    // First, upload the image file
    fetch('http://localhost:8080/movies/uploadPoster', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to upload poster image.');
            }
            return response.text(); // Get the image URL as a string
        })
        .then(posterURL => {
            // Now create the movie with the returned poster URL
            const movieData = {
                title: document.getElementById('title').value,
                basePrice: parseFloat(document.getElementById('basePrice').value),
                is3D: document.getElementById('is3D').value === 'true',
                isAllNighter: document.getElementById('isAllNighter').value === 'true',
                durationMinutes: parseInt(document.getElementById('durationMinutes').value),
                releaseDate: document.getElementById('releaseDate').value,
                ageLimit: parseInt(document.getElementById('ageLimit').value),
                instructor: document.getElementById('instructor').value,
                genre: document.getElementById('genre').value,
                posterURL: posterURL // Use the uploaded image URL
            };

            return fetch('http://localhost:8080/movies/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(movieData)
            });
        })
        .then(response => {
            if (response.ok) {
                alert('Movie created successfully!');
                window.location.href = "http://localhost:63342/KinoXP-Frontend/movies.html"; // Redirect to the movies list page
            } else {
                throw new Error('Failed to create movie.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        });
}
