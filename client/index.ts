const h1 = document.getElementById('h1');

if (h1 != null) {
  setInterval(() => {
    if (h1.className.includes('left-eye')) {
      h1.innerHTML = '(⊙_◎)';
      h1.className = h1.className.replace('left-eye', 'right-eye');
    } else {
      h1.innerHTML = '(◎_⊙)';
      h1.className = h1.className.replace('right-eye', 'left-eye');
    }
  }, 500);
}

const iconStart = document.getElementById('calendar-icon-start') as HTMLImageElement | null;
const iconEnd = document.getElementById('calendar-icon-end') as HTMLImageElement | null;
const dateStart = document.getElementById('datepicker-start') as HTMLInputElement | null;
const dateEnd = document.getElementById('datepicker-end') as HTMLInputElement | null;

if (iconStart && dateStart) {
  iconStart.addEventListener('click', () => {
    (dateStart as any).showPicker();
  });
}

if (iconEnd && dateEnd) {
  iconEnd.addEventListener('click', () => {
    (dateEnd as any).showPicker();
  });
}
