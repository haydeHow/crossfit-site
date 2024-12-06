   // Function to fetch data from the API
   function fetchData() {
    fetch('http://localhost:3000/proxy-post')
        .then(response => response.json())
        .then(data => {
            document.getElementById("date_api").innerHTML = `<h2 class="date">${data[0]['date']}</h2>`;

            document.getElementById("warmup_description_api").innerHTML = `<p class="exercise_description">${data[0]['warmup_description']}</p>`;
            document.getElementById("strength_description_api").innerHTML = `<p class="exercise_description">${data[0]['strength_description']}</p>`;
            document.getElementById("wod_description_api").innerHTML = `<p class="exercise_description">${data[0]['wod_description']}</p>`;
            document.getElementById("cooldown_description_api").innerHTML = `<p class="exercise_description">${data[0]['cooldown_description']}</p>`;

            let warmup_movements = data[0]['warmup_movements'];
            let strength_movements = data[0]['strength_movements'];
            let wod_movements = data[0]['wod_movements'];
            let cooldown_movements = data[0]['cooldown_movements'];

            let warmup_content = "";
            let strength_content = "";
            let wod_content = "";
            let cooldown_content = "";

            for (const i in warmup_movements)
                warmup_content += `<p class="exercise">- ${warmup_movements[i]}</p>`;
            for (const i in strength_movements)
                strength_content += `<p class="exercise">- ${strength_movements[i]}</p>`;
            for (const i in wod_movements)
                wod_content += `<p class="exercise">- ${wod_movements[i]}</p>`;
            for (const i in cooldown_movements)
                cooldown_content += `<p class="exercise">- ${cooldown_movements[i]}</p>`;

            document.getElementById("warmup_movements").innerHTML = warmup_content;
            document.getElementById("strength_movements").innerHTML = strength_content;
            document.getElementById("wod_movements").innerHTML = wod_content;
            document.getElementById("cooldown_movements").innerHTML = cooldown_content;

        });
}

// Function to run `fetchData` once a day
function scheduleDailyUpdate() {
    // Run immediately on page load
    fetchData();

    // Check the current time every minute
    setInterval(() => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Check if it's 00:00 (midnight) or any specific time
        if (currentHour === 0 && currentMinute === 0) {
            fetchData();
        }
    }, 60000); // Check every minute
}

// Run the daily scheduler
window.onload = scheduleDailyUpdate;