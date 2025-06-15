// ✨ Spotlight effect for bg-clear
const spotlight = document.getElementById('spotlight');
if(spotlight) {
  document.addEventListener('mousemove', e => {
    const x = e.clientX + 'px';
    const y = e.clientY + 'px';
    spotlight.style.setProperty('--x', x);
    spotlight.style.setProperty('--y', y);
  });
}

// 🌀 Circular loading progress
const loadingScreen = document.getElementById('loading-screen');
const loadingText = document.getElementById('loading-text');
const progressCircle = document.querySelector('.progress-ring-circle');

if (progressCircle && loadingText && loadingScreen) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  progressCircle.style.strokeDasharray = `${circumference}`;
  progressCircle.style.strokeDashoffset = `${circumference}`;

  function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
  }

  let progress = 0;
  const interval = setInterval(() => {
    progress++;
    loadingText.textContent = `${progress}%`;
    setProgress(progress);
    if (progress >= 100) {
      clearInterval(interval);
      loadingScreen.classList.add('hidden');
    }
  }, 20); // 2s = 100 * 20ms
}
