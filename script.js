// 5주차: 습득 알림 신청 폼에 입력값 검사와 처리 결과 안내 기능을 추가합니다.
// 6주차: click · input · change 이벤트와 탭 UI를 추가합니다.
// 7주차: 분실물 신고 흐름(시작 → 물건 정보 → 장소·연락 → 내용 확인 → 완료)을 추가합니다.
// 중간고사: 완료한 신고를 '내 신고 내역'에 모아 다시 열기 · 조건으로 찾기 · 신고 취소를 추가합니다.

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
// ===============================================================

// 1. 필요한 HTML 요소를 선택합니다.
const reportIntro = document.querySelector("#reportIntro");
const reportStartButton = document.querySelector("#reportStart");
const reportFlow = document.querySelector("#reportFlow");
const reportSteps = document.querySelectorAll(".report-step");
const reportProgressItems = document.querySelectorAll(".report-progress li");
const reportProgressText = document.querySelector("#reportProgressText");

const itemCategory = document.querySelector("#itemCategory");
const itemDetail = document.querySelector("#itemDetail");
const lostPlace = document.querySelector("#lostPlace");
const lostDate = document.querySelector("#lostDate");
const contactMethod = document.querySelector("#contactMethod");
const contactRadios = document.querySelectorAll('input[name="contact"]');
const contactEmailField = document.querySelector("#contactEmailField");
const contactEmail = document.querySelector("#contactEmail");

const reportSummary = document.querySelector("#reportSummary");
const reportConfirm = document.querySelector("#reportConfirm");
const reportNumber = document.querySelector("#reportNumber");
const reportResult = document.querySelector("#reportResult");

// 2. 흐름의 상태를 저장할 변수를 만듭니다.
const reportStepNames = ["물건 정보", "장소·연락", "내용 확인"];
const reportFields = [itemCategory, itemDetail, lostPlace, lostDate, contactMethod, contactEmail];
let reportCount = 0; // 이번 방문에서 접수한 신고 수 (신고 번호에 사용)

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
function showReportStep(step) {
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
  document.querySelector("#reportTitle" + step).focus();
}

// ---------------------------------------------------------------
// 오류 표시: 입력칸 아래에 고치는 방법을 적고 빨간 테두리를 붙입니다.
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

// 오류가 난 첫 칸으로 초점을 옮깁니다. (라디오 묶음은 첫 번째 라디오로)
function focusField(field) {
  if (field === contactMethod) {
    contactRadios[0].focus();
  } else {
    field.focus();
  }
}

// ---------------------------------------------------------------
// 단계별 필수값 검사: 오류를 모두 표시하고, 첫 번째 오류 칸을 돌려줍니다.
// ---------------------------------------------------------------
function validateItemStep() {
  let firstInvalid = null;

  if (itemCategory.value === "") {
    setFieldError(itemCategory, "물건 종류를 선택해 주세요.");
    firstInvalid = firstInvalid || itemCategory;
  }
  if (itemDetail.value.trim() === "") {
    setFieldError(itemDetail, "물건 특징을 입력해 주세요. 예: 흰색 에어팟 프로");
    firstInvalid = firstInvalid || itemDetail;
  }

  return firstInvalid;
}

function validatePlaceStep() {
  let firstInvalid = null;
  const contact = getContactValue();
  const email = contactEmail.value.trim().toLowerCase();

  if (lostPlace.value === "") {
    setFieldError(lostPlace, "잃어버린 장소를 선택해 주세요. 모르면 '잘 모르겠음'을 고르세요.");
    firstInvalid = firstInvalid || lostPlace;
  }

  if (lostDate.value === "") {
    setFieldError(lostDate, "잃어버린 날짜를 선택해 주세요.");
    firstInvalid = firstInvalid || lostDate;
  } else if (lostDate.value > getTodayText()) {
    setFieldError(lostDate, "오늘 이후 날짜는 선택할 수 없습니다. 날짜를 다시 골라 주세요.");
    firstInvalid = firstInvalid || lostDate;
  }

  if (contact === "") {
    setFieldError(contactMethod, "연락 받을 방법을 하나 선택해 주세요.");
    firstInvalid = firstInvalid || contactMethod;
  }

  // 이메일 알림을 고른 경우에만 이메일을 검사합니다. (5주차와 같은 학교 이메일 조건)
  if (contact === "email") {
    if (email === "") {
      setFieldError(contactEmail, "알림 받을 학교 이메일을 입력해 주세요.");
      firstInvalid = firstInvalid || contactEmail;
    } else if (!email.includes("@") || !email.includes(".")) {
      setFieldError(contactEmail, "이메일 형식이 올바르지 않습니다. 예: student@school.ac.kr");
      firstInvalid = firstInvalid || contactEmail;
    } else if (!email.endsWith(schoolDomain)) {
      setFieldError(contactEmail, "학교 이메일(" + schoolDomain + "로 끝나는 주소)을 입력해 주세요.");
      firstInvalid = firstInvalid || contactEmail;
    }
  }

  return firstInvalid;
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
    ["물건 특징", itemDetail.value.trim()],
    ["잃어버린 장소", lostPlace.value],
    ["잃어버린 날짜", formatDate(lostDate.value)],
    ["연락 방법", getContactText()]
  ];

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
// 버튼 이벤트
// ---------------------------------------------------------------
// click(시작): 소개를 숨기고 1단계를 보여 줍니다.
function handleReportStart() {
  reportIntro.hidden = true;
  reportFlow.hidden = false;
  showReportStep(1);
}

