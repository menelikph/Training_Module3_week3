const productList = document.getElementById("product-list");
const form = document.getElementById("product-form");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");

// Fetch and display products (GET)
fetch("http://localhost:3000/productos")
  .then(response => response.json())
  .then(data => {
    console.log("Fetched products:", data);

    data.forEach(product => {
      renderProduct(product);
    });
  })
  .catch(error => {
    console.log("An error occurred:", error);
  });

// Render a single product on the page
function renderProduct(product) {
  const item = document.createElement("li");
  item.innerHTML = `${product.nombre} - $${product.precio}
    <button data-id="${product.id}" class="edit-btn">Editar</button>
    <button data-id="${product.id}" class="delete-btn">Eliminar</button>`;
  productList.appendChild(item);
}

// Handle new product form submission (POST)
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form refresh

  const newProduct = {
    nombre: nameInput.value,
    precio: parseFloat(priceInput.value)
  };

  fetch("http://localhost:3000/productos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Product added:", data);
      renderProduct(data); // Add to list without reloading
      form.reset(); // Clear form
    })
    .catch(error => {
      console.log("Error adding product:", error);
    });
});

// Handle edit and delete buttons using event delegation
document.addEventListener("click", function (event) {
  const id = event.target.getAttribute("data-id");

  // Edit product (PATCH)
  if (event.target.classList.contains("edit-btn")) {
    const newName = prompt("New product name:");
    const newPrice = prompt("New product price:");

    if (newName && newPrice) {
      fetch(`http://localhost:3000/productos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: newName,
          precio: parseFloat(newPrice)
        })
      })
        .then(response => response.json())
        .then(updated => {
          console.log("Product updated:", updated);
          location.reload(); // Refresh to see changes
        })
        .catch(error => {
          console.log("Error updating product:", error);
        });
    }
  }

  // Delete product (DELETE)
  if (event.target.classList.contains("delete-btn")) {
    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      fetch(`http://localhost:3000/productos/${id}`, {
        method: "DELETE"
      })
        .then(() => {
          console.log("Product deleted");
          location.reload(); // Refresh to remove from list
        })
        .catch(error => {
          console.log("Error deleting product:", error);
        });
    }
  }
});
