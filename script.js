const subscribeForm = document.getElementById("subscribe-form");
const subscribeMessage = document.getElementById("subscribe-message");

if (subscribeForm) {
  subscribeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    subscribeMessage.textContent = "알림 신청이 완료되었습니다.";
    subscribeForm.reset();
  });
}
