document.addEventListener('DOMContentLoaded', function() {
    let clickCount = 0;
    const logo = document.getElementById('logo');
    const easterEggImageContainer = document.getElementById('easterEggImageContainer');

    logo.addEventListener('click', function() {
        clickCount++;
        if (clickCount === 5) {
            window.location.href = '/easterEgg';
        }
    });
});
