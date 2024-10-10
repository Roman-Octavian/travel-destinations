import popup from './components/popup';
import { axiosInstance } from '../client/utils/axiosConfig.ts';

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

// Fetch destinations from the API and display them
const fetchDestinations = async () => {
  try {
    const response = await axiosInstance.get('/destination');
    console.log('Fetched Destinations:', response.data);
    populateDestinations(response.data);
  } catch (error) {
    console.error('Error fetching destinations:', error);
  }
};

// Populate the destination template
function populateDestinations(destinations: any[]) {
  const template = document.getElementById('destination-template') as HTMLTemplateElement;
  const destinationList = document.querySelector('.destinations-list');

  destinations.forEach((destination) => {
    const clone = template.content.cloneNode(true) as HTMLElement;
    const locationElement = clone.querySelector('.destination-location span');
    const dateElement = clone.querySelector('.date span');
    const descriptionElement = clone.querySelector('.description');

    // Populate with data
    if (locationElement) {
      locationElement.textContent = `${destination.title}, ${destination.location}`;
    }

    // Use date_start and date_end
    if (destination.date_start && destination.date_end) {
      if (dateElement) {
        dateElement.textContent = `${new Date(destination.date_start).toLocaleDateString()} - ${new Date(destination.date_end).toLocaleDateString()}`;
      }
    } else {
      console.warn('Date information is missing for destination:', destination);
      if (dateElement) {
        dateElement.textContent = 'Date information unavailable';
      }
    }

    if (descriptionElement) {
      descriptionElement.textContent = destination.description;
    }

    // Append to the destination list
    if (destinationList) {
      destinationList.appendChild(clone);
    }
  });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  fetchDestinations();
});
popup();
