const user_selection = document.getElementById("user-selection");

const create_option = (text) => {
    let option = document.createElement("option");

    option.value = text;
    option.appendChild(document.createTextNode(text));

    return option;
};

fetch("/users/list").then((response) => {
    response.json().then((array) => {
        for (let el of array) {
            let option = create_option(el);

            user_selection.appendChild(option);
        }
    });
})