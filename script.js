// 5주차: 습득 알림 신청 폼에 입력값 검사와 처리 결과 안내 기능을 추가합니다.
// 6주차: click · input · change 이벤트와 탭 UI를 추가합니다.
// 7주차: 분실물 신고 흐름(시작 → 물건 정보 → 장소·연락 → 내용 확인 → 완료)을 추가합니다.
// 중간고사: 완료한 신고를 '내 신고 내역'에 모아 다시 열기 · 조건으로 찾기 · 신고 취소를 추가합니다.
// 9주차: 분실물 신고를 하나의 form으로 묶어 조건부 입력 · 입력 중 피드백 · submit 검사 · 접수 중/완료/실패 처리를 추가하고,
//        신고 내역을 브라우저 저장 공간(localStorage)에 저장합니다.

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

// ===============================================================
// 7주차: 분실물 신고 흐름
// 시작 → 1. 물건 정보 → 2. 장소·연락 → 3. 내용 확인(확정 팝업) → 4. 완료
// 9주차: 세 단계를 하나의 form(#reportForm)으로 묶고
//   - 조건부 입력(체크박스 · 라디오) : 표시(hidden)와 입력 가능(disabled)을 함께 바꿈
//   - 입력 중 피드백 : 글자 수 · 조건 충족 여부를 문구로 표시, 고치면 오류 해제
//   - submit 한곳에서 최종 검사 : 막히면 오류 단계를 열고 첫 오류 칸으로 초점
//   - 접수 중(중복 제출 방지) · 완료 · 실패(입력 유지, 다시 시도) 처리
// ===============================================================

// 1. 필요한 HTML 요소를 선택합니다.
const reportIntro = document.querySelector("#reportIntro");
const reportStartButton = document.querySelector("#reportStart");
const reportForm = document.querySelector("#reportForm");
const reportSteps = document.querySelectorAll(".report-step");
const reportProgressItems = document.querySelectorAll(".report-progress li");
const reportProgressText = document.querySelector("#reportProgressText");
const reportFormAlert = document.querySelector("#reportFormAlert");

const itemCategory = document.querySelector("#itemCategory");
const itemDetail = document.querySelector("#itemDetail");
const hasMark = document.querySelector("#hasMark");
const itemMarkField = document.querySelector("#itemMarkField");
const itemMark = document.querySelector("#itemMark");
const lostPlace = document.querySelector("#lostPlace");
const lostDate = document.querySelector("#lostDate");
const contactMethod = document.querySelector("#contactMethod");
const contactRadios = document.querySelectorAll('input[name="contact"]');
const contactEmailRadio = document.querySelector("#contactEmailRadio");
const contactEmailField = document.querySelector("#contactEmailField");
const contactEmail = document.querySelector("#contactEmail");

const reportSummary = document.querySelector("#reportSummary");
const reportSubmitButton = document.querySelector("#reportSubmit");
const reportBack3 = document.querySelector("#reportBack3");
const reportSubmitStatus = document.querySelector("#reportSubmitStatus");
const reportConfirm = document.querySelector("#reportConfirm");
const confirmSubmitButton = document.querySelector("#confirmSubmit");
const reportNumber = document.querySelector("#reportNumber");
const reportResult = document.querySelector("#reportResult");

// 2. 흐름의 상태를 저장할 변수를 만듭니다.
const reportStepNames = ["물건 정보", "장소·연락", "내용 확인"];
const stepFields = {
  1: [itemCategory, itemDetail, itemMark],
  2: [lostPlace, lostDate, contactMethod, contactEmail]
};
const reportFields = stepFields[1].concat(stepFields[2]);
// 오류 안내에 쓰는 항목 이름
const fieldNames = {
  itemCategory: "물건 종류",
  itemDetail: "물건 특징",
  itemMark: "적혀 있는 이름·표시",
  lostPlace: "잃어버린 장소",
  lostDate: "잃어버린 날짜",
  contactMethod: "연락 받을 방법",
  contactEmail: "학교 이메일"
};
const SAVE_DELAY = 1200; // 저장하는 척 기다리는 시간(ms)
let currentStep = 1;
let isSaving = false; // 접수 중이면 true → 다시 제출해도 무시합니다.

// 오늘 날짜를 date 입력창 형식(YYYY-MM-DD)으로 만듭니다.
function getTodayText() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

// "2026-10-20" → "2026년 10월 20일"
function formatDate(dateText) {
  const parts = dateText.split("-");
  return parts[0] + "년 " + Number(parts[1]) + "월 " + Number(parts[2]) + "일";
}

// 선택된 연락 방법(email | visit)을 돌려줍니다. 고르지 않았으면 빈 문자열입니다.
function getContactValue() {
  const checked = document.querySelector('input[name="contact"]:checked');
  return checked ? checked.value : "";
}

