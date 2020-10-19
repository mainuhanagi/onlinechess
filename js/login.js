function login() {
    var username = document.querySelector('#username').value;
    axios.post('/login', { username: username })
        .then((result) => {
            console.log(result);
            if (result.data.result == 'success')
                window.location = '/home?tips=true';
        });

}

function checkEnter(e) {
    if (e.key == 'Enter')
        login();
}