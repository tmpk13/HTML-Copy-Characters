// Animations
let scrollTop = document.getElementById('scrollTop');

scrollTop.addEventListener('click', () => {
    scrollTop.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.2)' },
        { transform: 'scale(1)' }
    ], { duration: 300, easing: 'ease' });
});
