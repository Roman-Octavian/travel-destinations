import popup from './components/popup';

// Get the menu elements
const menuButton = document.getElementById('burger-menu') as HTMLElement;
const closeMenuButton = document.getElementById('closeMenuButton') as HTMLElement;
const navMenu = document.getElementById('navMenu') as HTMLElement;

// Function to open the mobile menu
const openMenu = () => {
  navMenu.classList.remove('translate-x-full');
};

// Function to close the mobile menu
const closeMenu = () => {
  navMenu.classList.add('translate-x-full');
};

// Event listeners
menuButton.addEventListener('click', openMenu);
closeMenuButton.addEventListener('click', closeMenu);

// Fetch destinations from the backend
async function fetchDestinations() {
  try {
    const response = await fetch('http://localhost:8080/api/v1/destination');
    if (!response.ok) {
      throw new Error('Failed to fetch destinations');
    }

    const destinations = await response.json();
    populateDestinations(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
  }
}

// Function to populate the template with data
function populateDestinations(destinations: any[]) {
  const template = document.getElementById('destination-template') as HTMLTemplateElement;
  const destinationsList = document.querySelector('.destinations-list') as HTMLElement;
  // Clear any existing content in the template
  destinationsList.innerHTML = '';

  destinations.forEach((destination) => {
    const clone = template.content.cloneNode(true) as HTMLElement;

    // Fill in the details in the template clone
    const imgElement = clone.querySelector('img') as HTMLImageElement;
    const locationElement = clone.querySelector('.destination-location') as HTMLElement;
    const dateElement = clone.querySelector('.date') as HTMLElement;
    const descriptionElement = clone.querySelector('.description') as HTMLElement;

    // Update the image with the destination image use a placeholder if there is no image
    imgElement.src = destination.image ?? './placeholder-image.jpg';

    // Update the location
    const locationText = locationElement.querySelector('span') ?? document.createElement('span');
    locationText.textContent = `${destination.location}, ${destination.country}`;
    if (!locationElement.contains(locationText)) locationElement.appendChild(locationText);

    // Update the travel date
    const dateText = dateElement.querySelector('span') ?? document.createElement('span');
    dateText.textContent = `From: ${new Date(destination.date_start).toLocaleDateString()} To: ${new Date(destination.date_end).toLocaleDateString()}`;
    if (!dateElement.contains(dateText)) dateElement.appendChild(dateText);

    // Update the description
    descriptionElement.textContent = destination.description || 'No description available';

    // Append the populated clone to the destinations list
    destinationsList.appendChild(clone);
  });
}

// Call the function to fetch and display destinations
fetchDestinations();

popup();
