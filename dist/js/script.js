"use strict";

let services = document.querySelector(".calculator-services");
let slider = document.querySelector("#volume");
let slider_min = document.querySelector(".calculator-slider__value--min");
let slider_max = document.querySelector(".calculator-slider__value--max");
let slider_value = document.querySelector(".slider-value");
let intres_value = document.querySelector(".intres-value");
let instalment = document.querySelector("#instalment");
let contract_value = document.querySelector(".contract-value");
let contract_free = document.querySelector(".contract-fee");
let contract_period = document.querySelector(".contract-period");
let contract_total = document.querySelector(".contract-total");
let period_select = document.querySelector("#period");
let monthly_payment = document.querySelector(".monthly-payment");

let btn = document.querySelector(".calculator__btn");
let btn_close = document.querySelector(".close");
let popup = document.querySelector(".popup");

let runningValue = document.querySelector(".js-value");

async function getResponse() {
  let response = await fetch("data.json");
  let content = await response.json();

  for (let volume in content) {
    for (let key in content[volume]) {
      let label = document.createElement("label");
      let input = document.createElement("input");
      let span = document.createElement("span");

      input.setAttribute("type", "checkbox");

      label.classList.add("service-item");
      span.classList.add("checkmark");

      label.innerHTML = content[volume][key].name;
      services.append(label);

      label.append(input);
      label.append(span);

      input.addEventListener("change", function () {
        if (input.checked) {
          let inputs = document.querySelectorAll("input[type=checkbox]");
          for (let input of inputs) {
            input.checked = false;
            input.parentElement.style.background = "white";
          }
          input.checked = true;
          input.parentElement.style.background = "#f7fafa";

          if (this.parentElement.textContent === content[volume][key].name) {
            slider.setAttribute("min", content[volume][key].price_range[0]);
            slider.setAttribute("max", content[volume][key].price_range[1]);
            slider_min.innerHTML = content[volume][key].price_range[0] + " ???";
            slider_max.innerHTML = content[volume][key].price_range[1] + " ???";

            slider.value = content[volume][key].default_value;
            slider_value.value = content[volume][key].default_value;

            contract_period.innerHTML =
              content[volume][key].default_period + " kuud";

            let period = 0;
            let instalment_sum = 0;
            let manualSum = 0;

            function sliderFunc() {
              let i = 0;
              for (let range in content[volume][key].intres) {
                i++;
                let num = Number(slider.value);

                if (manualSum == 0) {
                  slider_value.value = num;
                } else {
                  slider_value.value = manualSum;

                  if (
                    slider_value.value > content[volume][key].price_range[1]
                  ) {
                    manualSum = content[volume][key].price_range[1];
                    slider_value.value = manualSum;
                  } else if (
                    slider_value.value < content[volume][key].price_range[0]
                  ) {
                    manualSum = content[volume][key].price_range[0];
                    slider_value.value = manualSum;
                  } else {
                    slider.value = manualSum;
                  }
                }

                let low = range.split("-")[0];
                let high = range.split("-")[1];

                if (num >= low && num <= high) {
                  intres_value.innerHTML = content[volume][key].intres[range];
                  contract_value.innerHTML =
                    content[volume][key].contract_fee[i - 1] + " ???";
                  contract_free.innerHTML =
                    content[volume][key].monthly_fee[i - 1] + " ???";

                  let options = period_select.querySelectorAll("option");
                  for (let opt of options) {
                    opt.remove();
                  }
                  for (
                    let j = 1;
                    j <= content[volume][key].period[i - 1] / 6;
                    j++
                  ) {
                    let option = document.createElement("option");
                    option.innerHTML = j * 6 + " kuud";
                    period_select.append(option);
                    if (period == 0) {
                      period_select.value =
                        content[volume][key].default_period + " kuud";
                    } else {
                      period_select.value = period + " kuud";
                    }
                  }

                  let interest_rate = Number(
                    content[volume][key].intres[range].split("%")[0]
                  );

                  let price = Number(slider.value);
                  let years = 0;
                  if (period == 0) {
                    years = content[volume][key].default_period / 12;
                  } else {
                    years = period / 12;
                  }
                  let monthlyIntressedPay;

                  function monthlyInt(price, pay, percent, years) {
                    var i = parseFloat(percent / 100 / 12);
                    var n = parseFloat(years * 12);
                    var r =
                      (price - pay) *
                      ((i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1));
                    monthlyIntressedPay = Number(r.toFixed(2));
                  }

                  monthlyInt(price, instalment_sum, interest_rate, years);

                  let monhlyContractPay;
                  let totalPayment;
                  // if (period == 0) {
                  //   monthlyIntressedPay =
                  //     ((Number(slider.value) *
                  //       content[volume][key].intres[range].split("%")[0]) /
                  //       100 +
                  //       Number(slider.value) -
                  //       instalment_sum) /
                  //     content[volume][key].default_period;
                  // } else {
                  //   monthlyIntressedPay =
                  //     ((Number(slider.value) *
                  //       content[volume][key].intres[range].split("%")[0]) /
                  //       100 +
                  //       Number(slider.value) -
                  //       instalment_sum) /
                  //     period;
                  // }

                  if (period == 0) {
                    monhlyContractPay =
                      content[volume][key].contract_fee[i - 1] /
                      content[volume][key].default_period;
                  } else {
                    monhlyContractPay =
                      content[volume][key].contract_fee[i - 1] / period;
                  }

                  let monthlyServciePay =
                    content[volume][key].monthly_fee[i - 1];

                  if (period == 0) {
                    totalPayment =
                      (monthlyIntressedPay +
                        monhlyContractPay +
                        monthlyServciePay) *
                      content[volume][key].default_period;
                  } else {
                    totalPayment =
                      (monthlyIntressedPay +
                        monhlyContractPay +
                        monthlyServciePay) *
                      period;
                  }

                  monthly_payment.innerHTML =
                    (
                      monthlyIntressedPay +
                      monhlyContractPay +
                      monthlyServciePay
                    ).toFixed(2) + " ???";

                  contract_total.innerHTML = totalPayment.toFixed(2) + " ???";
                }
              }
            }

            sliderFunc();

            period_select.value = content[volume][key].default_period + " kuud";

            function manualFunc() {
              manualSum = slider_value.value;
            }

            function valueFunc() {
              instalment_sum = Number(instalment.value);
              if (instalment_sum >= slider.value) {
                instalment_sum = 0;
                instalment.value = 0;
                instalment.style.borderBottom = "3px solid #e03416";
              } else {
                instalment.style.borderBottom = "3px solid #99a0a6";
              }
            }

            period_select.addEventListener("input", function () {
              contract_period.innerHTML = period_select.value;
              period = Number(period_select.value.split("kuud")[0]);
              sliderFunc();
            });

            slider.addEventListener("input", function () {
              let value = slider.value;
              runningValue.innerHTML = slider.value;
              runningValue.style.left = value / 255 + "%";
              runningValue.style.display = "block";
              manualSum = slider.value;
              sliderFunc();
            });

            slider.addEventListener("mouseup", function () {
              runningValue.style.display = "none";
            });

            instalment.addEventListener("focusout", function () {
              valueFunc();
              sliderFunc();
            });
            instalment.addEventListener("keypress", function (e) {
              if (e.keyCode === 13) {
                valueFunc();
                sliderFunc();
              }
            });

            slider_value.addEventListener("focusout", function () {
              manualFunc();
              sliderFunc();
            });

            slider_value.addEventListener("keypress", function (e) {
              if (e.keyCode === 13) {
                manualFunc();
                sliderFunc();
              }
            });
          }
        } else {
          location.reload(true);
        }
      });
    }
  }
}

getResponse();

btn.addEventListener("click", function () {
  popup.style.display = "block";
});

btn_close.addEventListener("click", function () {
  popup.style.display = "none";
});
