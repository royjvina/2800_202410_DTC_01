
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

function logout() {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/logout';

    document.body.appendChild(form);

    form.submit();
}

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

document.addEventListener('DOMContentLoaded', function() {
    let clickCount = 0;
    const logo = document.getElementById('logo');

    logo.addEventListener('click', function() {
        clickCount++;
        console.log(clickCount);
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
                logout();
            }, 4000);
        }
    });


});
