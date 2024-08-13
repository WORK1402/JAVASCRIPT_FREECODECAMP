document.addEventListener("DOMContentLoaded", () => {
  const numberInput = document.getElementById("number-input");
  const convertBtn = document.getElementById("convert-btn");
  const result = document.getElementById("result");
  const animationContainer = document.getElementById("animation-container");

  const decimalToBinary = (input) => {
    if (input === 0 || input === 1) {
      return String(input);
    } else {
      return decimalToBinary(Math.floor(input / 2)) + (input % 2);
    }
  };

  const generateAnimationData = (input) => {
    const animationData = [];
    let currentVal = input;

    // Generating animation data
    while (currentVal > 1) {
      const nextVal = Math.floor(currentVal / 2);
      const message = `Binary: ${decimalToBinary(currentVal)} and gives that value to the stack below. Then it pops off the stack.`;

      animationData.push({
        inputVal: currentVal,
        msg: message,
      });

      currentVal = nextVal;
    }
    if(currentVal===1){
      const message =`Binary: 1 is the base case and is returned directly.`;
      animationData.push({
          inputVal: currentVal,
          msg: message
        });
    }
    return animationData;
  };

  const showAnimation = (inputVal) => {
    result.innerText = "Call Stack Animation";
    animationContainer.innerHTML = "";
  
    const animationData = generateAnimationData(inputVal);
    const length=animationData.length;
    console.log(animationData);
  
    // Add elements to the container
    animationData.forEach((obj, index) => {
      const addElDelay = index * 1000;
      setTimeout(() => {
        animationContainer.innerHTML += `
          <p id="step-${obj.inputVal}" class="animation-frame">
            decimalToBinary(${obj.inputVal})
          </p>
        `;
      }, addElDelay);
    });
  
    // Update and remove elements
    animationData.reverse().forEach((obj, index) => {
      const showMsgDelay = index * 1000 + animationData.length * 1000;
      const removeElDelay = showMsgDelay + 1000;
  
      setTimeout(() => {
        const element = document.getElementById(`step-${obj.inputVal}`);
        if (element) {
          element.textContent = obj.msg;
        }
      }, showMsgDelay);
  
      setTimeout(() => {
        const element = document.getElementById(`step-${obj.inputVal}`);
        if (element) {
          element.remove();
        }
      }, removeElDelay);
    });
  
    // Show the final result
    const totalDelay = animationData.length +2*(length)*1000; // Adjusted to ensure enough time
    setTimeout(() => {
      result.textContent = `${decimalToBinary(inputVal)}`;
      numberInput.value = ""; // Clear the input field after the animation is complete
    }, totalDelay);
  };

  const checkUserInput = () => {
    const inputInt = parseInt(numberInput.value);

    if (!numberInput.value || isNaN(inputInt) || inputInt < 0) {
      alert("Please provide a decimal number greater than or equal to 0");
      return;
    }

    showAnimation(inputInt);

    // numberInput.value = "";
  };

  convertBtn.addEventListener("click", checkUserInput);

  numberInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      checkUserInput();
    }
  });
});

document.getElementById('backButton').addEventListener('click', function() {
  window.history.back();
});
