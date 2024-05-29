/**
 * Event listener for DOMContentLoaded to ensure the DOM is fully loaded before executing the script.
 */
document.addEventListener('DOMContentLoaded', function() {

    /**
     * Adds click event listeners to all elements with the class 'save-btn'.
     * When a save button is clicked, it triggers a fetch request to save the chat.
     */
    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', () => {
            const chatId = button.getAttribute('data-id');
            fetch(`/saveChat/${chatId}`, { method: 'POST' })
                .then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `chat_${chatId}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(err => console.error('Error saving chat:', err));
        });
    });

    /**
     * Adds click event listeners to all elements with the class 'delete-btn'.
     * When a delete button is clicked, it triggers a fetch request to delete the chat.
     */
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const chatId = button.getAttribute('data-id');
            fetch(`/deleteChat/${chatId}`, { method: 'POST' })
                .then(response => {
                    if (response.ok) {
                        button.closest('li').remove(); // Removes the list item containing the deleted chat
                    } else {
                        console.error('Error deleting chat:', response);
                    }
                })
                .catch(err => console.error('Error deleting chat:', err));
        });
    });
});
