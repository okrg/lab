import './styles/main.css';
import Alpine from 'alpinejs';
import persist from '@alpinejs/persist';

window.Alpine = Alpine;

Alpine.plugin(persist);

Alpine.data('costCalculator', function () {
  return {
    programType: null,
    gradeLevel: null,
    schedule: null,
    tuition: 0,
    monthly: 0,
    enrollmentDeposit: 0,
    applicationFee: 0,
    calculate() {},
    init() {
      Alpine.store('step', 'programType');
      this.$watch('programType', function (val) {
        Alpine.store('step', val);
      });
      this.$watch('gradeLevel', function (val) {
        Alpine.store('step', val);
      });
    },
  };
});

Alpine.data('banner', function () {
  return {
    show: this.$persist(false),
    dismissed: this.$persist(false),

    dismiss() {
      this.show = false;
      this.dismissed = true;
    },

    init() {
      if (!this.dismissed) {
        setTimeout(() => {
          this.show = true;
        }, 1500);
      }
    },
  };
});

Alpine.start();

const env = document.querySelector('body').dataset.env;

// Check that service workers are supported
if ('serviceWorker' in navigator && env === 'production') {
  // use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    try {
      navigator.serviceWorker.register('/sw.js');
    } catch (error) {
      console.error('Service worker registration failed: ', error);
    }
  });
}
