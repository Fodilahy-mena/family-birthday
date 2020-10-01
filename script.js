
console.log('Happy birthday...');

import {
	lightFormat,
	differenceInCalendarYears,
	isPast,
	differenceInCalendarDays,
	compareAsc,
	addYears,
	setYear,
	isToday,
} from 'date-fns';
import wait from 'waait';

import familyData from './data/family.json';

let families = [];

// families = familyData;
console.log(families);

const tbody = document.querySelector('tbody');

const searchNameFilter = document.querySelector('.search');
const filterMonth = document.querySelector('.select');
console.log(searchNameFilter, filterMonth);
// const resetFilter = document.querySelector('.reset-filters');
// console.log(resetFilter);

searchNameFilter.addEventListener('input', () => showFamilies(families));
filterMonth.addEventListener('change', () => showFamilies(families));
// resetFilter.addEventListener('click', resetFilters);
// function resetFilters() {
//     tbody.reset();
//     showFamilies(families);
// }

// ***** UTILS FUNCTION TO COMPUTE NEXT BIRTHDAY *****

function getNextBirthday(birthday) {
	const birthdayDate = new Date(birthday);
	const today = new Date();

	// we check when is their next birthday. we check the date with the same month and day as their birthday, and add this year.
	let nextBirthDay = setYear(birthdayDate, today.getFullYear());

	// if it's today, we return the value
	if (isToday(nextBirthDay)) {
		return nextBirthDay;
	}
	// if the date is already behind us, we add + 1 to the year
	if (isPast(nextBirthDay)) {
		nextBirthDay = addYears(nextBirthDay, 1);
	}
	return nextBirthDay;
}


// Show families

function showFamilies(familiesList) {
    let familiesFilteredAndSorted = familiesList;

    if(searchNameFilter.value !== '') {
        familiesFilteredAndSorted = familiesFilteredAndSorted.filter(family => {
            const fullNameLowerCase = family.firstName.toLowerCase() + ' ' + family.lastName.toLowerCase();
            return fullNameLowerCase.includes(searchNameFilter.value.toLowerCase()); 
        });
    }

    // Todo filter month

    if (filterMonth.value !== '') {
		familiesFilteredAndSorted = familiesFilteredAndSorted.filter(family => {
			let birthday = new Date(family.birthday);
			return birthday.getMonth() === Number(filterMonth.value);
		});
	}

    // we sort from the soonest birthday to the last.
	familiesFilteredAndSorted.sort((a, b) => {
		let dayBirthdayA = differenceInCalendarDays(getNextBirthday(a.birthday), new Date());
		let dayBirthdayB = differenceInCalendarDays(getNextBirthday(b.birthday), new Date());
		return compareAsc(dayBirthdayA, dayBirthdayB);
	});

    let html = familiesFilteredAndSorted.map(family => {
        let birthdayDate = new Date (family.birthday);
        console.log('birthday date', birthdayDate);
        let today = new Date();
        let nextBirthDay = getNextBirthday(birthdayDate);
        // we do the difference between this date and the next
        let daysBirthday = differenceInCalendarDays(nextBirthDay, today);
        return `
        <tr data-id="${family.id}" name="${family.firstName}">
        
            <th scope="row">
                <img src="${family.picture}" alt="${family.firstName + ' ' + family.lastName}"/>
            </th>
            <td>
                <span>${family.firstName} ${family.lastName}</span><br>
            </td>
            <td>
                <strong>  ${
                    daysBirthday === 0
                        ? `He/She is ${
                                differenceInCalendarYears(new Date(), birthdayDate) + 1
                          }</b> today`
                        : `Turns <b>${
                                differenceInCalendarYears(new Date(), birthdayDate) + 1
                          }</b> on the ${lightFormat(nextBirthDay, 'dd/MM')}`
                }</sup></strong>
            </td>
            <td>${daysBirthday === 0 ? `🎂🎂🎂` : `🎂  ${daysBirthday} days`} left until ${family.firstName} ${family.lastName}'s birthday</td>
            <td>
                <button class="edit">
                    <img src="./edit.svg" width="35"/>
                </button>
            </td>
            <td>
                <button class="delete">
                    <img src="./del.svg" width="35"/>
                </button>
            </td>
		</tr>
        `;
    }).join('');
if (familiesFilteredAndSorted.length === 0) {
		html = `<p><i>Nobody matches that filter options.</p>`;
	}

	tbody.innerHTML = html;
}


// ***** LOCALSTORAGE FUNCTIONS *****

const initLocalStorage = () => {
	let stringFromLS = localStorage.getItem('families');
	let lsItems = JSON.parse(stringFromLS);
	if (lsItems) {
		families = lsItems;
	} else {
		// used fetch here. or peopleData, that was imported from the people.json
		families = familyData;
	}
	// launch a custom event,
	showFamilies(families);
	updateLocalStorage();
};

// we want to update the local storage each time we update, delete or add an attribute
const updateLocalStorage = () => {
	localStorage.setItem('families', JSON.stringify(families));
};

// STARTER FUNCTION FOR THE PROJET
initLocalStorage();