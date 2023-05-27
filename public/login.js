window.onload = () => {
  //   UI Components
  const loginForm = document.getElementById("login");
  const imgUploader = document.querySelector("#dropzone-file");
  const profileImgView = document.querySelector("#profileImg");

  //   Variables
  let imgBase64 =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHkAeQMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABQYBAwQCB//EADcQAAICAQEFBAYIBwAAAAAAAAABAgMEEQUSITFRE0FhcSIyM0JSsRQ0YpGhwdHhI1RzgYOS8f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD7iAAABhtRTbeiQGQRmTtauDcaFvvq+C/cjrszIufpWy0fux4ICwztrh684x85JGv6XjfzFX+6K0ALRC6qfqWQl5STNhUzdTlX0+ztkl05oCzAisbaybUciOn2o/oScJxnFShJSi+TQHoAAAAAAMSeibfBLmwPF1sKa3Ox6RRA5ubPJenq190evmZz8t5VvD2cfVXXxOQAAd2Ds+WTFWTlpXvaad7A4QWanFopWldUV46asxPDxpy3pUwb8gK0Cw3bPx7K3GNag/iiuJwZey+yqdlM3LdWrT5/2AjTfi5VmNPWD1i+cXyZoAFmxsivIr3635rvRuK1iZM8a5TjxXKS6osVVkba4zg9YyWqA9gAARu2cjcqVEX6U+L8iSK3n29tl2S14J6LyQHOAABZ8atVY9da92KKyWpcgMgAAYmt6LSemq016GQBVrIOqycHxcW1qeDblPXJtf238zUAJTYuRpKWPJ8Hxj+ZFnumx1WwsXOL1AtIMRakk1yfIyB4un2dM5/DFsqxZs36nf8A05fIrIAAACz40nLHrlJNNxWqZWU9HqWqElKKkuTWqAyAAAAAq1r1tm+smzwbcqSlk2yXJzfzNQAAAWPZ09/Cqb+HT7uB0nHsn6hX5y+bOwDXkR36LIfFFr8CrlsKzl1djk2Q04KXDyA0gAATWx8mVsHVNezS0fgQp27JsdeZFd004sCfAAA49p5MsahOCW9J6J9PE7CF23ZvXQq7orX7/wDgEaAAAB6rg7JxhHnJ6ICw7Nju4NS8Nfv4nSeYRUIRiuUUkj0AIrbWPrGN8Vy9GX5EqeZwU4OElrGS0aAqoO2ezrFldjGUVrxi5d6OynZEFxtscvCPBAQx3bOxr/pNVnZyUE+LfAmKcamn2dcU+unE3AAAAIbauNdPJdsK5SjupariTIAqmj10a0fRmC0W0VXL+LXGXmjhu2RVLjVKUH05oCFJLY2O52u5r0YcF5mmzZ10MiFSlGTn07l1ZOY9UaKo1w5R/EDYAAAAA1ZFMboaS1TT1jJc4vqjXVfKElTk6Rn7s/dn+/gdJ4srhbFxsipRfcwPYOXs78f2Mu1r+Cb4ryf6mY5tWu7brVLpYtPx5AdIMRkpLWLTXVMyABhtJat6I0TzKYvdjJ2S+GtbzA6DnuyN2fZUx7S34e6Pizy1k38H/ArfTjN/kjdTTCmO7XHRd/V+YHjHo7LWUpb1svWn1/Y3gAAAAAAAAADEoqS0kk10ZkAc8sLGb17KKfWPD5GPoVPW1f5ZfqdIA5lg4yerq3n9puXzN8IRgtIRUV0S0PQAAAAAAAAA/9k=";

  //   Events
  imgUploader.addEventListener("change", () => {
    const selectedfile = imgUploader.files;
    if (selectedfile.length > 0) {
      const [imageFile] = selectedfile;
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const srcData = fileReader.result;
        imgBase64 = srcData;
        profileImgView.src = srcData;
      };
      fileReader.readAsDataURL(imageFile);
    }
  });
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let payload = {
      username: e.target[1].value,
      img: imgBase64,
    };
    if (payload.username.length <= 0) alert("Enter Your Name");
    else {
      sessionStorage.setItem("user", payload.username);
      sessionStorage.setItem("img", payload.img);
      location.href = "/chat";
    }
  });
};
