const url = "http://127.0.0.1:5000/data";


fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json(); // Convert the response to a JavaScript object
  })
  .then(data => {
    // Use the JSON data here



    for (const value of data[0].wod_movements) {
      console.log(value); // This should print each string in the array
    }





  })
  .catch(error => {
    // Handle any errors that occur
    console.error('There has been a problem with your fetch operation:', error);
  });
