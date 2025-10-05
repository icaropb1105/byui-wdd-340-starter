'use strict';

const classificationList = document.querySelector('#classificationList');

classificationList.addEventListener('change', () => {
  const classification_id = classificationList.value;
  if (classification_id === "") {
    document.getElementById('inventoryDisplay').innerHTML = '';
    return; 
  }

  const classIdURL = `/inv/getInventory/${classification_id}`;

  fetch(classIdURL)
    .then(response => {
      if (response.ok) return response.json();
      throw new Error('Network response was not OK');
    })
    .then(data => {
      buildInventoryList(data);
    })
    .catch(error => {
      console.error('There was a problem:', error.message);
    });
});

// Function table
function buildInventoryList(data) {
  const inventoryDisplay = document.getElementById('inventoryDisplay');

  let dataTable = '<thead>';
  dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>';
  dataTable += '</thead>';

  dataTable += '<tbody>';

  data.forEach(vehicle => {
    dataTable += `<tr><td>${vehicle.inv_make} ${vehicle.inv_model}</td>`;
    dataTable += `<td><a href='/inv/edit/${vehicle.inv_id}' title='Click to update'>Modify</a></td>`;
    dataTable += `<td><a href='/inv/delete/${vehicle.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
  });

  dataTable += '</tbody>';

  inventoryDisplay.innerHTML = dataTable;
}
