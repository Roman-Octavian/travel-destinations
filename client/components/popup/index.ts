import HTML from './index.html?raw';
import { axiosLoginInstance } from '../../utils/axiosConfig.ts';
import { AxiosError } from 'axios';

const popup = () => {
  // Create a template element and parse the HTML string into the content
  const popupHtml = document.createElement('template');
  popupHtml.innerHTML = HTML.trim();

  // Append the modal to the main element in the document
  const main = document.querySelector('main');
  if (main) {
    main.appendChild(popupHtml.content);
  }

  const modal = document.getElementById('modal') as HTMLElement;
  const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;
  const modalTitle = document.getElementById('modalTitle') as HTMLElement;
  const nameField = document.getElementById('nameField') as HTMLElement;
  const toggleForm = document.getElementById('toggleForm') as HTMLElement;
  const closeModal = document.getElementById('closeModal') as HTMLElement;
  const toggleText = document.getElementById('toggleText') as HTMLElement;

  let isLogin = true; // Track if we're in login or sign-up mode

  const showModal = () => {
    modal.classList.remove('hidden');
  };

  const hideModal = () => {
    modal.classList.add('hidden');
  };

  // Function to toggle between Login and Sign Up
  const toggleFormFunction = () => {
    isLogin = !isLogin;

    if (isLogin) {
      modalTitle.innerText = 'LOGIN';
      loginBtn.innerText = 'Login';
      toggleForm.innerHTML = 'SIGN UP HERE';
      nameField.classList.add('hidden');
      toggleText.innerText = 'DON’T HAVE AN ACCOUNT?';
    } else {
      modalTitle.innerText = 'SIGN UP';
      loginBtn.innerText = 'Sign Up';
      toggleForm.innerHTML = 'LOG IN HERE';
      nameField.classList.remove('hidden');
      toggleText.innerText = 'ALREADY HAVE AN ACCOUNT?';
    }
  };

  // Add event listener for the form toggle (Sign Up <-> Login)
  toggleForm.addEventListener('click', (e) => {
    e.preventDefault();
    toggleFormFunction();
  });

  // Add event listener to show the modal
  const openModalButton = document.getElementById('openModal');
  openModalButton?.addEventListener('click', showModal);

  // Add event listener to hide the modal
  closeModal.addEventListener('click', hideModal);

  // Handle login or sign-up button click
  loginBtn.addEventListener('click', async () => {
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    let nameInput: HTMLInputElement | undefined;
    if (!isLogin) {
      nameInput = document.getElementById('name') as HTMLInputElement;
    }

    const credentials: { username: string; password: string; name?: string } = {
      username: usernameInput.value,
      password: passwordInput.value,
    };

    if (!isLogin && nameInput) {
      credentials.name = nameInput.value;
    }

    try {
      const endpoint = isLogin ? '/login' : '/signup';
      const result = await axiosLoginInstance.post(endpoint, credentials);

      alert(result.data.message); // Show success message
      hideModal(); // Hide the modal after success
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data.message) {
        alert(error.response.data.message);
      } else {
        alert('Operation failed. Please try again.');
      }
    }
  });
};

export default popup;
