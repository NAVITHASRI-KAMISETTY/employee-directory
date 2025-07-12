let currentPage = 1;
let itemsPerPage = 10;

function renderEmployees(list) {
  const container = document.getElementById("employee-list-container");
  container.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginated = list.slice(start, end);

  if (paginated.length === 0) {
    container.innerHTML = "<p>No employees found.</p>";
    return;
  }

  paginated.forEach(emp => {
    const card = document.createElement("div");
    card.className = "employee-card";
    card.innerHTML = `
      <h3>${emp.firstName} ${emp.lastName}</h3>
      <p>Email: ${emp.email}</p>
      <p>Department: ${emp.department}</p>
      <p>Role: ${emp.role}</p>
      <button class="edit-btn" data-id="${emp.id}">Edit</button>
      <button class="delete-btn" data-id="${emp.id}">Delete</button>
    `;
    container.appendChild(card);
  });

  document.getElementById("page-info").innerText = `Page ${currentPage}`;

  document.querySelectorAll(".edit-btn").forEach(btn => btn.onclick = handleEdit);
  document.querySelectorAll(".delete-btn").forEach(btn => btn.onclick = handleDelete);
}

function applyFilters() {
  const searchTerm = document.getElementById("search-input").value.toLowerCase();
  const dept = document.getElementById("department-filter").value;
  const sort = document.getElementById("sort-by").value;

  let filtered = [...mockEmployees];

  if (searchTerm) {
    filtered = filtered.filter(emp => emp.firstName.toLowerCase().includes(searchTerm) || emp.email.toLowerCase().includes(searchTerm));
  }

  if (dept) filtered = filtered.filter(emp => emp.department === dept);
  if (sort) filtered.sort((a, b) => a[sort].localeCompare(b[sort]));

  renderEmployees(filtered);
}

function handleDelete(e) {
  const id = Number(e.target.dataset.id);
  const i = mockEmployees.findIndex(emp => emp.id === id);
  if (i !== -1) mockEmployees.splice(i, 1);
  applyFilters();
}

function handleEdit(e) {
  const id = Number(e.target.dataset.id);
  const emp = mockEmployees.find(emp => emp.id === id);
  if (!emp) return;

  document.getElementById("first-name").value = emp.firstName;
  document.getElementById("last-name").value = emp.lastName;
  document.getElementById("email").value = emp.email;
  document.getElementById("department").value = emp.department;
  document.getElementById("role").value = emp.role;

  document.getElementById("employee-form").style.display = "block";

  document.querySelector(".save-btn").onclick = () => {
    emp.firstName = document.getElementById("first-name").value;
    emp.lastName = document.getElementById("last-name").value;
    emp.email = document.getElementById("email").value;
    emp.department = document.getElementById("department").value;
    emp.role = document.getElementById("role").value;
    document.getElementById("employee-form").style.display = "none";
    applyFilters();
  };
}

document.getElementById("add-employee-btn").onclick = () => {
  document.getElementById("employee-form").style.display = "block";
};

document.querySelector(".cancel-btn").onclick = () => {
  document.getElementById("employee-form").style.display = "none";
};

document.querySelector(".save-btn").onclick = () => {
  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const email = document.getElementById("email").value;
  const department = document.getElementById("department").value;
  const role = document.getElementById("role").value;

  if (!firstName || !lastName || !email || !department || !role) {
    alert("Fill all fields.");
    return;
  }

  const newEmp = {
    id: Date.now(),
    firstName,
    lastName,
    email,
    department,
    role
  };

  mockEmployees.push(newEmp);
  document.getElementById("employee-form").style.display = "none";
  applyFilters();
};

document.getElementById("items-per-page").onchange = (e) => {
  itemsPerPage = Number(e.target.value);
  currentPage = 1;
  applyFilters();
};

document.getElementById("prev-page").onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    applyFilters();
  }
};

document.getElementById("next-page").onclick = () => {
  currentPage++;
  applyFilters();
};

document.getElementById("search-input").oninput = applyFilters;
document.getElementById("department-filter").onchange = applyFilters;
document.getElementById("sort-by").onchange = applyFilters;

// Initial load
applyFilters();