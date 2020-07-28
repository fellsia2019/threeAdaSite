let indexpage = document.querySelector('body').classList.contains('index');

// window events ----
window.onload = () => {
  if(!!chart) chartInit();

  const burger = document.querySelector('a.target-burger');
  burger.addEventListener('click', (ev) => {
    [...document.querySelectorAll('.burger-el')].forEach((el) => {
      el.classList.toggle('toggled')
    })
  });

  AOS.init({
    once: true,
    mirror: false
  });
};

window.onresize = () => {
  if (!!chart) chartInit();
};

// CHART ----
const chart = document.querySelector('.rise');
const pointData = [1, 1.45, 1.83, 2.27, 3.6, 4.1, 7.8, 15.6];
const riseChart = document.querySelector('.rise-chart');
const risePoints = document.querySelectorAll('.rise-point');
const chartInit = () => {
  const pointW = (riseChart.offsetWidth - 160) / risePoints.length;
  risePoints.forEach((point, inx) => {
    point.style.width = pointW + 'px';
    point.style.left = `${80 + (inx ?  pointW * inx : 0)}px`;
    point.style.top = `${inx ? 100 - (pointData[inx] * riseChart.offsetHeight / 100) : 100}%`;
    point.querySelector('.btn').textContent = `${pointData[inx]}%`;

    point.dataset.aos = 'zoom-in-up';
    point.dataset.aosDelay = 200 * (inx + 1);
    point.dataset.aosDuration = 800;
  });
};



// AOS animation
document.querySelectorAll('.aos-group').forEach((el) => {
  el.querySelectorAll('[data-aos]').forEach((aos, index) => {
    aos.dataset.aosDelay = 200 * (index + 1);
  })
});

