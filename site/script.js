// Fetch all cat pictures from the API and display them on the UI
async function fetchCatPictures() {
  try {
    const response = await fetch("/api/cats/fetch/");
    const data = await response.json();
    const catPicturesList = document.getElementById("catPicturesList");
    catPicturesList.innerHTML = "";

    data.catPictures.forEach((catPicture) => {
      const catPictureElement = document.createElement("div");
      catPictureElement.classList.add("catPicture");

      const imgElement = document.createElement("img");
      imgElement.src = `/api/cats/fetch/${catPicture.id}`;

      catPictureElement.appendChild(imgElement);
      catPicturesList.appendChild(catPictureElement);
    });
  } catch (error) {
    console.error("Failed to fetch cat pictures:", error);
  }
}

// Upload a cat picture using the API
async function uploadCatPicture(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  try {
    const response = await fetch("/api/cats/upload", {
      method: "POST",
      body: formData,
    });

    if (response.status === 201) {
      alert("Cat picture uploaded successfully!");
      fetchCatPictures();
    } else {
      alert("Failed to upload cat picture.");
    }
  } catch (error) {
    console.error("Failed to upload cat picture:", error);
  }
}

// Attach event listener to the form for uploading cat pictures
document
  .getElementById("uploadForm")
  .addEventListener("submit", uploadCatPicture);

// Fetch and display all cat pictures on page load
fetchCatPictures();
