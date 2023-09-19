document.addEventListener("DOMContentLoaded", function () {
  //needed variables
  const searchField = document.getElementById("search");
  const hWord = document.getElementById("word");
  const phonetic = document.getElementById("phonetic");
  const description = document.getElementById("description");
  const body = document.body;
  const toggleButton = document.getElementById("toggle-button");
  const select = document.getElementById("select");
  const audioButton = document.getElementById("audio");
  const error = document.getElementById("error");
  const found = document.getElementById("found");
  const notFound = document.getElementById("not-found");
  const noDefFound = document.getElementById("noDefFound");

  let parts = [];
  let lightMode = true;
  let word = "";

  // Function to display an error message
  function displayError(message) {
    error.innerHTML = `<p style='color:#FF5252; font-size: 14px; margin-top: 10px;font-weight:bold;'>${message}</p>`;
    searchField.style.border = "solid";
    searchField.style.borderColor = "#FF5252";
  }

  // Function to clear the error message
  function clearError() {
    error.innerHTML = ""; // Clear the error message
    searchField.style.border = "none";
    searchField.style.borderColor = "none";
  }

  searchField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (word === "") {
        displayError("Whoops, can't be empty...");
      } else {
        clearError(); // Clear any previous error message
        dictionaryAPI(word);
      }
    }
  });

  searchField.addEventListener("input", () => {
    word = searchField.value;
    if (word !== "") {
      clearError();
    }
  });

  //fetching the data
  function fetchDictionaryData(word) {
    return new Promise((resolve, reject) => {
      const xhttp = new XMLHttpRequest();

      xhttp.onload = function () {
        if (this.status === 200) {
          const jsonData = this.responseText;
          const data = JSON.parse(jsonData);
          resolve(data);
        } else {
          reject(new Error(`Request failed with status ${this.status}`));
        }
      };

      xhttp.onerror = function () {
        reject(new Error("Request failed"));
      };

      xhttp.open(
        "GET",
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      xhttp.send();
    });
  }

  //dynamically creating meaning and definitions
  async function dictionaryAPI(word) {
    try {
      const data = await fetchDictionaryData(word);
      // Update the DOM with the fetched data
      hWord.innerText = data[0].word;
      phonetic.innerText = data[0].phonetic;
      let meanings = data[0].meanings;

      displayMeaning();
      function displayMeaning() {
        let descriptionHTML = "";

        for (let i = 0; i < meanings.length; i++) {
          let m =
            '<div id="m" style="font-size: 20px; color: #757575; margin-top:30px;margin-bottom:30px">Meaning</div>';

          let meaningHTML = "<ul>";
          descriptionHTML += `<div class="parts">${meanings[i].partOfSpeech}</div><div class="hline"></div>`;
          let synonymsHTML =
            "<div style='margin-top:50px; margin-bottom: 40px;'>";

          for (let j = 0; j < meanings[i].definitions.length; j++) {
            meaningHTML += `<li class="list"  >${meanings[i].definitions[j].definition}</li>`;
          }
          for (let k = 0; k < meanings[i].synonyms.length; k++) {
            synonymsHTML += `<p style="color: #757575; font-size:20px; font-weight:lighter;">Synonym:  <a  href="#" style="cursor:pointer; text-decoration: none; border-bottom:1px solid #A445ED;"><span style="font-weight:600; color: #A445ED; font-size: 20px; ">${meanings[i].synonyms[k]}</span></a></p>`;
          }
          synonymsHTML += "</div>";
          meaningHTML += "</ul>";
          descriptionHTML = descriptionHTML + m + meaningHTML + synonymsHTML;
        }
        description.innerHTML = descriptionHTML;

        parts = document.querySelectorAll(".parts");
      }

      console.log(data);
    } catch (error) {
      found.style.display = "none";
      notFound.style.display = "block";
      body.style.display = "flex";
      body.style.flexDirection = "column";
      body.style.alignItems = "center";
      console.error(error.message);
      // Handle errors here, e.g., display an error message to the user
      searchField.addEventListener("keydown", function (event) {
        // Check if the user presses any key
        if (event.key) {
          found.style.display = "block";
          notFound.style.display = "none";
          body.style.display = "flex";
        }
      });
    }
  }

  //function for creating a dark/light mode
  function toggleMode() {
    toggleButton.addEventListener("click", () => {
      if (lightMode === true) {
        body.classList.add("darkbody");
        body.classList.remove("lightbody");
        parts.forEach((item) => {
          item.style.color = "white";
        });
        searchField.classList.add("darkSearch");
        searchField.classList.remove("lightSearch");
        searchField.classList.add("darkInput");
        searchField.classList.remove("lightInput");
        hWord.classList.remove("lightWord");
        hWord.classList.add("darkWord");
        select.classList.remove("lightselect");
        select.classList.add("darkselect");
        noDefFound.classList.remove("lightNo");
        noDefFound.classList.add("darkNo");

        lightMode = false;
      } else {
        body.classList.add("lightbody");
        body.classList.remove("darkbody");
        parts.forEach((item) => {
          item.style.color = "#2d2d2d";
        });
        searchField.classList.add("lightSearch");
        searchField.classList.remove("darkSearch");
        searchField.classList.remove("darkInput");
        searchField.classList.add("lightInput");
        hWord.classList.remove("darkWord");
        hWord.classList.add("lightWord");
        select.classList.add("lightselect");
        select.classList.remove("darkselect");
        noDefFound.classList.remove("darkNo");
        noDefFound.classList.add("lightNo");
        lightMode = true;
      }
    });
  }
  toggleMode();

  //event listener for changing fonts
  select.addEventListener("change", () => {
    // Get the selected font value
    const selectedFont = select.value;

    // Apply the selected font to the body element
    body.style.fontFamily = selectedFont;
  });
});
