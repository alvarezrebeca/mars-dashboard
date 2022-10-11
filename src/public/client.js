let store = {
  user: { name: 'Reviewer' },
  apod: '',
  rovers: ['Opportunity', 'Spirit', 'Curiosity'],
  roversData: [],
  selectedRover: [],
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
  let { rovers, apod } = state;

  return `
        <header>Mars Dashboard</header>
        <div id="navBar">
          ${NavBar(rovers)}
        </div>
        <br>
        <div id="content">
          ${Greeting(store.user.name)}
          <section>
          <h3>Please select the rover, which you want to see at the top!</h3>
          <p>Here you can see, the "apod" picture from the starter code.</p>
          </section>
          ${ImageOfTheDay(apod)}
        </div>
        <div id="roverDiv"></div>
        <br>
        <footer>Student: Rebeca Alvarez Morales</footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
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
    return `<li><button id="${roversElem}" onclick=createRoverInfo('${roversElem}')>${roversElem}</button></li>`;
  });
  return `<ul class="navBar">${roversButton.join('')}</ul>`;
};

const createRoverInfo = async (selectedRover) => {
  await getRoverData(store, selectedRover);

  console.log(store.roversData);

  const roverDiv = document.getElementById('roverDiv');

  // Create roverInfo div
  let roverInfo = document.createElement('div');
  roverInfo.className = 'roverInfo';

  const { name, landing_date, launch_date, status } = store.roversData[0].rover;
  const createParagraphElem = (contentName, contentVariable) => {
    const p = document.createElement('p');
    p.textContent = contentName + ': ' + contentVariable;
    return p;
  };

  roverInfo.append(createParagraphElem('Name', name));
  roverInfo.append(createParagraphElem('Landing Date', landing_date));
  roverInfo.append(createParagraphElem('Launch Date', launch_date));
  roverInfo.append(createParagraphElem('Status', status));

  // Create roverPhoto div
  let roverPhotos = document.createElement('div');
  roverPhotos.className = 'roverPhotos';

  const createImgElem = (contentPhoto) => {
    const img = document.createElement('img');
    console.log('Funktion:' + contentPhoto);
    img.src = `${contentPhoto}`;
    img.className = 'imgRoverPhoto';
    console.log('Ausgabe create img:' + img.src);
    return img;
  };

  for (count = 0; count < store.roversData.length; count++) {
    const { img_src } = store.roversData[count];
    console.log(img_src);
    roverPhotos.append(createImgElem(img_src));
  }

  // append roverInfo and roverPhotos to roverDiv
  roverDiv.appendChild(roverInfo);
  roverDiv.appendChild(roverPhotos);

  // remove content div
  document.getElementById('content').remove();
};

// Example of a pure function that renders information requested from the backend
const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  console.log('Ausgabe 1', photodate.getDate(), today.getDate());

  console.log('Ausgabe 2', photodate.getDate() === today.getDate());
  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  // remove failures https://knowledge.udacity.com/questions/620231
  if (apod.media_type === 'video') {
    return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
  } else {
    return `
            <img class="apod" src="${apod && apod.image.url}" />
            <p>${apod && apod.image.explanation}</p>
        `;
  }
};

// ------------------------------------------------------  API CALLS

// rover API call
const getRoverData = (state, rover) => {
  let { roversData } = state;

  return fetch(`http://localhost:3000/photos/${rover}`)
    .then((res) => res.json())
    .then((roversData) => updateStore(store, { roversData }));
};

// Example API call
const getImageOfTheDay = (state) => {
  let { apod } = state;

  return fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));
};
