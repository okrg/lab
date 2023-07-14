import './styles/main.css';
import Alpine from 'alpinejs';
import persist from '@alpinejs/persist';

window.Alpine = Alpine;

Alpine.plugin(persist);
window.Components = {};
window.Components.decodeHTMLEntities = function (text) {
  let textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};
window.Components.formatPrice = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

Alpine.data('checkoutSimulator', function () {
  return {
    showContactSection: true,
    showPaymentSection: false,
    showConfirmationSection: false,
    showDepositLineItem: true,
    modelTag: null,
    modelLabel: null,
    sidingLabel: null,
    sidingColorLabel: null,
    floorLabel: null,
    doorLabel: null,
    eavesLabel: null,
    trimLabel: null,
    confirmMessage: null,
    checkoutResponse: null,
    formData: {
      order_id: null,
      order_description: null,
      model: null,
      amount: null,
      depositAmount: null,
      feeAmount: null,
      totalOrderAmount: null,
      totalCreditOrderAmount: null,
      totalCheckOrderAmount: null,
      formattedAmount: null,
      formattedDepositAmount: null,
      formattedFeeAmount: null,
      formattedTotalCreditOrderAmount: null,
      formattedTotalCheckOrderAmount: null,
      same_as_shipping: true,
      acknowledge: false,
      payment: 'check',
      payment_token: null,
      first_name: null,
      last_name: null,
      address1: null,
      address2: null,
      city: null,
      state: null,
      zip: null,
      country: 'United States',
      phone: null,
      email: null,
      shipping_firstname: null,
      shipping_lastname: null,
      shipping_address1: null,
      shipping_address2: null,
      shipping_city: null,
      shipping_state: null,
      shipping_zip: null,
      shipping_country: 'United States',
    },
    startPaymentRequest() {
      this.confirmMessage = null;
      // eslint-disable-next-line no-undef
      CollectJS.startPaymentRequest();
    },
    invalidPaymentInfo() {
      this.confirmMessage = 'Payment information is incomplete.';
    },
    validationAlert(field) {
      this.confirmMessage = field + ' is missing.';
    },
    submitCheckoutForm() {
      if (this.formData.email == null) {
        this.validationAlert('Email address');
        return;
      }
      if (this.formData.shipping_firstname == null) {
        this.validationAlert('First name');
        return;
      }
      if (this.formData.shipping_lastname == null) {
        this.validationAlert('Last name');
        return;
      }
      if (this.formData.shipping_address1 == null) {
        this.validationAlert('Address');
        return;
      }
      if (this.formData.shipping_city == null) {
        this.validationAlert('City');
        return;
      }
      if (this.formData.shipping_state == null) {
        this.validationAlert('State');
        return;
      }
      if (this.formData.shipping_zip == null) {
        this.validationAlert('Zip code');
        return;
      }
      if (this.formData.phone == null) {
        this.validationAlert('Phone');
        return;
      }

      if (this.formData.same_as_shipping) {
        this.formData.first_name = this.formData.shipping_firstname;
        this.formData.last_name = this.formData.shipping_lastname;
        this.formData.address1 = this.formData.shipping_address1;
        this.formData.address2 = this.formData.shipping_address2;
        this.formData.city = this.formData.shipping_city;
        this.formData.state = this.formData.shipping_state;
        this.formData.zip = this.formData.shipping_zip;
        this.formData.country = this.formData.shipping_country;
      }
      const replaced = this.formData.last_name.replace(/[^a-z0-9 -]/gi, '');
      const stamp = Date.now();
      (this.formData.order_id = replaced.toLowerCase() + '-' + stamp),
        (this.formData.order_description =
          window.Components.decodeHTMLEntities(this.modelLabel) +
          ' (' +
          this.sidingLabel +
          ' / ' +
          this.sidingColorLabel +
          ' / ' +
          this.doorLabel +
          ' / ' +
          this.eavesLabel +
          ' / ' +
          this.trimLabel +
          ' / ' +
          this.floorLabel +
          ')');

      console.log('ready to submit POST via fetch or something');
      console.log(this.formData);

      // Convert the JSON object to a string with indentation
      const jsonString = JSON.stringify(this.formData, null, 2);

      // Format the string as desired
      const formattedString = jsonString
        .replace(/["{}]/g, '') // remove curly braces and quotes
        .replace(/,/g, '<br>') // add line breaks after commas
        .replace(/:/g, ': '); // add spaces after colons

      // Set the formatted string as the response
      this.checkoutResponse = formattedString;
    },
    collectConfigure() {
      console.log('Loading Versapay');
      // eslint-disable-next-line no-undef
      CollectJS.configure({
        //"paymentSelector" : "#confirmOrder",
        variant: 'inline',
        styleSniffer: 'false',
        googleFont: 'Montserrat:400',
        customCss: {
          color: '#000000',
          'background-color': '#ffffff',
          'border-color': '#dddddd',
          padding: '8px',
          'border-radius': '6px',
          'border-style': 'solid',
          'font-size': '16px',
        },
        invalidCss: {
          color: 'black',
          'background-color': '#ffffff',
        },
        validCss: {
          color: 'black',
          'background-color': '#ffffff',
        },
        placeholderCss: {
          color: '#bbbbbb',
          'background-color': '#ffffff',
        },
        focusCss: {
          color: '#999999',
          'background-color': '#ffffff',
        },
        fields: {
          ccnumber: {
            selector: '#ccnumber',
            title: 'Card Number',
            placeholder: '0000 0000 0000 0000',
          },
          ccexp: {
            selector: '#ccexp',
            title: 'Card Expiration',
            placeholder: 'MM/YY',
          },
          cvv: {
            display: 'show',
            selector: '#cvv',
            title: 'CVV Code',
            placeholder: '***',
          },
          checkaccount: {
            selector: '#checkaccount',
            title: 'Account Number',
            placeholder: '0000000000',
          },
          checkaba: {
            selector: '#checkaba',
            title: 'Routing Number',
            placeholder: '000000000',
          },
          checkname: {
            selector: '#checkname',
            title: 'Name on Checking Account',
            placeholder: 'Customer Name',
          },
        },
        currency: 'USD',
        country: 'US',
        validationCallback: function (field, status, message) {
          if (status) {
            message = field + ' is now OK: ' + message;
          } else {
            message = field + ' is now Invalid: ' + message;
            if (
              document.querySelector('#credit-card').checked &&
              field == 'ccnumber'
            ) {
              window.dispatchEvent(new CustomEvent('invalid-payment-info'));
            }
            if (
              document.querySelector('#credit-card').checked &&
              field == 'ccexp'
            ) {
              window.dispatchEvent(new CustomEvent('invalid-payment-info'));
            }
            if (
              document.querySelector('#etransfer').checked &&
              field == 'checkaba'
            ) {
              window.dispatchEvent(new CustomEvent('invalid-payment-info'));
            }
            if (
              document.querySelector('#etransfer').checked &&
              field == 'checkaccount'
            ) {
              window.dispatchEvent(new CustomEvent('invalid-payment-info'));
            }
            if (
              document.querySelector('#etransfer').checked &&
              field == 'checkname'
            ) {
              window.dispatchEvent(new CustomEvent('invalid-payment-info'));
            }
          }
          console.log(message);
        },
        timeoutDuration: 10000,
        timeoutCallback: function () {
          console.log(
            "The tokenization didn't respond in the expected timeframe.  This could be due to an invalid or incomplete field or poor connectivity",
          );
        },
        fieldsAvailableCallback: function () {
          console.log('Collect.js loaded the fields onto the form');
        },
        callback: function (response) {
          document.querySelector('#payment_token').value = response.token;
          document.querySelector('#payment_token')._x_model.set(response.token);
          window.dispatchEvent(new CustomEvent('submit-checkout-form'));
        },
      });
    },
    initCheckoutForm() {
      this.modelLabel = 'Test Model';
      this.formData.model = 'test-model';
      //this.formData.amount = 1500
      //generate a random amount between 500 and 2500
      this.formData.amount = Math.floor(Math.random() * (2500 - 500 + 1) + 500);
      this.formData.depositAmount = this.formData.amount;
      this.formData.feeAmount = this.formData.depositAmount * 0.03;
      this.showDepositLineItem = false;

      this.formData.totalCreditOrderAmount =
        this.formData.depositAmount + this.formData.feeAmount;
      this.formData.totalCheckOrderAmount = this.formData.depositAmount;

      this.formData.formattedAmount = window.Components.formatPrice.format(
        this.formData.amount,
      );
      this.formData.formattedDepositAmount =
        window.Components.formatPrice.format(this.formData.depositAmount);
      this.formData.formattedFeeAmount = window.Components.formatPrice.format(
        this.formData.feeAmount,
      );
      this.formData.formattedTotalCreditOrderAmount =
        window.Components.formatPrice.format(
          this.formData.totalCreditOrderAmount,
        );
      this.formData.formattedTotalCheckOrderAmount =
        window.Components.formatPrice.format(
          this.formData.totalCheckOrderAmount,
        );
      this.collectConfigure();
    },
  };
});

Alpine.data('zipCodeApi', function () {
  return {
    zipCode: null,
    zipCodeResponse: null,
    submitZipCode() {
      let zipCode = this.zipCode;
      let apiUrl = `https://dev.bypboh.com/api/zipcode`;
      if (zipCode && zipCode.trim().length >= 5) {
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postal_code: zipCode, brand: 'Big Timber' }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            // Convert the JSON object to a string with indentation
            const jsonString = JSON.stringify(data, null, 2);

            // Format the string as desired
            const formattedString = jsonString
              .replace(/["{}]/g, '') // remove curly braces and quotes
              .replace(/,/g, '<br>') // add line breaks after commas
              .replace(/:/g, ': '); // add spaces after colons

            // Set the formatted string as the response
            this.zipCodeResponse = formattedString;
            return data;
          })
          .catch((error) => {
            console.error(
              'There was a problem with the fetch operation:',
              error,
            );
          });
      } else {
        alert('Please enter a valid zip code.');
      }
    },
  };
});

Alpine.data('costCalculator', function () {
  return {
    selectedProgramText: null,
    selectedScheduleText:
      '<p class="ml-3">Select a program to see tuition and fees.</p>',
    programType: null,
    gradeLevel: null,
    schedule: null,
    tuition: 'Select program...',
    monthly: 'Select program...',
    applicationFee: 'Select program...',
    enrollmentDeposit: 'Select program...',
    costs: {
      Preschool: {
        mTMornings: {
          tuitionCost: '$8,500',
          monthlyPayment: '$612.50/mo',
          applicationFee: '$90',
        },
        mTFullDay: {
          tuitionCost: '$11,230',
          monthlyPayment: '$840.00/mo',
          applicationFee: '$90',
        },
        wThFMornings: {
          tuitionCost: '$10,600',
          monthlyPayment: '$787.50/mo',
          applicationFee: '$90',
        },
        wThFFullDay: {
          tuitionCost: '$12,975',
          monthlyPayment: '$985.42/mo',
          applicationFee: '$90',
        },
        pmFMornings: {
          tuitionCost: '$16,275',
          monthlyPayment: '$1,260.42/mo',
          applicationFee: '$90',
        },
        pmFFullDay: {
          tuitionCost: '$21,525',
          monthlyPayment: '$1,697.92/mo',
          applicationFee: '$90',
        },
      },
      Kindergarten: {
        mFMornings: {
          tuitionCost: '$17,220',
          monthlyPayment: '$1,339.17/mo',
          applicationFee: '$90',
        },
        fiveMorningsMTAfternoons: {
          tuitionCost: '$20,160',
          monthlyPayment: '$1,584.17/mo',
          applicationFee: '$90',
        },
        fiveMorningsWThFAfternoons: {
          tuitionCost: '$20,900',
          monthlyPayment: '$1,645.83/mo',
          applicationFee: '$90',
        },
        mFFullDay: {
          tuitionCost: '$22,375',
          monthlyPayment: '$1,768.75/mo',
          applicationFee: '$90',
        },
      },
      'Lower School - Middle School': {
        grades1To5: {
          tuitionCost: '$25,200',
          monthlyPayment: '$2,004.17/mo',
          applicationFee: '$90',
        },
        grades6To8: {
          tuitionCost: '$27,400',
          monthlyPayment: '$2,187.50/mo',
          applicationFee: '$90',
        },
        preschoolToGrade5: {
          tuitionCost: '$22/day flat-rate',
          monthlyPayment: 'N/A',
          applicationFee: 'N/A',
        },
      },
      'High School': {
        grades9To12: {
          tuitionCost: '$30,240',
          monthlyPayment: '$2,424.17/mo',
          applicationFee: '$90',
        },
      },
      'Summer Camp': {
        fullDayJunAug: {
          tuitionCost: '$500/week or <br>$4,275 for 9 weeks',
          monthlyPayment: 'N/A',
          applicationFee: 'N/A',
        },
        morningsOnlyJunAug: {
          tuitionCost: '$400/week or <br>$3,420 for 9 weeks',
          monthlyPayment: 'N/A',
          applicationFee: 'N/A',
        },
        specialtyCamps: {
          tuitionCost: 'TBD',
          monthlyPayment: 'N/A',
          applicationFee: 'N/A',
        },
      },
    },
    calculate(program, schedule) {
      this.tuition = this.costs[program][schedule].tuitionCost;
      this.monthly = this.costs[program][schedule].monthlyPayment;
      this.applicationFee = this.costs[program][schedule].applicationFee;
      if (this.applicationFee != 'N/A') {
        this.enrollmentDeposit = '$1,150';
      } else {
        this.enrollmentDeposit = 'N/A';
      }
    },
    selectSchedule(el) {
      this.schedule = el.target.value;
      let program = el.target.getAttribute('data-program');
      this.calculate(program, this.schedule);

      this.selectedProgramText = program;
      this.selectedScheduleText =
        el.target.parentNode.querySelector('div.w-full').innerHTML;
    },
    selectProgramType(el) {
      Alpine.store('step', el.target.value);
      this.programType = el.target.value;
    },
    selectGradeLevel(el) {
      Alpine.store('step', el.target.value);
      this.gradeLevel = el.target.value;
    },
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