// click(1단계 다음): 필수값이 비면 현재 단계에 머물고, 모두 있으면 2단계로 이동합니다.
function handleReportNext1() {
  const firstInvalid = validateItemStep();
  if (firstInvalid) {
    focusField(firstInvalid);
    return;
  }
  showReportStep(2);
}

// click(2단계 다음): 검사를 통과하면 확인 화면을 만들고 3단계로 이동합니다.
function handleReportNext2() {
  const firstInvalid = validatePlaceStep();
  if (firstInvalid) {
    focusField(firstInvalid);
    return;
  }
  renderReportSummary();
  showReportStep(3);
}

// change(연락 방법): 이메일을 고를 때만 이메일 입력칸을 보여 줍니다.
// 숨긴 이메일 칸은 검사하지 않고, 적어 둔 값은 다시 이메일을 고를 때를 위해 남겨 둡니다.
function handleContactChange() {
  const wantsEmail = getContactValue() === "email";

  clearFieldError(contactMethod);
  contactEmailField.hidden = !wantsEmail;
  if (!wantsEmail) {
    clearFieldError(contactEmail);
  }
}

// click(신고하기): 확정 팝업을 엽니다. (dialog를 지원하지 않는 브라우저는 confirm 사용)
function handleReportSubmit() {
  if (typeof reportConfirm.showModal === "function") {
    reportConfirm.showModal();
  } else if (window.confirm("이 내용으로 분실물을 신고할까요?")) {
    completeReport();
  }
}

// click(신고 확정): 신고 번호를 만들고 완료 화면으로 이동합니다.
function completeReport() {
  reportCount += 1;
  reportNumber.textContent = "LF-" + String(reportCount).padStart(3, "0");

  if (getContactValue() === "email") {
    reportResult.textContent = "비슷한 습득물이 등록되면 " + contactEmail.value.trim().toLowerCase()
      + " 으로 알려드립니다. 그동안 보관 장소도 함께 확인해 보세요.";
  } else {
    reportResult.textContent = "신고 번호를 가지고 보관 장소에 문의하면 더 빨리 찾을 수 있습니다. "
      + "아래 버튼으로 보관 장소와 운영 시간을 확인하세요.";
  }
  reportResult.textContent += " 이 신고는 '내 신고 내역'에서 다시 열어 보거나 취소할 수 있습니다.";

  // 중간고사: 지금 값을 복사해 신고 내역 맨 앞에 추가합니다. (다른 물건을 신고해도 바뀌지 않게)
  reports.unshift({
    number: reportNumber.textContent,
    category: itemCategory.value,
    detail: itemDetail.value.trim(),
    place: lostPlace.value,
    date: lostDate.value,
    contact: getContactValue(),
    contactText: getContactText(),
    createdAt: getTimeText(),
    status: "active",
    cancelReason: "",
    canceledAt: ""
  });
  renderHistory();

  showReportStep(4);
  console.log("분실물 신고 접수:", reportNumber.textContent, itemCategory.value, lostPlace.value);
}

function handleConfirmSubmit() {
  reportConfirm.close();
  completeReport();
}

// click(다시 확인하기): 팝업만 닫고 입력값과 확인 화면은 그대로 둡니다.
function handleConfirmCancel() {
  reportConfirm.close();
}

// click(보관 장소 확인하기): 이용 방법의 '보관 장소 안내' 탭을 열고 그 위치로 이동합니다.
function handleReportPlace() {
  const placeTab = document.querySelector("#tab-place");

  resetTabsAndPanels();
  activateTab(placeTab);
  document.querySelector("#steps").scrollIntoView({ behavior: "smooth" });
  placeTab.focus({ preventScroll: true });
}

// click(다른 물건 신고하기): 입력·선택·오류·진행 상태를 모두 초기화하고 1단계로 돌아갑니다.
function handleReportRestart() {
  itemCategory.value = "";
  itemDetail.value = "";
  lostPlace.value = "";
  lostDate.value = "";
  contactEmail.value = "";
  contactRadios.forEach(function (radio) {
    radio.checked = false;
  });
  contactEmailField.hidden = true;

  reportFields.forEach(clearFieldError);
  reportSummary.textContent = "";
  reportNumber.textContent = "";
  reportResult.textContent = "";

  showReportStep(1);
}

// 값을 고치면 그 칸의 오류 표시를 바로 지웁니다.
function handleReportFieldInput(event) {
  clearFieldError(event.currentTarget);
}

// 미래 날짜는 달력에서 고를 수 없게 막아 둡니다.
lostDate.max = getTodayText();

// 이벤트와 함수를 연결합니다.
reportStartButton.addEventListener("click", handleReportStart);
document.querySelector("#reportNext1").addEventListener("click", handleReportNext1);
document.querySelector("#reportBack2").addEventListener("click", function () {
  showReportStep(1);
});
document.querySelector("#reportNext2").addEventListener("click", handleReportNext2);
document.querySelector("#reportBack3").addEventListener("click", function () {
  showReportStep(2);
});
document.querySelector("#reportSubmit").addEventListener("click", handleReportSubmit);
document.querySelector("#confirmSubmit").addEventListener("click", handleConfirmSubmit);
document.querySelector("#confirmCancel").addEventListener("click", handleConfirmCancel);
document.querySelector("#reportPlace").addEventListener("click", handleReportPlace);
document.querySelector("#reportRestart").addEventListener("click", handleReportRestart);

[itemCategory, lostPlace, lostDate].forEach(function (field) {
  field.addEventListener("change", handleReportFieldInput);
});
[itemDetail, contactEmail].forEach(function (field) {
  field.addEventListener("input", handleReportFieldInput);
});
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
let reports = []; // 접수한 신고 (최근 신고가 앞). 새로고침하면 사라집니다.
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
