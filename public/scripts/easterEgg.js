/* This file contains the code for the easter egg. When the user clicks on the logo, the easter egg is triggered.*/

/**
 * This function is used to display the dialog of Pennywise the clown word by word.
 * @param {string} dialog - The dialog to be displayed.
 * @param {number} clickCount - The number of times the logo has been clicked.
 * @balpreet787
 */
function pennyWiseDialog(dialog, clickCount = 0) {
    let i = 0;
    let speed = 50;
    document.getElementById('pennywise').innerHTML = '';

    if (clickCount === 15) {
        document.getElementById('pennywise').innerHTML = '(╯°□°)╯︵ ┻━┻ <br> ';
    }
    function typeWriter() {
        if (i < dialog.length) {
            document.getElementById('pennywise').innerHTML += dialog.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }

    typeWriter();
}
/**
 * This function is used to logout the user.
 * @balpreet787
 */
function logout() {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/logout';

    document.body.appendChild(form);

    form.submit();
}

/**
    * This function is used to make the image appear bigger.
    * @param {HTMLElement} image - The image to be made bigger.
    * @balpreet787
    */
function makeImageAppearBigger(image) {
    let i = 0;
    let speed = 50;
    
    function makeBigger() {
        if (i < 75) {
            image.style.width = i + '%';
            image.style.height = i + '%';
            i++;
            setTimeout(makeBigger, speed);
        }
    }
    makeBigger();
}

// This is an event listener that listens for the click event on the logo.
document.addEventListener('DOMContentLoaded', function() {
    let clickCount = 0;
    const logo = document.getElementById('logo');

    logo.addEventListener('click', function() {
        clickCount++;
        if (clickCount === 5) {
            pennyWiseDialog('Stop hitting me! It hurts, you know?');
            setTimeout(function() {
                document.getElementById('pennywise').innerHTML = 'PennyWise';
            }, 2000);
        }
        else if (clickCount === 10) {
            pennyWiseDialog('Last warning! Stop hitting me, you know who I am right?!');
            setTimeout(function() {
                document.getElementById('pennywise').innerHTML = 'PennyWise';
            }, 4000);
        }
        else if (clickCount === 15) {
            const image = document.getElementById('logo');
            makeImageAppearBigger(image);
            pennyWiseDialog('I am leaving since you are gonna behave like this!', clickCount);
            setTimeout(function() {
                window.open('https://www.imdb.com/title/tt1396484/', '_blank');
                logout();
            }, 4000);
        }
    });


});
