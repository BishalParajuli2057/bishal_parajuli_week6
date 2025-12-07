const form = document.getElementById("offerForm");
const offersContainer = document.getElementById("offersContainer");
const messageDiv = document.getElementById("message");

// Function to show messages
function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = "block";
  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 3000);
}

// Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      showMessage("Offer created successfully!", "success");
      form.reset();
      loadOffers(); // Reload offers
    } else {
      const error = await response.json();
      showMessage(error.error || "Failed to create offer", "error");
    }
  } catch (error) {
    showMessage("Error creating offer", "error");
    console.error("Error:", error);
  }
});

// Load and display offers
async function loadOffers() {
  try {
    const response = await fetch("/offers");
    const offers = await response.json();

    offersContainer.innerHTML = "";

    offers.forEach((offer) => {
      const offerDiv = document.createElement("div");
      offerDiv.className = "offerDiv";

      let imageHTML = "";
      if (offer.imagePath) {
        imageHTML = `<img src="/${offer.imagePath}" alt="${offer.title}">`;
      }

      offerDiv.innerHTML = `
                ${imageHTML}
                <div class="content">
                    <p>${offer.title}</p>
                    <p>${offer.description}</p>
                    <p>$${offer.price.toFixed(2)}</p>
                </div>
            `;

      offersContainer.appendChild(offerDiv);
    });
  } catch (error) {
    console.error("Error loading offers:", error);
  }
}

loadOffers();
