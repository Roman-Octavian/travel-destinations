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

const repeatCount = 5; // You can change this number
const template = document.getElementById('destination-template') as HTMLTemplateElement;
const destinationsList = document.querySelector('.destinations-list') as HTMLElement;

// Clone and append the template content multiple times
for (let i = 0; i < repeatCount; i++) {
  const clone = template.content.cloneNode(true);
  destinationsList.appendChild(clone);
}
