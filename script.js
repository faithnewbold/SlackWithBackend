// Name: Faith Newbold
// Description: Code for part 2 of an API chat test

function changeChannel(e) {
  document.querySelector(".active").classList.remove("active");
  e.currentTarget.classList.add("active");
  populateMessages(e.currentTarget.getAttribute("data-channel"));
  document.querySelector("#channel-title").innerText =
    e.currentTarget.innerText;
}

function populateMessages(chat) {
  document.querySelectorAll(".message").forEach((item) => item.remove());
  let template = document.querySelector("template");
  // INSERT CODE HERE
  fetch(`https://slackclonebackendapi.onrender.com/messages?channelId=${chat}`)
    .then((res) => res.json())
    .then(async (messages) => {
      const container = document.querySelector(".chat-messages");

      for (const message of messages) {
        const userRes = await fetch(`https://slackclonebackendapi.onrender.com/users?id=${message.senderId}`);
        const userData = await userRes.json();
        const senderName = userData[0].name;

        const clone = template.content.cloneNode(true);

        clone.querySelector(".sender").innerText = senderName + ":";
        clone.querySelector(".text").innerText = message.content;

        container.appendChild(clone);
      }
    });
}

// extra credit - sending messages
async function sendMessage() {
  const input = document.querySelector("#message-input");
  const text = input.value.trim();

  if (!text) return;

  const activeChannel = document.querySelector(".active").dataset.channel;

  const users = await fetch(`https://slackclonebackendapi.onrender.com/users`)
    .then((res) => res.json());
  const randomUser = users[Math.floor(Math.random() * users.length)];

  const newMessage = {
    channelId: activeChannel,
    senderId: randomUser.id,
    content: text
  };

  await fetch(`https://slackclonebackendapi.onrender.com/messages`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(newMessage)
  });

  input.value = "";
  populateMessages(activeChannel);
}

// Code to get the channels
async function init(){
   
  // INSERT CODE HERE
  const res = await fetch("https://slackclonebackendapi.onrender.com/channels");
  const channels = await res.json();

  const channelList = document.querySelector(".channel-list");

  channels.forEach((channel) => {
    const btn = document.createElement("button");
    btn.classList.add("channel");
    btn.dataset.channel = channel.id;
    btn.innerText = channel.name;
    channelList.appendChild(btn);
  });

  // select the first channel
  const first = document.querySelector(".channel");
  first.classList.add("active");
  populateMessages(first.dataset.channel);
  document.querySelector("#channel-title").innerText = first.innerText;

  // allows for channel switching
  document
    .querySelectorAll(".channel")
    .forEach((item) => item.addEventListener("click", changeChannel));

  // extra credit - message send button
  document.querySelector(".chat-input button")
    .addEventListener("click", sendMessage);
  
}

init();
