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

function getTopChars(count) {
    return Object.entries(uses).sort((a, b)=>{ return b[1] - a[1]; }).slice(0, count)
}


let favoriteChildrenCount = 5;

let topChars = getTopChars(favoriteChildrenCount);

for ( let i = 0; i < favoriteChildrenCount; ++i ) {
    let el = document.createElement('div');
    el.className = 'copy-box';
    el.classList.add('sorted');
    let text = topChars[i][0];
    el.textContent = text;
    el.style.order = -uses[text];
    container.appendChild(el);
}

let childrenCount = 20;
// Create each copy DIV, for unsorted characters
for ( let i = 0; i < childrenCount; ++i ) {
    let el = document.createElement('div');
    el.className = 'copy-box';
    let text = texts[i];
    el.textContent = text;
    
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
    let i = 0;
    for (const child of children) {
        if (!child.classList.contains("sorted")) {
            child.textContent = texts[position+i];
            i++;
        }
    }
}

let position = 0;
let ticking = false;
function cycleChars(e, dir=1) {
    if (!e.target.classList.contains("copy-box")) return;

    e.preventDefault();

    if (!ticking) {
        ticking = true;
        setTimeout(() => {
            ticking = false;
            position += childrenCount*dir;
            if (position > texts.length) { position = 0; }
            if (position < 0) { position = texts.length; }
            setChars(children, position, childrenCount);
        }, 20);
    }
}

const cBBox = container.getBoundingClientRect();

window.addEventListener("touchmove", (e) => { cycleChars(e); });
window.addEventListener("contextmenu", (e) => {
    if ( event.clientX < cBBox.right/2  ) { cycleChars(e, -1) }
    else {
        cycleChars(e);
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

       console.log(topChars);
    if (e.target.classList.contains("sorted")) {
        if (Math.min(...topChars.map((x)=> x[1])) < uses[el.textContent])
        sortTimeout = setTimeout(() => {
            topChars = getTopChars(favoriteChildrenCount);
                for ( let i = 0; i < favoriteChildrenCount; ++i ) {
                    children[i].textContent = topChars[i][0];
                }
        }, 500);
    }
});


// Reset usesage button
const resetBtn = document.getElementById('reset-use');

resetBtn.addEventListener('click', () => {
    for ( let k in Object.keys(uses)) uses[k] = 0;
});
