"use strict";

let services = document.querySelector(".calculator-services");
let slider = document.querySelector("#volume");
let slider_min = document.querySelector(".calculator-slider__value--min");
let slider_max = document.querySelector(".calculator-slider__value--max");
let slider_value = document.querySelector(".slider-value");
let intres_value = document.querySelector(".intres-value");
let contract_value = document.querySelector(".contract-value");
let contract_free = document.querySelector(".contract-fee");
let contract_period = document.querySelector(".contract-period");
let period_select = document.querySelector("#period");
let monthly_payment = document.querySelector(".monthly-payment");

async function getResponse() {
  let response = await fetch("../data.json");
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
            slider_min.innerHTML = content[volume][key].price_range[0] + " €";
            slider_max.innerHTML = content[volume][key].price_range[1] + " €";

            slider.value = content[volume][key].default_value;
            slider_value.innerHTML = content[volume][key].default_value;

            function sliderFunc() {
              let i = 0;
              for (let range in content[volume][key].intres) {
                i++;
                let num = Number(slider.value);

                slider_value.innerHTML = num;

                let low = range.split("-")[0];
                let high = range.split("-")[1];

                if (num > low && num < high) {
                  intres_value.innerHTML = content[volume][key].intres[range];
                  contract_value.innerHTML =
                    content[volume][key].contract_fee[i - 1] + " €";
                  contract_free.innerHTML =
                    content[volume][key].monthly_fee[i - 1] + " €";

                  let monthlyIntressedPay =
                    ((content[volume][key].default_value *
                      content[volume][key].intres[range].split("%")[0]) /
                      100 +
                      content[volume][key].default_value) /
                    content[volume][key].default_period;

                  let monhlyContractPay =
                    content[volume][key].contract_fee[i - 1] /
                    content[volume][key].default_period;

                  let monthlyServciePay =
                    content[volume][key].monthly_fee[i - 1];

                  monthly_payment.innerHTML =
                    (
                      monthlyIntressedPay +
                      monhlyContractPay +
                      monthlyServciePay
                    ).toFixed(2) + " €";

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
                    period_select.value =
                      content[volume][key].default_period + " kuud";
                  }
                  contract_period.innerHTML =
                    content[volume][key].default_period + " kuud";
                }
              }
            }

            sliderFunc();

            slider.addEventListener("change", function () {
              sliderFunc();
            });

            period_select.addEventListener("change", function () {
              contract_period.innerHTML = this.value;
            });
          }
        }
      });
    }
  }
}

getResponse();
