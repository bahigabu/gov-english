function downloadLocalStorage() {
  const data = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    data[key] = localStorage.getItem(key);
  }

  const json = JSON.stringify(data, null, 2);

  const blob = new Blob([json], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "localStorage-backup.json";

  document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(url);
}

function uploadLocalStorage(file) {
  const reader = new FileReader();

  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);

      if (
        typeof data !== "object" ||
        data === null ||
        Array.isArray(data)
      ) {
        alert("這不是有效的 Local Storage 備份檔案。");
        return;
      }

      const confirmed = confirm(
        "確定要使用這個檔案覆蓋目前的 Local Storage 資料嗎？\n\n目前的資料將會被清除。"
      );

      if (!confirmed) {
        return;
      }

      // 清除目前 Local Storage
      localStorage.clear();

      // 寫入備份資料
      Object.entries(data).forEach(
        ([key, value]) => {
          localStorage.setItem(key, value);
        }
      );

      alert(
        "Local Storage 資料已成功覆蓋。\n\n即將重新整理網站。"
      );

      location.reload();

    } catch (error) {
      console.error(
        "Local Storage 備份檔案讀取失敗：",
        error
      );

      alert(
        "檔案格式錯誤，無法讀取 Local Storage 資料。"
      );
    }
  };

  reader.readAsText(file);
}

function setupLocalStorageBackup() {

  const downloadButton =
    document.getElementById(
      "download-local-storage"
    );

  const uploadButton =
    document.getElementById(
      "upload-local-storage"
    );

  const fileInput =
    document.getElementById(
      "local-storage-file"
    );


  // 下載
  downloadButton.addEventListener(
    "click",
    () => {
      downloadLocalStorage();
    }
  );


  // 開啟檔案選擇
  uploadButton.addEventListener(
    "click",
    () => {
      fileInput.click();
    }
  );


  // 選擇檔案後
  fileInput.addEventListener(
    "change",
    () => {

      const file = fileInput.files[0];

      if (!file) {
        return;
      }

      uploadLocalStorage(file);

      // 讓同一個檔案可以再次選擇
      fileInput.value = "";
    }
  );

}