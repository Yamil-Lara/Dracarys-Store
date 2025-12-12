function showModal(description) {
  document.getElementById("modal-text").textContent = description;
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}
