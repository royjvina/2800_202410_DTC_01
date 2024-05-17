document.querySelectorAll('.save-btn').forEach(button => {
    button.addEventListener('click', () => {
        const chatId = button.getAttribute('data-id');
        fetch(`/ai/saveChat/${chatId}`, { method: 'POST' })
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

document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', () => {
        const chatId = button.getAttribute('data-id');
        fetch(`/ai/deleteChat/${chatId}`, { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    button.closest('li').remove();
                } else {
                    console.error('Error deleting chat:', response);
                }
            })
            .catch(err => console.error('Error deleting chat:', err));
    });
});