// ---------------------------------------------------------------
// showReportStep: 현재 단계만 보여 주고 진행 표시를 바꿉니다.
// ---------------------------------------------------------------
function showReportStep(step, moveFocus) {
  currentStep = step;
  reportSteps.forEach(function (item) {
    item.hidden = Number(item.dataset.step) !== step;
  });

  reportProgressItems.forEach(function (item) {
    const itemStep = Number(item.dataset.step);
    item.classList.toggle("is-current", itemStep === step);
    item.classList.toggle("is-done", itemStep < step);
    if (itemStep === step) {
      item.setAttribute("aria-current", "step");
    } else {
      item.removeAttribute("aria-current");
    }
  });

  reportProgressText.textContent = step <= 3
    ? step + " / 3 단계 · " + reportStepNames[step - 1]
    : "신고 완료";

  // 새 단계의 제목으로 초점을 옮겨 화면과 키보드 위치를 맞춥니다.
  if (moveFocus !== false) {
    document.querySelector("#reportTitle" + step).focus();
  }
}

// ---------------------------------------------------------------
// 오류 표시: 입력칸 아래에 문제와 고치는 방법을 적고 빨간 테두리를 붙입니다.
// ---------------------------------------------------------------
function setFieldError(field, text) {
  document.querySelector("#" + field.id + "Error").textContent = text;
  field.classList.add("has-error");
  field.setAttribute("aria-invalid", "true");
}

function clearFieldError(field) {
  document.querySelector("#" + field.id + "Error").textContent = "";
  field.classList.remove("has-error");
  field.removeAttribute("aria-invalid");
}

// 오류가 난 칸으로 초점을 옮깁니다. (라디오 묶음은 첫 번째 라디오로)
function focusField(field) {
  if (field === contactMethod) {
    contactRadios[0].focus();
  } else {
    field.focus();
  }
}

// ---------------------------------------------------------------
// 9주차 검사 규칙: 칸마다 "문제가 있으면 오류 문구, 없으면 빈 문자열"을 돌려줍니다.
// ---------------------------------------------------------------
// 글자 수 조건(필수 · 최소 글자)을 검사합니다. 공백만 입력한 값은 빈 값으로 봅니다.
// name에는 조사까지 넣어 받습니다. 예: "물건 특징을"
function checkTextLength(field, name, example) {
  const value = field.value.trim();
  const min = Number(field.getAttribute("minlength"));

  if (value === "") {
    return name + " 입력해 주세요. 예: " + example;
  }
  if (value.length < min) {
    return name + " " + min + "자 이상 입력해 주세요. (지금 " + value.length + "자) 예: " + example;
  }
  return "";
}

function checkSchoolEmail() {
  const email = contactEmail.value.trim().toLowerCase();

  if (email === "") {
    return "알림 받을 학교 이메일을 입력해 주세요.";
  }
  if (!email.includes("@") || !email.includes(".")) {
    return "이메일 형식이 올바르지 않습니다. '@'를 넣어 student@school.ac.kr처럼 입력해 주세요.";
  }
  if (!email.endsWith(schoolDomain)) {
    return "학교 이메일(" + schoolDomain + "로 끝나는 주소)을 입력해 주세요. 개인 메일(gmail 등)은 받을 수 없습니다.";
  }
  return "";
}

const fieldRules = {
  itemCategory: function () {
    return itemCategory.value === "" ? "물건 종류를 선택해 주세요. 애매하면 '기타'를 고르세요." : "";
  },
  itemDetail: function () {
    return checkTextLength(itemDetail, "물건 특징을", "흰색 에어팟 프로");
  },
  itemMark: function () {
    return checkTextLength(itemMark, "적혀 있는 이름·표시를", "김OO, 2026 스티커");
  },
  lostPlace: function () {
    return lostPlace.value === "" ? "잃어버린 장소를 선택해 주세요. 모르면 '잘 모르겠음'을 고르세요." : "";
  },
  lostDate: function () {
    if (lostDate.value === "") {
      return "잃어버린 날짜를 선택해 주세요.";
    }
    if (lostDate.value > getTodayText()) {
      return "오늘 이후 날짜는 선택할 수 없습니다. 날짜를 다시 골라 주세요.";
    }
    return "";
  },
  contactMethod: function () {
    return getContactValue() === "" ? "연락 받을 방법을 하나 선택해 주세요." : "";
  },
  contactEmail: checkSchoolEmail
};

// 칸 하나를 검사해 오류를 표시하거나 지웁니다. 통과하면 true.
function validateField(field) {
  const message = fieldRules[field.id]();

  if (message === "") {
    clearFieldError(field);
  } else {
    setFieldError(field, message);
  }
  updateFieldStatus(field);
  return message === "";
}

// 여러 칸을 검사하고, 오류가 난 칸 목록을 돌려줍니다.
// disabled(숨겨진 조건부 입력) 칸은 제출 대상이 아니므로 검사하지 않습니다.
function validateFields(fields) {
  return fields.filter(function (field) {
    if (field.disabled) {
      return false;
    }
    return !validateField(field);
  });
}

// ---------------------------------------------------------------
// 9주차 입력 중 피드백: 글자 수와 조건 충족 여부를 문구로 보여 줍니다.
// (오류 문구는 입력할 때마다 새로 띄우지 않고, 이미 오류가 난 칸만 다시 검사합니다.)
// ---------------------------------------------------------------
const liveStatusText = {
  itemDetail: { hint: "2자 이상 입력해 주세요.", ok: "입력 조건을 충족했습니다." },
  itemMark: { hint: "2자 이상 입력해 주세요.", ok: "입력 조건을 충족했습니다." },
  contactEmail: { hint: "예: student@school.ac.kr", ok: "알림을 받을 수 있는 학교 이메일입니다." }
};

