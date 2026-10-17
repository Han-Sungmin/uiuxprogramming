// 5주차: 습득 알림 신청 폼에 입력값 검사와 처리 결과 안내 기능을 추가합니다.
// 6주차: click · input · change 이벤트와 탭 UI를 추가합니다.

// 1. 필요한 HTML 요소를 선택합니다.
const themeButton = document.querySelector("#themeButton");

const subscribeForm = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");
const keywordInput = document.querySelector("#keyword");
const keywordCount = document.querySelector("#keywordCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribe-message");

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

// 2. 상태를 저장할 변수를 만듭니다.
const schoolDomain = ".ac.kr";
const keywordMaxLength = 20;
const defaultSubscribeText = "학교 이메일(ac.kr)을 입력하면 습득물 알림을 보내드립니다.";
// 신청 목록은 변수에만 저장되므로 새로고침하면 사라집니다. (중복 확인도 현재 방문 동안만 가능)
let subscribedEmails = [];
let submitCount = 0; // 신청 버튼을 누른 횟수
let isSubmitted = false; // 방금 신청이 완료됐는지 여부

// ---------------------------------------------------------------
// click: 밝은 화면 ↔ 어두운 화면 전환
// ---------------------------------------------------------------
function handleThemeClick() {
  const isDark = document.body.classList.toggle("dark");

  themeButton.textContent = isDark ? "밝은 화면으로 보기" : "어두운 화면으로 보기";
  themeButton.setAttribute("aria-pressed", String(isDark));
}

// ---------------------------------------------------------------
// 신청 버튼 상태: 동의 여부와 신청 완료 여부에 따라 문구와 disabled를 함께 바꿉니다.
// ---------------------------------------------------------------
function updateSubscribeButton() {
  if (isSubmitted) {
    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true;
  } else if (!agreeCheck.checked) {
    subscribeButton.textContent = "수신 동의 후 신청 가능";
    subscribeButton.disabled = true;
  } else {
    subscribeButton.textContent = "알림 신청하기";
    subscribeButton.disabled = false;
  }
}

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

// 이전 처리 결과(오류·안내·완료 문구)를 지우고 처음 안내 문구로 되돌립니다.
function resetMessage() {
  subscribeMessage.textContent = defaultSubscribeText;
  subscribeMessage.classList.remove("is-success", "is-error", "is-info");
  emailInput.classList.remove("is-invalid");
}

// ---------------------------------------------------------------
// submit: 입력값에 따라 다른 결과를 보여줍니다. (5주차)
// ---------------------------------------------------------------
function handleSubscribe(event) {
  event.preventDefault();
  submitCount += 1;

  const email = emailInput.value.trim().toLowerCase();
  const keyword = keywordInput.value.trim();

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
    showMessage(email + " 은(는) 이번 방문에서 이미 알림을 신청한 이메일입니다.", "info");
  } else {
    subscribedEmails.push(email);

    if (keyword === "") {
      showMessage(email + " 으로 습득물 알림 신청이 완료되었습니다.", "success");
    } else {
      showMessage("'" + keyword + "'와(과) 비슷한 습득물이 등록되면 " + email + " 으로 알려드립니다.", "success");
    }

    // 신청이 끝나면 버튼 상태를 바꿔 중복 신청을 막습니다.
    isSubmitted = true;
    updateSubscribeButton();
  }

  console.log("신청 시도 횟수:", submitCount, "/ 신청된 이메일:", subscribedEmails);
}

// ---------------------------------------------------------------
// input: 이메일을 고치면 이전 결과 문구를 지우고 버튼을 다시 활성화합니다.
// ---------------------------------------------------------------
function handleEmailInput() {
  isSubmitted = false;
  resetMessage();
  updateSubscribeButton();
}

// input: 찾는 물건 글자 수를 바로 보여주고, 최대 글자 수에 닿으면 강조합니다.
function handleKeywordInput() {
  const currentLength = keywordInput.value.length;

  keywordCount.textContent = currentLength + " / " + keywordMaxLength;
  keywordCount.classList.toggle("is-full", currentLength >= keywordMaxLength);
  if (currentLength >= keywordMaxLength) {
    keywordCount.textContent += " (최대 글자 수)";
  }

  // 물건 정보를 바꿔도 새로 신청할 수 있도록 이전 결과를 초기화합니다.
  isSubmitted = false;
  resetMessage();
  updateSubscribeButton();
}

// ---------------------------------------------------------------
// change: 수신 동의 여부에 따라 문구 · 스타일 · 버튼 상태를 함께 바꿉니다.
// ---------------------------------------------------------------
function handleAgreeChange() {
  const agreed = agreeCheck.checked;

  agreeMessage.textContent = agreed
    ? "수신 동의 완료! 이제 알림을 신청할 수 있습니다."
    : "수신 동의에 체크하면 신청 버튼이 활성화됩니다.";
  agreeMessage.classList.toggle("is-ready", agreed);

  updateSubscribeButton();
}

// ---------------------------------------------------------------
// 탭 UI: 기존 상태 초기화 → 클릭한 탭 활성화
// ---------------------------------------------------------------
function resetTabsAndPanels() {
  tabs.forEach(function (tab) {
    tab.classList.remove("is-active");
    tab.setAttribute("aria-selected", "false");
  });
  panels.forEach(function (panel) {
    panel.classList.remove("is-active");
    panel.hidden = true;
  });
}

function activateTab(clickedTab) {
  const targetSelector = clickedTab.dataset.target;
  const targetPanel = document.querySelector(targetSelector);

  clickedTab.classList.add("is-active");
  clickedTab.setAttribute("aria-selected", "true");
  targetPanel.classList.add("is-active");
  targetPanel.hidden = false;
}

function handleTabClick(event) {
  resetTabsAndPanels();
  activateTab(event.currentTarget);
}

// 이벤트와 함수를 연결합니다.
themeButton.addEventListener("click", handleThemeClick);
subscribeForm.addEventListener("submit", handleSubscribe);
emailInput.addEventListener("input", handleEmailInput);
keywordInput.addEventListener("input", handleKeywordInput);
agreeCheck.addEventListener("change", handleAgreeChange);
tabs.forEach(function (tab) {
  tab.addEventListener("click", handleTabClick);
});
