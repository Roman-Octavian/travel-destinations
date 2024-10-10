import { destinationModal } from './components/destinationmodal/index';
import popup from './components/popup';
import { axiosInstance, axiosLoginInstance } from '../client/utils/axiosConfig.ts';
import { type Destination as DestinationType } from '@packages/types';

// Destination interface
type Destination = DestinationType & { _id: string };

// Get elements from the DOM
const menuButton = document.getElementById('burger-menu') as HTMLElement;
const closeMenuButton = document.getElementById('closeMenuButton') as HTMLElement;
const navMenu = document.getElementById('navMenu') as HTMLElement;
const authButton = document.getElementById('openModal') as HTMLElement;
const logoutButton = document.getElementById('logoutButton') as HTMLElement;
const userDestinations = document.getElementById('my-destinations') as HTMLElement;

// Mobile menu
// Function to open the mobile menu
const openMenu = () => navMenu.classList.remove('translate-x-full');

// Function to close the mobile menu
const closeMenu = () => navMenu.classList.add('translate-x-full');

// Event listeners
menuButton.addEventListener('click', openMenu);
closeMenuButton.addEventListener('click', closeMenu);

// Fetch and populate destinations
const fetchAndPopulateDestinations = async (url: string, isUserSpecific: boolean = false) => {
  try {
    const response = await axiosInstance.get(url);
    console.log(
      isUserSpecific ? 'Fetched User Destinations:' : 'Fetched All Destinations:',
      response.data,
    );
    populateDestinations(response.data, isUserSpecific);
  } catch (error) {
    console.error(
      isUserSpecific ? 'Error fetching user destinations:' : 'Error fetching destinations:',
      error,
    );
  }
};

// Populate the destination template
const populateDestinations = (destinations: Destination[], isUserSpecific: boolean) => {
  const template = document.getElementById('destination-template') as HTMLTemplateElement;
  const destinationList = isUserSpecific
    ? document.querySelector('.mydestinations-list')
    : document.querySelector('.destinations-list');

  // Clear the existing content
  if (destinationList) {
    destinationList.innerHTML = ''; // Clear existing destinations
  }

  if (destinations.length === 0 && isUserSpecific) {
    const noDestinationsMessage = document.createElement('p');
    noDestinationsMessage.textContent = 'You have no destinations yet.';
    destinationList?.appendChild(noDestinationsMessage);
    return;
  }

  destinations.forEach((destination) => {
    const clone = template.content.cloneNode(true) as HTMLElement;
    const locationElement = clone.querySelector('.destination-location span');
    const dateElement = clone.querySelector('.date span');
    const descriptionElement = clone.querySelector('.description');
    const deleteButton = clone.querySelector('.delete-button') as HTMLElement;
    const destinationIDDataset = clone.querySelector('.template-wrapper') as HTMLElement;
    const imageElement = clone.querySelector('.image') as HTMLImageElement;

    if (imageElement) {
      imageElement.src = destination.image;
    }
    // Add ids to each destination
    if (destinationIDDataset) {
      destinationIDDataset.dataset.id = destination._id;
    }

    // Populate with data
    if (locationElement) {
      locationElement.textContent = `${destination.country}, ${destination.location}`;
    }

    // Use date_start and date_end
    if (dateElement) {
      dateElement.textContent =
        destination.date_start && destination.date_end
          ? `${new Date(destination.date_start).toLocaleDateString()} - ${new Date(destination.date_end).toLocaleDateString()}`
          : 'Date information unavailable';
    }

    if (descriptionElement) {
      descriptionElement.textContent = destination.description;
    }

    // Handle delete button for user-specific destinations
    if (isUserSpecific && deleteButton) {
      deleteButton.addEventListener('click', () => {
        const confirmed = confirm('Are you sure you want to delete this destination?');
        if (confirmed) {
          deleteDestination(destination._id);
        }
      });
    } else if (deleteButton) {
      deleteButton.style.display = 'none'; // Hide delete button for non-user destinations
    }

    // Append to the destination list
    if (destinationList) {
      destinationList.appendChild(clone);
    }
  });
};

// Function to delete a destination
const deleteDestination = async (destinationId: string) => {
  try {
    await axiosInstance.delete(`/destination/${destinationId}`);
    const destinationElement = document.querySelector(`[data-id="${destinationId}"]`);
    if (destinationElement) {
      destinationElement.closest('.flex')?.remove();
    }
    console.log('Destination deleted:', destinationId);

    // Refresh both destination lists
    await refreshDestinations();
  } catch (error) {
    console.error('Error deleting destination:', error);
  }
};

// Check if user is logged in based on 'isLoggedIn' in local storage
const checkUserLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

// Function to refresh both user-specific and all destinations
const refreshDestinations = async () => {
  await fetchAndPopulateDestinations('/destination'); // Fetch all destinations

  const loggedIn = checkUserLoggedIn();
  if (loggedIn) {
    await fetchAndPopulateDestinations('/destination/user', true); // Fetch user-specific destinations
  }
};

// Function to update UI based on login status
const updateAuthButtons = () => {
  const loggedIn = checkUserLoggedIn();

  if (loggedIn) {
    userDestinations.style.display = 'flex';
    authButton.classList.add('hidden');
    authButton.style.display = 'none'; // Hide auth button
    logoutButton.classList.remove('hidden');
    logoutButton.style.display = 'flex'; // Show logout button
  } else {
    userDestinations.style.display = 'none';
    authButton.classList.remove('hidden');
    authButton.style.display = 'flex'; // Show auth button
    logoutButton.classList.add('hidden');
    logoutButton.style.display = 'none'; // Hide logout button
  }
};

logoutButton.addEventListener('click', async () => {
  const confirmed = confirm('Are you sure you want to log out?');

  if (!confirmed) {
    return; // If the user clicks "Cancel", exit the function without logging out
  }

  try {
    const result = await axiosLoginInstance.get('/logout');

    if (result.data.isLoggedIn === false) {
      // Set isLoggedIn to false in localStorage after logout
      localStorage.setItem('isLoggedIn', 'false');
      alert('Successfully logged out');
      updateAuthButtons();
    }
  } catch (error) {
    alert('Logout failed. Please try again.');
  }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is logged in
  checkUserLoggedIn();
  // Fetch both destination lists on load
  await refreshDestinations();
  // Update buttons based on login status
  updateAuthButtons();
});

destinationModal();
popup();