function updateFieldStatus(field) {
  const texts = liveStatusText[field.id];
  if (!texts) {
    return;
  }
  const status = document.querySelector("#" + field.id + "Status");
  const count = document.querySelector("#" + field.id + "Count");
  const wrapper = field.closest(".report-field");
  const length = field.value.trim().length;
  const isValid = fieldRules[field.id]() === "";
  const hasError = field.classList.contains("has-error");

  // 글자 수는 입력한 그대로 세고, 최대 글자 수에 닿으면 문구를 덧붙입니다.
  if (count) {
    const max = Number(field.getAttribute("maxlength"));
    count.textContent = field.value.length + " / " + max + "자";
    if (field.value.length >= max) {
      count.textContent += " (최대)";
    }
    count.classList.toggle("is-full", field.value.length >= max);
  }

  wrapper.classList.toggle("is-valid", isValid);
  status.classList.toggle("is-valid", isValid);
  // 오류 문구가 보일 때는 상태 문구를 숨겨 같은 자리에 두 문장이 겹치지 않게 합니다.
  status.hidden = hasError;

  if (isValid) {
    status.textContent = texts.ok;
  } else if (field.id !== "contactEmail" && length > 0) {
    const min = Number(field.getAttribute("minlength"));
    status.textContent = (min - length) + "자 더 입력해 주세요. (지금 " + length + "자)";
  } else {
    status.textContent = texts.hint;
  }
}

// input · change: 상태 문구를 갱신하고, 이미 오류가 난 칸이면 다시 검사해 고쳐지면 오류를 지웁니다.
function handleReportFieldInput(event) {
  const field = event.currentTarget;
  hideFormAlertIfFixed();

  if (field.classList.contains("has-error")) {
    validateField(field);
  } else {
    updateFieldStatus(field);
  }
}

// ---------------------------------------------------------------
// 9주차 조건부 입력: 표시(hidden) · 입력 가능(disabled) · aria-expanded를 같은 값으로 바꿉니다.
// 숨긴 칸은 disabled라 FormData(제출값)와 검사에서 빠집니다. 적어 둔 값은 다시 열 때를 위해 남겨 둡니다.
// ---------------------------------------------------------------
function setConditionalField(trigger, wrapper, input, isOpen) {
  wrapper.hidden = !isOpen;
  input.disabled = !isOpen;
  trigger.setAttribute("aria-expanded", String(isOpen));
  if (!isOpen) {
    clearFieldError(input);
  }
  updateFieldStatus(input);
}

// change(체크박스): 이름·표시 칸 열기/닫기
function handleMarkChange() {
  setConditionalField(hasMark, itemMarkField, itemMark, hasMark.checked);
  hideFormAlertIfFixed();
}

// change(라디오): '학교 이메일'을 고를 때만 이메일 칸 열기
function handleContactChange() {
  clearFieldError(contactMethod);
  setConditionalField(contactEmailRadio, contactEmailField, contactEmail, getContactValue() === "email");
  hideFormAlertIfFixed();
}

// ---------------------------------------------------------------
// 9주차 폼 상단 안내: 제출이 막혔을 때 고칠 항목을 모아서 보여 줍니다.
// ---------------------------------------------------------------
function showFormAlert(invalidFields) {
  const names = invalidFields.map(function (field) {
    return fieldNames[field.id];
  });
  reportFormAlert.textContent = "수정이 필요한 항목이 " + invalidFields.length + "개 있습니다: "
    + names.join(", ") + ". 각 칸 아래의 안내대로 고쳐 주세요.";
  reportFormAlert.hidden = false;
}

function hideFormAlert() {
  reportFormAlert.hidden = true;
  reportFormAlert.textContent = "";
}

// 오류가 모두 고쳐지면 상단 안내도 지웁니다.
function hideFormAlertIfFixed() {
  if (!reportForm.querySelector('[aria-invalid="true"]')) {
    hideFormAlert();
  }
}

// ---------------------------------------------------------------
// 확인 화면: 지금 입력·선택된 값으로 매번 다시 만듭니다.
// ---------------------------------------------------------------
function getContactText() {
  if (getContactValue() === "email") {
    return "학교 이메일 알림 · " + contactEmail.value.trim().toLowerCase();
  }
  return "보관 장소에 직접 문의";
}

function renderReportSummary() {
  const rows = [
    ["물건 종류", itemCategory.value],
    ["물건 특징", itemDetail.value.trim()]
  ];
  // 체크박스를 켠 경우에만 이름·표시를 보여 줍니다. (꺼져 있으면 제출값에서도 빠짐)
  if (!itemMark.disabled) {
    rows.push(["적힌 이름·표시", itemMark.value.trim()]);
  }
  rows.push(
    ["잃어버린 장소", lostPlace.value],
    ["잃어버린 날짜", formatDate(lostDate.value)],
    ["연락 방법", getContactText()]
  );

  reportSummary.textContent = "";
  rows.forEach(function (row) {
    const term = document.createElement("dt");
    const detail = document.createElement("dd");
    term.textContent = row[0];
    detail.textContent = row[1];
    reportSummary.append(term, detail);
  });
}

