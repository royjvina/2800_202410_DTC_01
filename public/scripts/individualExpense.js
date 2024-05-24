/**
 * This script is used to handle an individual expense's javascript functionalities
 */


/**
 * This function is used to handle the click event on back button on an individual expense's page  
 * @claaudiaale
 */

function goBackToGroupsPage() {
    document.getElementById('goBack').addEventListener('click', () => {
        history.back()
    })
}

goBackToGroupsPage();