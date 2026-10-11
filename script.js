// 5주차: 습득 알림 신청 폼에 입력값 검사와 처리 결과 안내 기능을 추가합니다.

// 1. 필요한 HTML 요소를 선택합니다.
const subscribeForm = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribe-message");

// 2. 상태를 저장할 변수를 만듭니다.
const schoolDomain = ".ac.kr";
let subscribedEmails = []; // 이미 신청한 이메일 목록
let submitCount = 0; // 신청 버튼을 누른 횟수

// 안내 문구와 스타일을 한 번에 바꾸는 함수입니다.
// type: "success" | "error" | "info"
function showMessage(text, type) {
  subscribeMessage.textContent = text;
  subscribeMessage.classList.remove("is-success", "is-error", "is-info");
  subscribeMessage.classList.add("is-" + type);

  // 입력값이 잘못됐을 때는 입력창도 빨간 테두리로 표시합니다.
  if (type === "error") {
    emailInput.classList.add("is-invalid");
  } else {
    emailInput.classList.remove("is-invalid");
  }
}

// 3. 입력값에 따라 다른 결과를 보여주는 함수입니다.
function handleSubscribe(event) {
  event.preventDefault();
  submitCount += 1;

  const email = emailInput.value.trim().toLowerCase();

  if (email === "") {
    showMessage("이메일을 입력해 주세요.", "error");
    emailInput.focus();
  } else if (!email.includes("@") || !email.includes(".")) {
    showMessage("이메일 형식이 올바르지 않습니다. 예: student@school.ac.kr", "error");
    emailInput.focus();
  } else if (!email.endsWith(schoolDomain)) {
    showMessage("학교 이메일(" + schoolDomain + "로 끝나는 주소)만 신청할 수 있습니다.", "error");
    emailInput.focus();
  } else if (subscribedEmails.includes(email)) {
    showMessage(email + " 은(는) 이미 알림을 신청한 이메일입니다.", "info");
  } else {
    subscribedEmails.push(email);
    showMessage(email + " 으로 습득물 알림 신청이 완료되었습니다.", "success");

    // 4. 신청이 끝나면 버튼 상태를 바꿔 중복 신청을 막습니다.
    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true;
  }

  console.log("신청 시도 횟수:", submitCount, "/ 신청된 이메일:", subscribedEmails);
}

// 입력창 내용이 바뀌면 버튼을 다시 누를 수 있게 되돌립니다.
function handleEmailInput() {
  emailInput.classList.remove("is-invalid");

  if (subscribeButton.disabled === true) {
    subscribeButton.disabled = false;
    subscribeButton.textContent = "알림 신청하기";
  }
}

// 이벤트와 함수를 연결합니다.
subscribeForm.addEventListener("submit", handleSubscribe);
emailInput.addEventListener("input", handleEmailInput);
