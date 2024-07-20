document.addEventListener('DOMContentLoaded', function() {
    var button = document.getElementById('clickMeButton');
    var message = document.getElementById('message');

    button.addEventListener('click', function() {
        message.textContent = 'Button Clicked!';
    });
});
