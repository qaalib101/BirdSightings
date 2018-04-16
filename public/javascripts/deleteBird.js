// used to confirm deletion
var deleteButton = document.getElementById("deleteButton");

deleteButton.addEventListener("click", function(ev){
    var deleteConfirm = confirm("Are you sure you want to delete this?");

    if(!deleteConfirm){
        ev.preventDefault();
    }
});