const dateElement = document.getElementById('date');
const currentDate = new Date().toDateString();
dateElement.textContent = currentDate;

// JavaScript to update workout information daily
// You can modify this part to add different workouts each day
document.getElementById('warmup-exercise1').textContent = '10 min light jog';
document.getElementById('warmup-exercise2').textContent = 'Dynamic stretches';


document.getElementById('olympic-description').textContent = 'EMOM for 10 Minutes:';
document.getElementById('olympic-exercise1').textContent = '3 Hang Cleans @75% of 1 rep max';
document.getElementById('olympic-exercise2').textContent = '5 Toes to Rings';

document.getElementById('wod-description').textContent = '5 Rounds for Time:';
document.getElementById('wod-exercise1').textContent = '- 15 Air Squats';
document.getElementById('wod-exercise2').textContent = '- 10 Push-Ups';
document.getElementById('wod-exercise3').textContent = '- 5 Burpees';

document.getElementById('cooldown-exercise1').textContent = '5 min walk';
document.getElementById('cooldown-exercise2').textContent = 'Static stretches';