// ---------------------------------------------------------------
// 단계 이동 버튼 (type="button")
// ---------------------------------------------------------------
// click(시작): 소개를 숨기고 1단계를 보여 줍니다.
function handleReportStart() {
  reportIntro.hidden = true;
  reportForm.hidden = false;
  showReportStep(1);
}

// 단계 검사: 막히면 상단 안내 + 첫 오류 칸 초점, 통과하면 true
function checkStep(step) {
  const invalidFields = validateFields(stepFields[step]);
  if (invalidFields.length > 0) {
    showFormAlert(invalidFields);
    focusField(invalidFields[0]);
    return false;
  }
  hideFormAlert();
  return true;
}

// click(1단계 다음)
function handleReportNext1() {
  if (checkStep(1)) {
    showReportStep(2);
  }
}

// click(2단계 다음): 검사를 통과하면 확인 화면을 만들고 3단계로 이동합니다.
function handleReportNext2() {
  if (checkStep(2)) {
    renderReportSummary();
    clearSubmitState();
    showReportStep(3);
  }
}

// click(이 내용으로 신고하기): 확정 팝업을 엽니다.
// (dialog를 지원하지 않는 브라우저는 confirm으로 묻고 form을 제출합니다.)
function handleReportSubmit() {
  if (isSaving) {
    return;
  }
  if (typeof reportConfirm.showModal === "function") {
    reportConfirm.showModal();
  } else if (window.confirm("이 내용으로 분실물을 신고할까요?")) {
    reportForm.requestSubmit(confirmSubmitButton);
  }
}

// click(다시 확인하기): 팝업만 닫고 입력값과 확인 화면은 그대로 둡니다.
function handleConfirmCancel() {
  reportConfirm.close();
}

// ---------------------------------------------------------------
// 9주차 submit: 버튼 클릭과 Enter 키가 모두 여기로 들어옵니다.
// ---------------------------------------------------------------
function handleReportFormSubmit(event) {
  event.preventDefault(); // 페이지가 새로고침되지 않게 막습니다.

  // 접수 중에는 다시 제출해도 무시합니다. (중복 제출 방지 ①)
  if (isSaving) {
    return;
  }

  // 1·2단계에서 Enter를 누르면 '다음' 버튼과 같게 처리합니다.
  if (currentStep === 1) {
    handleReportNext1();
    return;
  }
  if (currentStep === 2) {
    handleReportNext2();
    return;
  }
  if (currentStep !== 3) {
    return;
  }

  if (reportConfirm.open) {
    reportConfirm.close();
  }

  // 최종 검사: 모든 단계를 다시 확인하고, 막히면 오류가 있는 첫 단계를 열어 첫 오류 칸으로 초점을 옮깁니다.
  const invalidFields = validateFields(reportFields);
  if (invalidFields.length > 0) {
    const firstInvalid = invalidFields[0];
    const errorStep = stepFields[1].includes(firstInvalid) ? 1 : 2;
    showReportStep(errorStep, false);
    showFormAlert(invalidFields);
    focusField(firstInvalid);
    return;
  }

  // 검사를 통과하면 name이 있는 현재 입력값을 FormData로 모읍니다. (disabled 칸은 빠집니다)
  const data = new FormData(reportForm);
  const report = {
    number: "LF-" + String(getNextReportCount()).padStart(3, "0"),
    category: data.get("category"),
    detail: data.get("detail").trim(),
    mark: data.get("mark") ? data.get("mark").trim() : "",
    place: data.get("place"),
    date: data.get("date"),
    contact: data.get("contact"),
    contactText: getContactText(),
    createdAt: getTimeText(),
    status: "active",
    cancelReason: "",
    canceledAt: ""
  };

  setSubmitState("loading");
  saveReport(report)
    .then(function () {
      setSubmitState("idle");
      completeReport(report);
    })
    .catch(function (error) {
      setSubmitState("error", error.message);
    });
}

// ---------------------------------------------------------------
// 9주차 제출 상태: idle(기본) · loading(접수 중) · error(실패, 다시 시도)
// ---------------------------------------------------------------
function setSubmitState(state, message) {
  isSaving = state === "loading";

  // 접수 중에는 버튼을 잠가 중복 제출을 막습니다. (중복 제출 방지 ②)
  reportSubmitButton.disabled = isSaving;
  confirmSubmitButton.disabled = isSaving;
  reportBack3.disabled = isSaving;
  reportForm.setAttribute("aria-busy", String(isSaving));
  reportSubmitStatus.classList.remove("is-loading", "is-error");

  if (state === "loading") {
    reportSubmitButton.textContent = "신고 접수 중…";
    reportSubmitStatus.textContent = "신고를 접수하고 있습니다. 잠시만 기다려 주세요.";
    reportSubmitStatus.classList.add("is-loading");
    reportSubmitStatus.focus();
  } else if (state === "error") {
    // 실패: 입력값은 그대로 두고 버튼을 다시 활성화해 같은 내용으로 다시 시도할 수 있게 합니다.
    reportSubmitButton.textContent = "다시 신고하기";
    reportSubmitStatus.textContent = "신고를 접수하지 못했습니다. " + message
      + " 입력한 내용은 그대로 남아 있습니다.";
    reportSubmitStatus.classList.add("is-error");
    reportSubmitButton.focus();
  } else {
    reportSubmitButton.textContent = "이 내용으로 신고하기";
    reportSubmitStatus.textContent = "";
  }
}

