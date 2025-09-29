const user_selection = document.getElementById("user-selection");
const redirect_buton = document.getElementById("redirect");
let all_users = [];
let serializer = new Serializer('user');

const create_option = (value, text) => {
    let option = document.createElement("option");

    option.value = value;
    option.appendChild(document.createTextNode(text));

    return option;
};

fetch("/users/list").then((response) => {
    response.json().then((array) => {
        all_users = array;

        for (let { _id, username } of array) {
            let option = create_option(_id, username);

            user_selection.appendChild(option);
        }
    });
})

function isEmpty(obj) {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }

    return true;
}


redirect_buton.addEventListener('click', () => {
    let current_user = {};
    const current_id = user_selection.value;

    for (let user of all_users) {
        if (user._id == current_id) {
            current_user = user;
        }
    }

    if (isEmpty(current_user)) {
        return;
    }

    serializer.save(current_user);

    if (current_user.is_admin) {
        window.location.href = "/petshop";
    } else {
        window.location.href = "/booking";
    }
});