import { fetchCountries } from './service/countryApi';
import { createDestination } from './service/destinationApi';

export function openModal() {
  const modal = document.getElementById('destinationModal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

export function closeModal() {
  const modal = document.getElementById('destinationModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

interface FormData {
  location: string;
  country: string;
  startDate: string;
  endDate: string;
}

/**
 * Validate form data
 * @param formData
 * @returns { valid: boolean; message: string }
 */
export function validateForm(formData: FormData): { valid: boolean; message: string } {
  if (!formData.location || !formData.country) {
    return { valid: false, message: 'Location and country are required' };
  }

  if (new Date(formData.endDate) < new Date(formData.startDate)) {
    return { valid: false, message: 'End date cannot be before start date' };
  }

  return { valid: true, message: 'Form is valid' };
}

async function populateCountryDropdown() {
  const countrySelect = document.getElementById('country') as HTMLSelectElement;
  const countries = await fetchCountries();

  countries.forEach((country) => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });
}

/**
 * Handle form submission, upload image, and create destination
 * @param {Event} e
 */
async function handleFormSubmission(e: Event) {
  e.preventDefault();

  const userId = '1';
  const country = (document.getElementById('country') as HTMLSelectElement).value;
  const location = (document.getElementById('location') as HTMLInputElement).value;
  const description = (document.getElementById('description') as HTMLTextAreaElement).value;
  const startDate = (document.getElementById('datepicker-start') as HTMLInputElement).value;
  const endDate = (document.getElementById('datepicker-end') as HTMLInputElement).value;
  //const image = (document.getElementById('image-upload') as HTMLInputElement).files?.[0];

  const formData: FormData = { country, location, startDate, endDate };
  const validation = validateForm(formData);
  if (!validation.valid) {
    alert(validation.message);
    return;
  }

  // change to image upload
  let imageUrl = 'https://unsplash.com/photos/two-gray-and-black-boats-near-dock-3_ZGrsirryY';

  /*if (image) {
    const imageUploadResponse = await uploadImage(image);
    if (imageUploadResponse.success) {
      imageUrl = imageUploadResponse.url;
    } else {
      alert('Image upload failed: ' + imageUploadResponse.message);
      return;
    }
  }*/

  const destinationData = {
    user_id: userId,
    country,
    location,
    description,
    date_start: startDate,
    date_end: endDate,
    image: imageUrl,
  };

  console.log('destination', destinationData);

  try {
    const response = await createDestination(destinationData);
    if (response.success) {
      alert('Destination added successfully!');
      (e.target as HTMLFormElement).reset();
      closeModal();
    } else {
      alert('Failed to create destination: ' + response.message);
    }
  } catch (error) {
    console.error('Error creating destination:', error);
    alert('An error occurred. Please try again.');
  }
}

function attachEventListeners() {
  document.getElementById('create-btn')?.addEventListener('click', openModal);
  document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);

  const form = document.getElementById('destinationForm') as HTMLFormElement;
  form.addEventListener('submit', handleFormSubmission);

  populateCountryDropdown();
}

document.addEventListener('DOMContentLoaded', attachEventListeners);
