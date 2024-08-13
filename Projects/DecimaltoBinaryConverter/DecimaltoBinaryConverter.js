const numberInput = document.getElementById("number-input");
const convertBtn = document.getElementById("convert-btn");
const result = document.getElementById("result");
const animationContainer = document.getElementById("animation-container");

const decimalToBinarySteps = (input) => {
  const steps = [];
  let current = input;

  while (current > 1) {
    const step = {
      inputVal: current,
      marginTop: steps.length === 0 ? 300 : -200,
      addElDelay: (steps.length + 1) * 1000,
      msg: `decimalToBinary(${current}) returns "${Math.floor(current / 2)}" + ${current % 2} (${current} % 2). Then it pops off the stack.`,
      showMsgDelay: (steps.length + 1) * 5000,
      removeElDelay: (steps.length + 1) * 10000,
    };
    steps.push(step);
    current = Math.floor(current / 2);
  }

  // Add the base case
  steps.push({
    inputVal: 1,
    marginTop: -200,
    addElDelay: (steps.length + 1) * 1000,
    msg: `decimalToBinary(1) returns '1' (base case) and gives that value to the stack below. Then it pops off the stack.`,
    showMsgDelay: (steps.length + 1) * 5000,
    removeElDelay: (steps.length + 1) * 10000,
  });

  return steps.reverse();
};

const showAnimation = (inputInt) => {
  result.innerText = "Call Stack Animation";

  const animationData = decimalToBinarySteps(inputInt);

  animationData.forEach((obj) => {
    setTimeout(() => {
      animationContainer.innerHTML += `
        <p id="${obj.inputVal}" style="margin-top: ${obj.marginTop}px;" class="animation-frame">
          decimalToBinary(${obj.inputVal})
        </p>
      `;
    }, obj.addElDelay);

    setTimeout(() => {
      document.getElementById(obj.inputVal).textContent = obj.msg;
    }, obj.showMsgDelay);

    setTimeout(() => {
      document.getElementById(obj.inputVal).remove();
    }, obj.removeElDelay);
  });

  setTimeout(() => {
    result.textContent = decimalToBinary(inputInt);
  }, (animationData.length + 1) * 10000);
};

const checkUserInput = () => {
  const inputInt = parseInt(numberInput.value);

  if (!numberInput.value || isNaN(inputInt) || inputInt < 0) {
    alert("Please provide a decimal number greater than or equal to 0");
    return;
  }

  showAnimation(inputInt);
  numberInput.value = "";
};

convertBtn.addEventListener("click", checkUserInput);

numberInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkUserInput();
  }
});
