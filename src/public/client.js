let store = {
  user: { name: 'Reviewer' },
  apod: '',
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  roversData: [],
};

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = (state) => {
  let { rovers, apod, roversData } = state;

  return `
        <header>Mars Dashboard</header>
          <div id="navBar">
            ${NavBar(rovers)}
          </div>
          <div id="content">
          ${Greeting(store.user.name)}
          <section>
              <h3>Please select the rover, which you want to see at the top!</h3>
              <p>Here you can see, the "apod" picture from the starter code.</p>
              
              <img src="${roversData[0].img_src}" height="200px" width="200px" />
          </section>
          ${ImageOfTheDay(apod)}
          </div>
        <footer>Student: Rebeca Alvarez Morales</footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  store.rovers.forEach((rover) => getRoverData(store, rover));
  render(root, store);
  console.log(store);
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
  if (name) {
    return `<h1>Welcome, ${name}!</h1>`;
  }

  return `<h1>Hello!</h1>`;
};

const NavBar = (rovers) => {
  const roversButton = rovers.map((roversElem) => {
    return `<li><button id="${roversElem}" onclick=createRoverContent('${roversElem}')>${roversElem}</button></li>`;
  });
  return `<ul class="navBar">${roversButton.join('')}</ul>`;
};

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  console.log(photodate.getDate(), today.getDate());

  console.log(photodate.getDate() === today.getDate());
  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.media_type === 'video') {
    return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
  } else {
    return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
  }
};

// ------------------------------------------------------  API CALLS

// rover API call
const getRoverData = (state, rover) => {
  let { roversData } = state;

  fetch(`http://localhost:3000/photos/${rover}`)
    .then((res) => res.json())
    .then((roversData) => updateStore(store, { roversData }));
};

// Example API call
const getImageOfTheDay = (state) => {
  let { apod } = state;

  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));
};
