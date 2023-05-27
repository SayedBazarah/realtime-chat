window.onload = async function () {
  // State & Variables
  let state = {
    username: sessionStorage.getItem("user"),
    notification: false,
  };

  let imgsBase64 = [];
  let chunks = [];
  var recStream;

  if (!state.username) location.href = "/";

  //   UI Components
  document.getElementById("currentUser").innerText = state.username;
  const uploadAreaView = document.getElementById("uploadArea");
  const notification = document.getElementById("notification");
  const audioAreaView = document.getElementById("audioArea");
  const messagesView = document.getElementById("messages");
  const activeUsersView = document.getElementById("active");
  const messageForm = document.getElementById("messageForm");
  const messageInput = document.getElementById("message");
  const imgUploader = document.querySelector("#dropzone-file");
  const stopRec = messageForm.children[0].children[4];
  const rec = messageForm.children[0].children[3];
  const attach = messageForm.children[0].children[2];
  const send = messageForm.children[1];

  //   Events
  notification.addEventListener("change", notificationPermission);
  imgUploader.addEventListener("change", handleMedia);
  send.addEventListener("click", handleMessage);
  rec.addEventListener("click", recordAudio);
  stopRec.addEventListener("click", () => {
    recStream.stop();
  });
  attach.addEventListener("click", () => {
    uploadAreaView.classList.remove("hidden");
  });

  //   Handling Socket.io Actions
  const socket = io.connect("http://localhost:3700", {
    query: `state=${JSON.stringify(state)}`,
  });
  socket.on("users", (payload) => {
    activeUsersView.innerHTML = "";
    payload.map(
      (user) =>
        (activeUsersView.innerHTML += `
        <div class="flex items-center gap-3">
            <img
            class="rounded-full w-12 h-12"
            src="data:image/jpeg;base64,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"
            alt="user"
            />
            <div class="">
            <h4 class="font-bold">${user}</h4>
            </div>
        </div>
           
`)
    );
  });
  socket.on("message", (payload) => {
    if (state.notification)
      new Notification("You got a new message!" + payload.message || "");
    if (payload.blobBase64)
      messagesView.innerHTML += newAudio(payload.blobBase64);
    if (payload.imgsBase64?.length > 0 && payload.imgsBase64)
      messagesView.innerHTML += newMedia(payload.imgsBase64);
    if (payload.message != "" && payload.message)
      messagesView.innerHTML += newMessage(payload.message);
    messagesView.scrollTo(0, messagesView.scrollHeight);
  });

  //   Functions
  function handleMessage() {
    let message = messageInput.value;
    if (message == "" && imgsBase64.length == 0)
      alert("Please type a message ");
    else {
      socket.emit("send", { message, imgsBase64 });
      messageInput.value = "";
      uploadAreaView.classList.add("hidden");
      uploadAreaView.children[0].innerHTML = "";
      imgsBase64 = [];
    }
  }
  async function handleMedia(event) {
    let files = [...event.target.files];
    let images = await Promise.all(
      files.map((f) => {
        return readAsDataURL(f);
      })
    );
    imgsBase64.push(...images);

    uploadAreaView.children[0].innerHTML = displayMedia(imgsBase64);
  }

  const displayMedia = (imgs) => `
  <div class="row-span-2">
  <img
  class="w-full h-full object-cover"
  src=${imgs[0].data}
  alt="user"
        />
    </div>
    <div class="row-span-10 flex gap-2 p-2">
    ${imgs.map(
      (img) => `<img
      class="w-[70px] object-cover"
        src=${img.data}
        alt="user"
        />`
    )}
    </div>
`;
  const newMessage = (message) => `
        <div class="flex gap-3 items-center">
            <img
              class="rounded-full w-12 h-12"
              src="data:image/jpeg;base64,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"
              alt="user"
            />
            <div class="flex w-fit h-full p-2 bg-gray-300 rounded-lg">
            <p class="py-1">${message}</p>
            </div>
        </div>
        `;

  const newMedia = (imgs) => {
    let imgsContainer = "";
    for (let img of imgs)
      imgsContainer += `
                  <img class="w-full h-full object-cover" src='${img.data}' alt=${img.name} />
        `;
    return `
     <div class="flex gap-3 items-start">
            <img
              class="rounded-full w-12 h-12"
              src="data:image/jpeg;base64,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"
              alt="user"
              />
              <div class="grid  gap-2 p-2 bg-gray-300 rounded-lg">
              ${imgsContainer}</div>
        </div>`;
  };

  const newAudio = (blobBase64) => `
         <div class="">
            <audio controls class="">
                <source src=${blobBase64}></source>
            </audio>
        </div>
`;

  function notificationPermission(e) {
    Notification.requestPermission().then((perm) => {
      switch (perm) {
        case "granted":
          state.notification = e.target.checked;
          break;
        case "denied":
          notification.checked = false;
          break;
      }
    });
  }
  function recordAudio() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      console.log("recStream");
      recStream = new MediaRecorder(stream);
      recStream.start();
      recStream.ondataavailable = async (e) => {
        chunks.push(e.data);
        if (recStream.state == "inactive") {
          console.log("STOPED");
          let blob = new Blob(chunks, { type: "audio/webm" });
          let blobBase64 = await blobToBase64(blob);
          socket.emit("send", { blobBase64 });
          console.log();
          messageForm.children[0].children[4].classList.toggle("hidden");
          chunks = [];
        }
      };
    });
    messageForm.children[0].children[4].classList.toggle("hidden");
  }

  function readAsDataURL(file) {
    return new Promise((resolve) => {
      let fileReader = new FileReader();
      fileReader.onload = function () {
        return resolve({
          data: fileReader.result,
          name: file.name,
          size: file.size,
          type: file.type,
        });
      };
      fileReader.readAsDataURL(file);
    });
  }
  function blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
};
