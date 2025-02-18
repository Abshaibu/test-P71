const xIcon = document.querySelector('.x_icon_two')
const form = document.getElementById('form')
const inputType = document.getElementById('password')
const firstName = document.getElementById('firstName')
const lastName = document.getElementById('lastName')
const email = document.getElementById('email')
const checkBox = document.getElementById('checkbox')
const incorrect = document.querySelector('.incorrect')
const signupBtn = document.querySelector('.signup-btn a')
const incorrectText = document.querySelector('.incorrect-text')
const spinner = document.querySelector('.spinner-wrapper');


let password = true
//onclick, check if the input type is [password] if it is, switch the input type [text] 
xIcon.addEventListener('click', () => {
    if (password) {
        inputType.setAttribute('type', 'text')
        //remove the original attribute then set a new attribute with a diffrent src path [your alternate icon]
        xIcon.removeAttribute('src')
        xIcon.setAttribute('src', './images/eye.svg')
    } else {
        //reset
        inputType.setAttribute('type', 'password')
        xIcon.removeAttribute('src')
        xIcon.setAttribute('src', './images/eye-slash.svg')
    }
    password = !password
})

form.addEventListener('submit', e => {
    e.preventDefault()
    //on submit, carryout the following checks
    let firstnameValid = checkFirstName()
    let lastnameValid = checkLastName()
    let emailValid = checkEmail()
    let passwordValid = checkPassword()
    let checkBoxChecked = iScheckBoxChecked()

    //formValid will be true if all checks passes 
    let formValid = firstnameValid && lastnameValid && emailValid && passwordValid && checkBoxChecked
    //submit the form if formValid is true
    if (formValid) {
        spinner.style.display = 'flex';
        signupBtn.style.color = '#2B7A78';
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        let authToken;

        // Send sign up form details to backend
        fetch('https://termsbuddy.herokuapp.com/api/users/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => {
            if (res.status === 201) {
                spinner.style.display = 'none';
                signupBtn.style.color = '#FEFEFE';
                window.location.href = 'https://abshaibu.github.io/test-P71/dashboard/dashboard.html'
                // window.location.href = 'http://127.0.0.1:5500/dashboard/dashboard.html';
            } else {
                spinner.style.display = 'none';
                signupBtn.style.color = '#FEFEFE';
                incorrect.style.display = 'flex';
                incorrect.innerHTML = 'Email already exists'

                setTimeout(() => {
                    incorrect.style.display = 'none';
                }, 2500)
            }
            return res.json();
        }).then(data => {
            authToken = {
                refresh: data.tokens.refresh,
                access: data.tokens.access,
                id: data.id
            }
            localStorage.setItem('credentials', JSON.stringify(authToken));
            form.reset();
            return authToken;
        }).catch(error => console.log(error));
    } else {

    }

})



//debounce delay function
const debounce = (fn, delay = 200) => {
    let timeoutId;
    return (...args) => {
        // cancel the previous timer
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // setup a new timer
        timeoutId = setTimeout(() => {
            fn.apply(null, args)
        }, delay);
    };
};

//gives an instant feedback to the user when values are entered 
form.addEventListener('input', debounce(e => {

    switch (e.target.id) {
        case 'firstName':
            checkFirstName();
            break;
        case 'lastName':
            checkLastName();
            break;

        case 'inputType':
            checkPassword();
            break;
        case 'checkBox':
            iScheckBoxChecked();
            break;
    }
}))
//input will return true if empty
const isRequired = (value) => {
    if (value === '') {
        return true
    } else {
        return false
    }
}
const isEmailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};
//regX must include 8 characters including numbers and special characters
const isPasswordSecure = (password) => {
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return re.test(password);
};
const checkFirstName = () => {
    let valid = false
    const firstname = firstName.value.trim()
    if (isRequired(firstname)) {
        setErrorFor(firstName)
    } else {
        setSuccessFor(firstName)
        valid = true
    }
    return valid
}
const checkLastName = () => {
    let valid = false
    const lastname = lastName.value.trim()
    if (isRequired(lastname)) {
        setErrorFor(lastName)
    } else {
        setSuccessFor(lastName)
        valid = true
    }
    return valid
}
const checkEmail = () => {
    let valid = false
    const Email = email.value.trim()
    if (!isEmailValid(Email)) {
        setErrorFor(email)
    } else {
        setSuccessFor(email)
        valid = true
    }
    return valid
}
const checkPassword = () => {
    let valid = false
    const password = inputType.value.trim()
    if (!isPasswordSecure(password)) {
        setErrorFor(inputType)
    } else {
        setSuccessFor(inputType)
        valid = true
    }
    return valid
}

const iScheckBoxChecked = () => {
    let valid = true
    if (checkBox.checked) {
        setSuccessForCheck(checkBox)
    } else {
        setErrorForCheck(checkBox)
        valid = false
    }
    return valid
}

let setErrorFor = (input) => {
    //get the parent div of the input
    const inputArea = input.parentElement;
    inputArea.className = 'svg_con error'
}
let setSuccessFor = (input) => {
    //get the parent div of the input
    const inputArea = input.parentElement;
    inputArea.className = 'svg_con success'
}
let setErrorForCheck = (input) => {
    //get the parent div of the input
    const inputArea = input.parentNode;
    inputArea.className = 'svg_con_two error'

}
let setSuccessForCheck = (input) => {
    //get the parent div of the input
    const inputArea = input.parentElement;
    inputArea.className = 'svg_con_two success'
}