import './style.css'
import { v4 as generateUUID } from 'uuid';
import defaultPalettes from '../palettes.json'

// Local storage functions
const getPalettes = () => {
  const palettes = localStorage.getItem('palettes');
  return palettes ? JSON.parse(palettes) : {};
};

const savePalette = (palette) => {
  const palettes = getPalettes();
  palettes[palette.uuid] = palette;
  localStorage.setItem('palettes', JSON.stringify(palettes));
};

// Form handling
const paletteForm = document.getElementById('palette-form');
const palettesList = document.getElementById('palettes-list');

paletteForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const newPalette = {
    uuid: generateUUID(),
    title: document.getElementById('palette-title').value,
    colors: [
      document.getElementById('color1').value,
      document.getElementById('color2').value,
      document.getElementById('color3').value
    ],
    temperature: document.querySelector('input[name="temperature"]:checked').value
  };

  savePalette(newPalette);
  displayPalette(newPalette);
  paletteForm.reset();
});

// Display palette function
function displayPalette(palette) {
  const li = document.createElement('li');
  li.className = 'palette-card';
  
  li.innerHTML = `
    <h3>${palette.title}</h3>
    ${palette.colors.map(color => `
      <div class="color-display" style="background-color: ${color}">
        <span class="color-text white">Sample Text</span>
        <span class="color-text black">Sample Text</span>
        <button class="copy-button" data-color="${color}">Copy ${color}</button>
      </div>
    `).join('')}
    <div class="temperature-banner ${palette.temperature}">${palette.temperature}</div>
    <button class="delete-button" data-uuid="${palette.uuid}">Delete Palette</button>
  `;

  // Add copy functionality
  li.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', () => {
      navigator.clipboard.writeText(button.dataset.color);
      const originalText = button.textContent;
      button.textContent = 'Copied hex!';
      setTimeout(() => button.textContent = originalText, 1000);
    });
  });

  // Add delete functionality
  li.querySelector('.delete-button').addEventListener('click', () => {
    const palettes = getPalettes();
    delete palettes[palette.uuid];
    localStorage.setItem('palettes', JSON.stringify(palettes));
    li.remove();
  });

  palettesList.appendChild(li);
}

// Load existing palettes on page load
window.addEventListener('load', () => {
  const palettes = getPalettes();
  if (Object.keys(palettes).length === 0) {
    // Load default palettes if none exist
    Object.values(defaultPalettes).forEach(palette => {
      savePalette(palette);
      displayPalette(palette);
    });
  } else {
    // Display existing palettes
    Object.values(palettes).forEach(displayPalette);
  }
});

