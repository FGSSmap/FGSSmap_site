
document.getElementByID("btn1").addEventListener("click", ()->{ loadAndDisplayPrefPlacemarks(code);})

function loadAndDisplayPlacemarks(kmlPath) {
  placemarkContainer.style.display = "flex";

  fetch(kmlPath)
    .then(response => {
      if (!response.ok) throw new Error("KMLの読み込みに失敗しました");
      return response.text();
    })
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
      placemarkContainer.innerHTML = "";

      const documentTag = data.getElementsByTagName("Document")[0];
      if (!documentTag) {
        console.warn("Documentタグが見つかりません");
        return;
      }

      const placemarks = documentTag.getElementsByTagName("Placemark");

      for (const placemark of placemarks) {
        const name = placemark.getElementsByTagName("name")[0]?.textContent || "名称不明";
        const descNode = placemark.getElementsByTagName("description")[0];
        const desc = descNode ? descNode.innerHTML : "";
        const coords = placemark.getElementsByTagName("coordinates")[0]?.textContent.trim() || "";
        const [lng, lat] = coords.split(",");

        const div = document.createElement("div");
        div.className = "placemark-box";
        div.innerHTML = `
          <h3>${name}</h3>
          <p><small>${desc}</small></p>
        `;
        placemarkContainer.appendChild(div);
      }
    })
    .catch(err => {
      console.error("KML読み込みエラー:", err);
    });
}
