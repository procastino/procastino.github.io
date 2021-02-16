const menu = document.querySelector("#menu");

function buildMenu(data) {
  menu.textContent = "";
  const themes = Object.keys(data).sort();

  for (const theme of themes) {
    const link = document.createElement("a");
    link.classList.add("btn");
    link.setAttribute("href", "game.html");
    link.textContent = theme;

    link.onclick = () => {
      localStorage.setItem("theme", theme);
    };

    menu.append(link);
  }
}

//Esta función carga datos dunha url
async function loadData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// esta é a función inicial que carga os datos dunha url
// convirte eses datos en un formato usable internamente
// e chama a función que crea o menú inicial dinámicamente
async function init() {
  const questions = await loadData("https://bancotecno.automatica.dev");

  const headers = questions.shift();

  const parsedQuestions = questions.reduce((acc, curr) => {
    const bloque = curr[6];
    if (!acc[bloque]) {
      acc[bloque] = [];
    }

    acc[bloque].push({
      question: curr[0],
      image: curr[1],
      choice1: curr[2],
      choice2: curr[3],
      choice3: curr[4],
      choice4: curr[5],
    });

    return acc;
  }, {});

  localStorage.setItem("questions", JSON.stringify(parsedQuestions));

  buildMenu(parsedQuestions);
}

init();