function clearSubmitState() {
  setSubmitState("idle");
}

// ---------------------------------------------------------------
// 9주차 저장: 서버 대신 브라우저 저장 공간(localStorage)에 저장합니다.
// 실패 조건 ① 인터넷 연결이 끊긴 상태(navigator.onLine === false)
//          ② 브라우저가 저장을 막은 경우(localStorage.setItem 오류: 저장 공간 부족·저장 차단 등)
// ---------------------------------------------------------------
const STORAGE_KEY = "campusLostReports";

function saveReport(report) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (!navigator.onLine) {
        reject(new Error("인터넷 연결이 끊겨 있습니다. 연결을 확인한 뒤 '다시 신고하기'를 눌러 주세요."));
        return;
      }
      try {
        const nextReports = [report].concat(reports);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextReports));
        reports = nextReports;
        resolve();
      } catch (error) {
        reject(new Error("브라우저 저장 공간에 저장할 수 없습니다. 저장 공간이나 사생활 보호 설정을 확인한 뒤 '다시 신고하기'를 눌러 주세요."));
      }
    }, SAVE_DELAY);
  });
}

// 신고 내역 전체를 다시 저장합니다. (신고 취소 등) 실패하면 false.
function storeReports() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    return true;
  } catch (error) {
    return false;
  }
}

function loadReports() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

// 저장된 신고 번호 중 가장 큰 번호 + 1 (새로고침해도 번호가 겹치지 않게)
function getNextReportCount() {
  const max = reports.reduce(function (biggest, report) {
    return Math.max(biggest, Number(report.number.replace("LF-", "")) || 0);
  }, 0);
  return max + 1;
}

// 저장 성공: 신고 번호와 다음 행동을 안내하는 완료 화면으로 이동합니다.
function completeReport(report) {
  reportNumber.textContent = report.number;

  if (report.contact === "email") {
    reportResult.textContent = "비슷한 습득물이 등록되면 " + contactEmail.value.trim().toLowerCase()
      + " 으로 알려드립니다. 그동안 보관 장소도 함께 확인해 보세요.";
  } else {
    reportResult.textContent = "신고 번호를 가지고 보관 장소에 문의하면 더 빨리 찾을 수 있습니다. "
      + "아래 버튼으로 보관 장소와 운영 시간을 확인하세요.";
  }
  reportResult.textContent += " 이 신고는 '내 신고 내역'에서 다시 열어 보거나 취소할 수 있습니다.";

  hideFormAlert();
  renderHistory();
  showReportStep(4);
  console.log("분실물 신고 접수:", report);
}

// click(보관 장소 확인하기): 이용 방법의 '보관 장소 안내' 탭을 열고 그 위치로 이동합니다.
function handleReportPlace() {
  const placeTab = document.querySelector("#tab-place");

  resetTabsAndPanels();
  activateTab(placeTab);
  document.querySelector("#steps").scrollIntoView({ behavior: "smooth" });
  placeTab.focus({ preventScroll: true });
}

// click(다른 물건 신고하기): 입력값 · 조건부 칸 · 오류 · 상태 문구 · 버튼 상태를 모두 초기화하고 1단계로 돌아갑니다.
function handleReportRestart() {
  reportForm.reset(); // 입력·선택·체크·라디오 값을 처음 상태로

  setConditionalField(hasMark, itemMarkField, itemMark, false);
  setConditionalField(contactEmailRadio, contactEmailField, contactEmail, false);
  reportFields.forEach(function (field) {
    clearFieldError(field);
    updateFieldStatus(field);
  });
  hideFormAlert();
  clearSubmitState();

  reportSummary.textContent = "";
  reportNumber.textContent = "";
  reportResult.textContent = "";

  showReportStep(1);
}

// 미래 날짜는 달력에서 고를 수 없게 막아 둡니다.
lostDate.max = getTodayText();

// 이벤트와 함수를 연결합니다.
reportStartButton.addEventListener("click", handleReportStart);
reportForm.addEventListener("submit", handleReportFormSubmit);
document.querySelector("#reportNext1").addEventListener("click", handleReportNext1);
document.querySelector("#reportBack2").addEventListener("click", function () {
  showReportStep(1);
});
document.querySelector("#reportNext2").addEventListener("click", handleReportNext2);
reportBack3.addEventListener("click", function () {
  showReportStep(2);
});
reportSubmitButton.addEventListener("click", handleReportSubmit);
document.querySelector("#confirmCancel").addEventListener("click", handleConfirmCancel);
document.querySelector("#reportPlace").addEventListener("click", handleReportPlace);
document.querySelector("#reportRestart").addEventListener("click", handleReportRestart);

