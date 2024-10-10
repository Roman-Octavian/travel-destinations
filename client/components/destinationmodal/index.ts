import HTML from './index.html?raw';
import { resetForm, populateForm, populateCountryDropdown, handleFormSubmission } from './form';
import { checkAuth } from '../../utils/authCheck.ts';

let isCreateMode = true;
let currentDestinationId: string | null = null;

export const showModal = (title: string) => {
  if (!checkAuth()) return;
  const modal = document.getElementById('destinationModal') as HTMLElement;
  const modalTitle = document.getElementById('modalTitle') as HTMLElement;
  const submitButton = document.querySelector(
    '#destinationForm button[type="submit"]',
  ) as HTMLButtonElement;

  if (modal) {
    modalTitle.textContent = title;
    submitButton.textContent = isCreateMode ? 'ADD NEW DESTINATION' : 'UPDATE DESTINATION';
    modal.classList.remove('hidden');
  }
};

export const hideModal = () => {
  const modal = document.getElementById('destinationModal') as HTMLElement;
  if (modal) modal.classList.add('hidden');
};

export const destinationModal = () => {
  if (document.getElementById('destinationModal')) {
    return;
  }

  const modalTemplate = document.createElement('template');
  modalTemplate.innerHTML = HTML.trim();

  const main = document.querySelector('main') || document.body;
  if (main) {
    main.appendChild(modalTemplate.content);
  }

  const closeModalBtn = document.getElementById('closeModalBtn') as HTMLButtonElement;
  const openModalButton = document.getElementById('create-btn');
  const imageInput = document.getElementById('image-upload') as HTMLInputElement;
  const currentImagePreview = document.getElementById('current-image-preview') as HTMLImageElement;

  openModalButton?.addEventListener('click', () => {
    isCreateMode = true;
    currentDestinationId = null;
    resetForm();
    showModal('NEW DESTINATION');
  });

  closeModalBtn?.addEventListener('click', hideModal);

  document.querySelectorAll('.update-btn').forEach((button) => {
    button.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement;
      const destinationId = target.getAttribute('data-destination-id');
      if (destinationId) {
        isCreateMode = false;
        currentDestinationId = destinationId;
        await populateForm(destinationId);
        showModal('UPDATE DESTINATION');
      }
    });
  });

  imageInput.addEventListener('change', () => {
    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && currentImagePreview) {
          currentImagePreview.src = e.target.result as string;
          currentImagePreview.classList.remove('hidden');
        }
      };
      reader.readAsDataURL(imageInput.files[0]);
    } else {
      currentImagePreview.classList.add('hidden');
      currentImagePreview.src = '';
    }
  });

  populateCountryDropdown();

  const form = document.getElementById('destinationForm') as HTMLFormElement;
  form?.addEventListener('submit', handleFormSubmission);
  attachDatePickerListeners();
};

const attachDatePickerListeners = () => {
  const iconStart = document.getElementById('calendar-icon-start') as HTMLImageElement | null;
  const iconEnd = document.getElementById('calendar-icon-end') as HTMLImageElement | null;
  const dateStart = document.getElementById('datepicker-start') as HTMLInputElement | null;
  const dateEnd = document.getElementById('datepicker-end') as HTMLInputElement | null;

  if (iconStart && dateStart) {
    iconStart.addEventListener('click', () => {
      try {
        dateStart.focus();
        dateStart.showPicker();
      } catch (error) {
        console.error('Failed to show date picker:', error);
      }
    });
  }

  if (iconEnd && dateEnd) {
    iconEnd.addEventListener('click', () => {
      try {
        dateEnd.focus();
        dateEnd.showPicker();
      } catch (error) {
        console.error('Failed to show date picker:', error);
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  destinationModal();
  attachDatePickerListeners();
});

export { isCreateMode, currentDestinationId };
