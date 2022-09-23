// Selectors
const cardsWrapper = document.querySelector('.cards-wrapper');
const form = document.querySelector('.form');

// Consts
const API = 'https://randomuser.me/api/';
const USERS_QUANTITY = 30;
const USERS_COUNTRIES = 'gb,us,ua,fr,nl,nz';
const QUERY = `?results=${USERS_QUANTITY}&nat=${USERS_COUNTRIES}`;
const API_URL = API + QUERY;
// States and Arrs

let usersData;
let usersDataCopy;

let friendsData;
let tempArr;
let filGen;
let isSorted = false;

function handleUsersData(users) {
  // create user arr of obj
  users = users.map((user) => {
    const {
      name: { first: nameFirst, last: nameLast },
      gender,
      dob: { age },
      picture: { large: userPic },
      location: { city, country },
      phone,
      email,
    } = user;
    return {
      nameFirst,
      nameLast,
      gender,
      age,
      userPic,
      city,
      country,
      phone,
      email,
    };
  });
  return users;
  // create cope
}

getUsersData(API_URL)
  .then((friends) => {
    usersData = handleUsersData([...friends]);
    usersDataCopy = [...usersData];
    renderUsersCards(usersData);

    console.log(usersData);
  })
  .catch((error) => console.log(error));

function getFormData() {
  const formData = new FormData(form);
  console.log(
    formData.get('search'),
    formData.get('name-order'),
    formData.get('age'),
    formData.get('gender')
  );

  const search = formData.get('search').trim();
  const nameOrder = formData.get('name-order');
  const ageOrder = formData.get('age');
  const gender = formData.get('gender');
  let sortBy;
  if (nameOrder !== null) {
    sortBy = nameOrder;
  } else if (ageOrder !== null) {
    sortBy = ageOrder;
  }

  return {
    search,
    sortBy,
    gender,
  };
}

function handleUsers(users, { search, sortBy, gender }) {
  const filteredByName = filterUsersBySearch(users, search);
  const filteredByGender = filterUsersByGender(filteredByName, gender);
  const sortedUsers = sortUsers(filteredByGender, sortBy);
  return sortedUsers;
}

form.addEventListener('change', ({ target }) => {
  if (target.tagName === 'INPUT') {
    usersDataCopy = [...usersData];
    uncheckPrevSortParameter(target.name);
    const usersHandled = handleUsers(usersDataCopy, getFormData());
    cardsWrapper.innerHTML = '';
    renderUsersCards(usersHandled);
  }
});

function uncheckPrevSortParameter(currParameter) {
  if (currParameter === 'age' || currParameter === 'name-order') {
    // uncheckPrevSortParameter(target.name);
    const prevParameter = currParameter === 'age' ? 'name-order' : 'age';
    const inputs = document.querySelectorAll(`input[name='${prevParameter}']`);
    inputs.forEach((input) => {
      input.checked = false;
    });
  }
}

async function getUsersData(url) {
  let response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const { results } = await response.json();
  return results;
}

function renderUsersCards(users) {
  let usersCards = '';
  users.forEach((user) => {
    const userCard = createUserCard(user);
    usersCards += userCard;
  });
  cardsWrapper.innerHTML += usersCards;
}

function createUserCard(user) {
  const {
    nameFirst,
    nameLast,
    gender,
    age,
    userPic,
    city,
    country,
    phone,
    email,
  } = user;

  return `
    <li class="card">
      <div class="card-title ${gender}">
        <span>${gender}</span>
        <span>${age}</span>
      </div>
      <div class="card-content">
        <img class="card-img" src="${userPic}" alt="${nameFirst} photo" />
        <div class="card-field">
          <span class="card-field-name">Name: </span>
          <span>${nameFirst} ${nameLast}</span>
        </div>
        <div class="card-field">
          <span class="card-field-name">From: </span>
          <span>${city}, ${country}</span>
        </div>
        <div class="card-field">
          <span class="card-field-name">Email: </span>
          <span>${email}</span>
        </div>
        <div class="card-field">
          <span class="card-field-name">Tel: </span>
          <span>${phone}</span>
        </div>
      </div>
      <div class="card-contact ${gender}">
        <a class="contact ${gender}" href="tel:+${phone}"> call me </a>
        <a class="contact ${gender}" href="tel:+${phone}"> text me </a>
      </div>
    </li>
  `;
}

function sortUsersByName(users, sortType) {
  if (sortType === 'ascending') {
    users.sort((currentUser, nextUser) => {
      return currentUser.nameFirst > nextUser.nameFirst ? 1 : -1;
    });
  }
  if (sortType === 'descending') {
    users.sort((currentUser, nextUser) => {
      return currentUser.nameFirst > nextUser.nameFirst ? -1 : 1;
    });
  }
}

function sortUsersByAge(users, sortType) {
  if (sortType === 'younger') {
    users.sort((currentUser, nextUser) => {
      return currentUser.age - nextUser.age;
    });
  }
  if (sortType === 'older') {
    users.sort((currentUser, nextUser) => {
      return nextUser.age - currentUser.age;
    });
  }
}

function sortUsers(users, sortType) {
  switch (sortType) {
    case undefined:
      return users;
      break;
    case 'ascending':
      return users.sort((currentUser, nextUser) => {
        return currentUser.nameFirst > nextUser.nameFirst ? 1 : -1;
      });
      break;
    case 'descending':
      return users.sort((currentUser, nextUser) => {
        return currentUser.nameFirst > nextUser.nameFirst ? -1 : 1;
      });
      break;
    case 'younger':
      return users.sort((currentUser, nextUser) => {
        return currentUser.age - nextUser.age;
      });
    case 'older':
      return users.sort((currentUser, nextUser) => {
        return nextUser.age - currentUser.age;
      });
  }
}

function filterUsersByGender(users, genderFilter) {
  users = [...usersData];
  if (genderFilter === 'all') return users;
  return users.filter(({ gender }) => {
    // console.log(userGender === genderFilter);
    return gender === genderFilter;
  });
}

function filterUsersBySearch(users, search) {
  if (search === '') {
    return users;
  }
}
