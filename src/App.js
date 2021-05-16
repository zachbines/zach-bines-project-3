import { useEffect, useState } from 'react';
import './App.css';
import firebase from './firebase.js';
// import WatchList from './WatchList.js';
import UserListCard from './UserListCard.js';



// // how are you appending the username to your page, given that we don't use traditional vanilla JS DOM methods in React? (Perhaps you can use state here again? 
// If username is true, show an element with that value; if not, show nothing or "Create your watchlist" prompt

// what is the data structure for the showInput state ? users will be adding up to 5 shows, correct ? How are these 5 shows being saved - AKA structured - within state so you can:
    // a) easily render them within the ListItems component
    // b) eventually pass them into firebase if the user decides to save their list

// remember to "control" all your inputs (i.e.add an onChange event and tie their values to state)

// how will you structure the username PLUS the list of TV shows so you can pass both data points to Firebase in a single data structure (which can then be easily accessed once you have to render all the submitted "Watch lists" from all users to the page ?)

// do you need a method which will query Firebase every time a new user loads your app to load previously saved lists ? if so, when / how will this method be called (is requesting data from Firebase once all components have loaded, perhaps, a side effect ?)

// storing a reference to the database
const dbRef = firebase.database().ref('/users');

function App() {
  
  // state for userName
  const [ userName, setUserName ] = useState(false);
  //state for whether the user is logged in or not
  const [ loggedIn, setLoggedIn ] = useState(false);
  // state for the array of shows
  const [ shows, setShows ] = useState([]);
  // const [ dbShows, setDbShows ] = useState([]);
  // state for the users choice input
  const [ showInput, setShowInput ] = useState('');
//state for the done button
  const [ done, setDone ] = useState(false);
  
  // when user "logs in" the database will be queried to check for that name 
  // if the username exsits, show their picks and the ability to add to them, else, just show the app interface. 



  //this is me trying to query the database to add user cards on page load
useEffect(
    () => {
      dbRef.on('value', (snapshot) => {
      const data = snapshot.val();
      for (let key in data) {
        // loop through database go into every object and extract key values
        console.log(data[key]);
          // new ref point using random key number
      } 
    })
  }
)

  //printing new user Card
  useEffect(
    () => {
     
      dbRef.on('value', (snapshot) => {
        const data = snapshot.val();
        // console.log(data)
        let dbShows = [];
        for (let key in data) {
          // loop through database, if the userName matches, go into that object
          if (userName === data[key].userName) {
            let currentDbRef = firebase.database().ref(`users/${key}`); // new ref 
            // console.log(key); // gives me the shows array
            //the idea as to query the database so that users can bring up their lists 
            // point using random key number
            currentDbRef.on('value', (snapshot) => {
              const currentData = snapshot.val();
              // console.log(currentData);
              dbShows = currentData.shows;
              // console.log(dbShows)
            })

          } 
        }

        if (done) {
          // trying to access the shows from the database rather than the local array
          setShows(dbShows);
          console.log('this one', shows);
          // console.log('it is done');
        }
      })
      
    },
    []
  )

    
//USER CHOICE INPUT HANDLERS -------------
  // user show choice change handler
  const handleNewChoice = (event) => {
    let currentChoice = event.target.value;
    setShowInput(currentChoice);
    // console.log(currentChoice);
  }
  // everytime the add button is clicked:
      //  setShows is updated
  const handleAddClick = () => {
    
      // update shows array 
    const newShow = shows.concat(showInput);
    setShows(newShow); 

    console.log(newShow); // gives me all entries. why?
    // console.log(shows); // doesnt give me the most current entry. why?
    setShowInput('')
  }

  
  // done button handler
  const handleDoneClick = (event) => {  
    event.preventDefault();
    // console.log(userProfile);
    dbRef.push({ userName, shows });
    setDone(true);
    setLoggedIn(false);
    // this give users/jdhfdkajaj/shows+userName as siblings
  }
  
  // USERNAME CHANGE/LOGIN CLICK HANDLERS -------
  // username change handler
  const handleNameChange = (event) => {
    let currentUser = event.target.value;
    setUserName(currentUser);
    // console.log(currentUser);
  }
  // login button handler
  const handleLoginClick = () => {
    setDone(false);
    setLoggedIn(true);
    console.log(userName);
    // handle the name appending to the page
  }


  return (
    <div className="App">
      <h1>wannaWatch</h1>

      { !loggedIn ? 
      <form action="submit" className="user-login">
        <label htmlFor="username" className="sr-only">What's your name?</label>
        {/* put onChange, and value in input
        onChange is a function which sets the userInput name,
        value={userName} */}
        <input type="text" id="username" placeholder="Type your name here" onChange={handleNameChange}/>
        {/* onCLick = function which sets the state of Login to true. this renders the user-choice input on the screen and hides this form */}
        <button className="button login" onClick={handleLoginClick}>Login</button>
      </form> : "" }

      {/* ShowInput.js  */}
      { loggedIn ? 
      <div>
        <label htmlFor="user-choice" className="sr-only">What shows would you like to watch?</label>
        <input type="text" id="user-choice" value={showInput} onChange={handleNewChoice}/>
        <button className='button add' onClick={handleAddClick}>ADD</button>
      </div> : '' }

      {/* WatchList.js */}

      <form action="submit">
        { loggedIn ? <h2>{userName}'s Watch List</h2> : ''}
        <ul>
          {
            // if shows exists..
            shows.map((show, i) => {
              // console.log(i);
              return <li key={i}>{show}</li>;
            })
          }
        </ul>
        <button className="button done" onClick={handleDoneClick}>DONE</button>
      </form>
        
        {/* user Card */}
        { done ? <UserListCard userName={userName} showList={shows} /> : ''}

      </div>
  );
}

export default App;
