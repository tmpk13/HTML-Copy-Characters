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

// All shape characters unicode 25A0-25FF (6 rows 16 options: 96)
for ( let j = 0; j <= 96; ++ j ) {
    let char = String.fromCodePoint(0x25A0+j);
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

// --> END UNICODE CHARACTER SETUP





// Get the DIV container
const container = document.getElementById('copy-container');
const children = container.children;

let childrenCount = 20;
// Create each DIV
for ( let i = 0; i < childrenCount; ++i ) {
    let el = document.createElement('div');
    el.className = 'copy-box';
    let text = texts[i];
    el.textContent = text;
    el.style.order = -uses[text];
    container.appendChild(el);
}

function getChars(list, start, end) {
    let charCount = texts.length;
    if (start > charCount) {
        start = childrenCount;
    }
    if (end > charCount) {
        end = childrenCount;
    }
    if (start === end) {
        return [" "];
    }
    return list.slice(start, end);
}

//
function setChars(children, position) {
    console.log("setChars");
    let i = 0;
    for (const child of children) {
        child.textContent = texts[position+i];
        i++;
    }
}

let position = 0;
let ticking = false;
container.addEventListener("scroll", (event) => {
    if (!ticking) {
        setTimeout(() => {
            ticking = true;
            position += childrenCount;
            if (position > texts.length) { position = 0; }
            setChars(children, position, childrenCount);
        }, 20);
    }
});


// Container grid on click
container.addEventListener('click', e => {
    if (!e.target.classList.contains('copy-box')) return;

    let el = e.target;
    navigator.clipboard.writeText(el.textContent); 
    el.classList.add('copied'); 
    setTimeout(() => el.classList.remove('copied'), 1000);
    uses[el.textContent] += 1;
    
    localStorage.setItem('charUsage', JSON.stringify(uses));

    sortTimeout = setTimeout(() => {
        e.target.style.order = -uses[e.target.textContent];
    }, 500);
});


// Scroll to top button
const scrollBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
