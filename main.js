
// Text for each DIV element, for copying 
const texts = [];
let uses = JSON.parse(localStorage.getItem('charUsage')) || {};

// All box drawing characters unicode 2500-257F (8 rows 16 options: 128)
for ( let j = 0; j <= 128; ++ j ) {
    let char = String.fromCodePoint(0x2500+j);
    texts.push(char); 
}

// All arrow characters unicode 2190-21FF (7 rows 16 options: 112)
for ( let j = 0; j <= 112; ++ j ) {
    let char = String.fromCodePoint(0x2190+j);
    texts.push(char); 
}

// All block element characters unicode 2580-259F (2 rows 16 options: 32)
for ( let j = 0; j <= 32; ++ j ) {
    let char = String.fromCodePoint(0x2580+j);
    texts.push(char); 
}

texts.forEach(char => {
    if (!(char in uses)) uses[char] = 0;
});


// Get the DIV container
const container = document.getElementById('copy-container');

// Create each DIV and set the content
texts.forEach(text => {
    const el = document.createElement('div');
    el.className = 'copy-box';
    el.textContent = text;
    container.appendChild(el);
});

// Get all copy boxes
const elements = document.querySelectorAll('.copy-box');
const elementList = Array.from(elements);


// Sort after delay
let sortTimeout;
function sortGrid(timeout=500) {
    clearTimeout(sortTimeout);
    sortTimeout = setTimeout(() => {
        elementList
            .sort((a, b) => Number(uses[b.textContent]) - Number(uses[a.textContent]))
            .forEach(div => container.appendChild(div));
    }, timeout);
}

// Container grid on click
container.addEventListener('click', e => {
    if (!e.target.classList.contains('copy-box')) return;

    let el = e.target;
    navigator.clipboard.writeText(el.textContent); 
    el.classList.add('copied'); 
    setTimeout(() => el.classList.remove('copied'), 1000);
    uses[el.textContent] += 1;
    
    localStorage.setItem('charUsage', JSON.stringify(uses));

    e.target.style.order = -uses[e.target.textContent];
});


// Scroll to top button
const scrollBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
