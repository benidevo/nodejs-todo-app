// Edit Item
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-me")) {
    let userInput = prompt("Enter your new text", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
    if (userInput) {
      axios.post('/update-item', { text: userInput, id: e.target.getAttribute("data-id") }).then(() => {
        e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
      }).catch(() => console.log("Please try again later"));
    };
  };
});

// Delete item
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-me")) {
    if (confirm("Do you want to delete this item?")) {
      axios.post('/delete-item', { id: e.target.getAttribute("data-id") }).then(() => {
        return e.target.parentElement.parentElement.remove();
      }).catch(() => console.log("Please try again later"));;
    };
  };
});
