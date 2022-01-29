import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function UserWebsite(props) {
  const website = "http://" + props.website;
  return (
      <div>
        <a href={website}>{props.website}</a>
      </div>
  );
}

function UserContactDetail(props) {
  return (
      <div>
        <p>{props.phone}</p>
      </div>
  );
}

function UserEmail(props) {
  return (
      <div>
        <p>{props.email}</p>
      </div>
  );
}

function UserName(props) {
  return (
      <div>
        <h3>{props.name}</h3>
      </div>
  );
}

function UserCardBody(props) {
  return (
      <div className="card-body">
        <UserName name={props.name}/>
        <UserEmail email={props.email}/>
        <UserContactDetail phone={props.phone}/>
        <UserWebsite website={props.website}/>
      </div>
  )
}

function UserCardCover(props) {
  const src = "https://avatars.dicebear.com/v2/avataaars/" + props.username + ".svg?options[mood][]=happy";
  return (
      <div className="image">
        <img src={src}/>
      </div>
  );
}

function UserCard(props) {
  return (
      <div className="card">
        <UserCardCover username={props.username}/>
        <UserCardBody name={props.name} email={props.email} phone={props.phone} website={props.website}/>
      </div>
  );
}

function UsersPage() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then(res => res.json())
            .then(
                (result) => {
                  setIsLoaded(true);
                  setUsers(result);
                },
                (error) => {
                  setIsLoaded(true);
                  setError(error);
                }
            )
      }, []
  )

  let getUserCard = (i) => {
    const {id, name, username, email, phone, website} = users[i];
    return <UserCard key={id} name={name} username={username} email={email} phone={phone} website={website}/>
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    let rows = [];
    for (let i = 0; i < users.length; i++) {
      rows.push(getUserCard(i))
    }
    return (
        <div className="page">
          {rows}
        </div>
    );
  }

}

ReactDOM.render(<UsersPage/>, document.getElementById('root'));