[itemCategory, lostPlace, lostDate].forEach(function (field) {
  field.addEventListener("change", handleReportFieldInput);
});
[itemDetail, itemMark, contactEmail].forEach(function (field) {
  field.addEventListener("input", handleReportFieldInput);
});
hasMark.addEventListener("change", handleMarkChange);
contactRadios.forEach(function (radio) {
  radio.addEventListener("change", handleContactChange);
});

// ===============================================================
// 중간고사: 내 신고 내역
// 7주차 흐름의 끝(완료 화면)에서 이어집니다.
// 완료한 신고 다시 열기 → 조건으로 찾기(결과 없음 안내) → 신고 취소(사유 검사, 상태 변경)
// ===============================================================

// 1. 필요한 HTML 요소를 선택합니다.
const historyStats = document.querySelector("#historyStats");
const historySearch = document.querySelector("#historySearch");
const historyKeyword = document.querySelector("#historyKeyword");
const historyStatus = document.querySelector("#historyStatus");
const historyNotice = document.querySelector("#historyNotice");
const historyResultText = document.querySelector("#historyResultText");
const historyList = document.querySelector("#historyList");
const historyEmpty = document.querySelector("#historyEmpty");
const historyEmptyText = document.querySelector("#historyEmptyText");
const historyEmptyAction = document.querySelector("#historyEmptyAction");

// 2. 상태를 저장할 변수를 만듭니다.
const statusNames = { all: "전체", active: "접수 중", canceled: "취소됨" };
// 9주차: 접수한 신고 (최근 신고가 앞). localStorage에서 불러오므로 새로고침해도 남아 있습니다.
let reports = loadReports();
let appliedKeyword = ""; // 검사를 통과해 실제로 적용된 검색어
let appliedStatus = "all";
let openNumber = ""; // 자세히 보기를 펼친 신고 번호
let cancelingNumber = ""; // 취소 사유를 고르는 중인 신고 번호

// 지금 시각을 "10월 25일 14:05" 형식으로 만듭니다.
function getTimeText() {
  const now = new Date();
  const minute = String(now.getMinutes()).padStart(2, "0");
  return (now.getMonth() + 1) + "월 " + now.getDate() + "일 " + now.getHours() + ":" + minute;
}

function findReport(number) {
  return reports.find(function (report) {
    return report.number === number;
  });
}

// 태그를 만들고 class와 글자를 한 번에 넣습니다. (textContent라 입력값이 HTML로 해석되지 않습니다.)
function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
}

function createActionButton(text, className, action, number) {
  const button = createElement("button", className, text);
  button.type = "button";
  button.dataset.action = action;
  button.dataset.number = number;
  return button;
}

// ---------------------------------------------------------------
// 조건 검사: 적용된 검색어와 상태에 맞는 신고만 돌려줍니다.
// ---------------------------------------------------------------
function getFilteredReports() {
  const keyword = appliedKeyword.toLowerCase();

  return reports.filter(function (report) {
    const statusMatch = appliedStatus === "all" || report.status === appliedStatus;
    const text = (report.category + " " + report.detail + " " + report.place).toLowerCase();
    const keywordMatch = keyword === "" || report.number.toLowerCase() === keyword || text.includes(keyword);
    return statusMatch && keywordMatch;
  });
}

// 검색어 검사: LF로 시작하면 신고 번호 형식(LF-001)인지 확인합니다. 문제가 없으면 빈 문자열입니다.
function validateHistoryKeyword(keyword) {
  // /^LF-\d{3}$/i : LF- 뒤에 숫자 세 자리 (대소문자 구분 없음)
  if (keyword.toUpperCase().startsWith("LF") && !/^LF-\d{3}$/i.test(keyword)) {
    return "신고 번호는 LF-001처럼 'LF-'와 숫자 세 자리로 입력해 주세요. 물건 특징으로 찾아도 됩니다.";
  }
  return "";
}

function getConditionText() {
  const parts = [];
  if (appliedKeyword !== "") {
    parts.push("검색어 '" + appliedKeyword + "'");
  }
  if (appliedStatus !== "all") {
    parts.push("상태 '" + statusNames[appliedStatus] + "'");
  }
  return parts.join(" · ");
}

