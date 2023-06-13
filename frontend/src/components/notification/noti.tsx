export const createNotification = (message: string = "", secondsUntilAway: number = 5) => {
    if (typeof(document) === undefined) return;

    const notifications = document.getElementById("notifications");
    const noti = document.createElement("div");
    noti.classList.add("notification");
    noti.innerHTML = `
        <span className="message">${message}</span>   
    `
    notifications?.appendChild(noti);

    setTimeout(() => {
        noti.remove();
    }, 1000 * secondsUntilAway);
}