// ---------------------------------------------------------------
// 화면 갱신: 상태(reports · 조건 · 펼침 · 취소 중)에 맞게 목록을 다시 만듭니다.
// ---------------------------------------------------------------
function createHistoryItem(report) {
  const item = createElement("li", "history-item");
  const isCanceled = report.status === "canceled";
  const isOpen = openNumber === report.number;
  item.classList.toggle("is-canceled", isCanceled);
  item.classList.toggle("is-open", isOpen);

  const head = createElement("div", "history-item-head");
  head.append(
    createElement("h3", "history-number", report.number),
    createElement("span", "status-badge", statusNames[report.status])
  );
  item.append(
    head,
    createElement("p", "history-title", report.category + " · " + report.detail),
    createElement("p", "history-meta", report.place + " · " + formatDate(report.date) + " 분실")
  );

  // 자세히 보기: 연락 방법과 접수·취소 정보를 다시 보여 줍니다.
  if (isOpen) {
    const rows = [
      ["연락 방법", report.contactText],
      ["적힌 이름·표시", report.mark || "없음"],
      ["접수 시각", report.createdAt]
    ];
    if (isCanceled) {
      rows.push(["취소 사유", report.cancelReason], ["취소 시각", report.canceledAt]);
    }
    const details = createElement("dl", "report-summary history-details");
    rows.forEach(function (row) {
      details.append(createElement("dt", "", row[0]), createElement("dd", "", row[1]));
    });
    item.append(details);
  }

  // 신고 취소: 사유를 골라야 확정할 수 있습니다.
  if (cancelingNumber === report.number) {
    const box = createElement("div", "cancel-box");
    const field = createElement("div", "report-field");
    const selectId = "cancelReason-" + report.number;
    const label = createElement("label", "", "신고를 취소하는 이유");
    const select = createElement("select");
    const error = createElement("p", "field-error");

    label.htmlFor = selectId;
    select.id = selectId;
    select.setAttribute("aria-describedby", selectId + "Error");
    error.id = selectId + "Error";
    error.setAttribute("role", "alert");
    ["", "물건을 찾았어요", "잘못 신고했어요", "더 이상 찾지 않아요"].forEach(function (reason) {
      const option = createElement("option", "", reason || "이유를 선택하세요");
      option.value = reason;
      select.append(option);
    });
    field.append(label, select, error);

    const boxActions = createElement("div", "step-actions");
    boxActions.append(
      createActionButton("취소하지 않기", "secondary-button", "keep", report.number),
      createActionButton("신고 취소 확정", "danger-button", "confirm-cancel", report.number)
    );
    box.append(
      field,
      createElement("p", "field-help", "취소하면 이 신고로는 습득 알림을 받을 수 없고, 되돌릴 수 없습니다."),
      boxActions
    );
    item.append(box);
  }

  const actions = createElement("div", "step-actions");
  const toggleButton = createActionButton(isOpen ? "접기" : "자세히 보기", "secondary-button", "toggle", report.number);
  toggleButton.setAttribute("aria-expanded", String(isOpen));
  actions.append(toggleButton);
  if (!isCanceled && cancelingNumber !== report.number) {
    actions.append(createActionButton("신고 취소", "danger-button", "cancel", report.number));
  }
  item.append(actions);

  return item;
}

function renderHistory() {
  const activeCount = reports.filter(function (report) {
    return report.status === "active";
  }).length;
  const matches = getFilteredReports();
  const conditionText = getConditionText();

  historyStats.textContent = "전체 " + reports.length + "건 · 접수 중 " + activeCount
    + "건 · 취소 " + (reports.length - activeCount) + "건";
  historyStats.hidden = reports.length === 0;
  historySearch.hidden = reports.length === 0;

  historyList.textContent = "";
  matches.forEach(function (report) {
    historyList.append(createHistoryItem(report));
  });

  if (reports.length === 0) {
    historyResultText.textContent = "";
    historyEmptyText.textContent = "아직 접수한 신고가 없습니다. 잃어버린 물건이 있다면 먼저 분실물 신고를 해 주세요.";
    historyEmptyAction.textContent = "분실물 신고하러 가기";
    historyEmpty.hidden = false;
  } else if (matches.length === 0) {
    historyResultText.textContent = "전체 " + reports.length + "건 중 0건";
    historyEmptyText.textContent = conditionText + "에 맞는 신고가 없습니다. "
      + "검색어를 줄이거나 상태를 '전체'로 바꿔 보세요.";
    historyEmptyAction.textContent = "조건 초기화하고 전체 보기";
    historyEmpty.hidden = false;
  } else {
    historyResultText.textContent = conditionText === ""
      ? "최근에 접수한 신고가 위에 표시됩니다."
      : conditionText + " · 전체 " + reports.length + "건 중 " + matches.length + "건을 찾았습니다.";
    historyEmpty.hidden = true;
  }
}

// 다시 만든 목록에서 특정 신고의 버튼으로 초점을 옮깁니다. 버튼이 없으면 false를 돌려줍니다.
function focusHistoryButton(number, action, options) {
  const button = historyList.querySelector('[data-number="' + number + '"][data-action="' + action + '"]');
  if (button) {
    button.focus(options);
    return true;
  }
  return false;
}

// ---------------------------------------------------------------
// 조건으로 찾기
// ---------------------------------------------------------------
// submit(신고 찾기) · change(상태): 검색어를 검사하고 통과하면 조건을 적용합니다.
function applyHistorySearch() {
  const keyword = historyKeyword.value.trim();
  const errorText = validateHistoryKeyword(keyword);

  if (errorText !== "") {
    setFieldError(historyKeyword, errorText);
    historyKeyword.focus();
    return; // 이전 결과는 그대로 둡니다.
  }

  clearFieldError(historyKeyword);
  appliedKeyword = keyword;
  appliedStatus = historyStatus.value;
  historyNotice.textContent = "";
  renderHistory();
}

function handleHistorySearch(event) {
  event.preventDefault();
  applyHistorySearch();
}

// 검색어·상태·오류를 지우고 전체 목록을 보여 줍니다.
function resetHistorySearch() {
  historyKeyword.value = "";
  historyStatus.value = "all";
  clearFieldError(historyKeyword);
  appliedKeyword = "";
  appliedStatus = "all";
  renderHistory();
}

// click(조건 초기화)
function handleHistoryReset() {
  resetHistorySearch();
  historyKeyword.focus();
}

// click(내역 없음·결과 없음 안내 버튼): 상황에 맞는 다음 행동으로 이동합니다.
function handleHistoryEmptyAction() {
  if (reports.length > 0) {
    handleHistoryReset();
    return;
  }

  // 신고가 하나도 없으면 분실물 신고로 이동합니다. (이미 시작했다면 지금 단계 제목으로)
  const target = reportIntro.hidden
    ? document.querySelector(".report-step:not([hidden]) h3")
    : reportStartButton;
  document.querySelector("#report").scrollIntoView({ behavior: "smooth" });
  target.focus({ preventScroll: true });
}

// ---------------------------------------------------------------
// 목록 안의 버튼: 자세히 보기 · 신고 취소 · 취소하지 않기 · 신고 취소 확정
// ---------------------------------------------------------------
function confirmCancel(number) {
  const reasonSelect = document.querySelector("#cancelReason-" + number);
  const report = findReport(number);

  if (reasonSelect.value === "") {
    setFieldError(reasonSelect, "취소하는 이유를 선택해 주세요. 취소하지 않으려면 '취소하지 않기'를 누르세요.");
    reasonSelect.focus();
    return;
  }

  report.status = "canceled";
  report.cancelReason = reasonSelect.value;
  report.canceledAt = getTimeText();
  cancelingNumber = "";
  openNumber = number;

  historyNotice.textContent = number + " 신고를 취소했습니다.";
  if (report.contact === "email") {
    historyNotice.textContent += " 이 신고에 대한 이메일 알림도 더 이상 보내지 않습니다.";
  }
  if (report.cancelReason === "물건을 찾았어요") {
    historyNotice.textContent += " 물건을 찾으셨다니 다행입니다!";
  }
  // '접수 중'만 보고 있으면 취소한 신고가 목록에서 빠지므로 이유를 알려 줍니다.
  if (appliedStatus === "active") {
    historyNotice.textContent += " 지금은 '접수 중'만 보고 있어 목록에서 빠졌습니다. 상태를 '전체'로 바꾸면 다시 볼 수 있습니다.";
  }
  // 9주차: 취소한 상태도 브라우저 저장 공간에 반영합니다.
  if (!storeReports()) {
    historyNotice.textContent += " (브라우저에 저장하지 못해 새로고침하면 취소 전 상태로 보일 수 있습니다.)";
  }

  renderHistory();
  if (!focusHistoryButton(number, "toggle")) {
    historyStatus.focus();
  }
}

function handleHistoryListClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }
  const number = button.dataset.number;
  const action = button.dataset.action;

  if (action === "toggle") {
    openNumber = openNumber === number ? "" : number;
    renderHistory();
    focusHistoryButton(number, "toggle");
  } else if (action === "cancel") {
    cancelingNumber = number; // 다른 신고의 취소 창은 닫힙니다.
    historyNotice.textContent = "";
    renderHistory();
    document.querySelector("#cancelReason-" + number).focus();
  } else if (action === "keep") {
    cancelingNumber = "";
    renderHistory();
    focusHistoryButton(number, "cancel");
  } else if (action === "confirm-cancel") {
    confirmCancel(number);
  }
}

// change(취소 사유): 사유를 고르면 오류 표시를 지웁니다.
function handleHistoryListChange(event) {
  if (event.target.matches("select")) {
    clearFieldError(event.target);
  }
}

// click(완료 화면의 내 신고 내역 보기): 조건을 풀고 방금 접수한 신고를 펼쳐서 보여 줍니다.
function handleReportHistory() {
  openNumber = reportNumber.textContent;
  cancelingNumber = "";
  historyNotice.textContent = "";
  resetHistorySearch();
  document.querySelector("#history").scrollIntoView({ behavior: "smooth" });
  focusHistoryButton(openNumber, "toggle", { preventScroll: true });
}

// 처음 화면: 아직 신고가 없다는 안내를 보여 줍니다.
renderHistory();

// 이벤트와 함수를 연결합니다.
document.querySelector("#reportHistory").addEventListener("click", handleReportHistory);
historySearch.addEventListener("submit", handleHistorySearch);
historyStatus.addEventListener("change", applyHistorySearch);
historyKeyword.addEventListener("input", function () {
  clearFieldError(historyKeyword);
});
document.querySelector("#historyReset").addEventListener("click", handleHistoryReset);
historyEmptyAction.addEventListener("click", handleHistoryEmptyAction);
historyList.addEventListener("click", handleHistoryListClick);
historyList.addEventListener("change", handleHistoryListChange);
