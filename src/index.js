import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import './index.css';
import {
  AiFillHeart,
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlineGlobal,
  AiOutlineHeart,
  AiOutlineMail
} from 'react-icons/ai';
import {BiPhoneCall, BiTrash} from 'react-icons/bi';

function UserWebsite(props) {
  const website = "http://" + props.website;
  return (
      <span className="user-body-detail">
        <AiOutlineGlobal className="user-body-detail-text"/>
        <a className="user-body-detail-text" href={website}>{props.website}</a>
      </span>
  );
}

function UserContactDetail(props) {
  return (
      <span className="user-body-detail">
        <BiPhoneCall className="user-body-detail-text"/>
        <p className="user-body-detail-text">{props.phone}</p>
      </span>
  );
}

function UserEmail(props) {
  return (
      <span className="user-body-detail">
        <AiOutlineMail className="user-body-detail-text"/>
        <p className="user-body-detail-text">{props.email}</p>
      </span>
  );
}

function UserName(props) {
  return (
      <div>
        <h3>{props.name}</h3>
      </div>
  );
}

function UserCardButtons(props) {
  let lovedButton;
  if (props.isLoved) {
    lovedButton = <li className="li-button">
      <button className="button" onClick={props.onClickLove}><AiFillHeart/></button>
    </li>
  } else {
    lovedButton = <li className="li-button">
      <button className="button" onClick={props.onClickLove}><AiOutlineHeart/></button>
    </li>
  }
  return (
      <ul className="card-buttons">
        {lovedButton}
        <li className="li-button">
          <button className="button" onClick={props.onClickEditOpen}><AiOutlineEdit/></button>
        </li>
        <li className="li-button">
          <button className="button" onClick={props.onClickDelete}><BiTrash/></button>
        </li>
      </ul>
  )
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
      <div>
        <img className="image" src={src} alt="Placeholder"/>
      </div>
  );
}

function UserCard(props) {
  return (
      <div className="card">
        <UserCardCover username={props.username}/>
        <UserCardBody name={props.name} email={props.email} phone={props.phone} website={props.website}/>
        <UserCardButtons
            isLoved={props.isLoved}
            onClickDelete={props.onClickDelete}
            onClickLove={props.onClickLove}
            onClickEditOpen={props.onClickEditOpen}
        />
      </div>
  );
}

function UsersPage() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [idEditUser, setIdEditUser] = useState(null);

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

  function openEditModal(id) {
    setIsEditOpen(true);
    setIdEditUser(id);
  }

  function afterOpenEditModal() {
  }

  function closeEditModal() {
    setIsEditOpen(false);
  }

  let toggleLoveUser = (id) => {
    let i;
    for (i = 0; i < users.length; i++) {
      if (id === users[i].id) {
        let newUsers = users.slice()
        if (users[i].isLoved) {
          newUsers[i].isLoved = false;
        } else {
          newUsers[i].isLoved = true;
        }
        setUsers(newUsers);
        break;
      }
    }
  }

  let handleDeleteUser = (id) => {
    let i;
    for (i = 0; i < users.length; i++) {
      if (id === users[i].id) {
        break;
      }
    }
    const newUsers = [].concat(users.slice(0, i), users.slice(i + 1, users.length))
    setUsers(newUsers);
  }

  let editUser = (id, name, email, phone, website) => {
    for (let i = 0; i < users.length; i++) {
      if (id === users[i].id) {
        let newUser = users[i];
        newUser.name = name;
        newUser.email = email;
        newUser.phone = phone;
        newUser.website = website;
        const newUsers = [].concat(users.slice(0, i), [newUser], users.slice(i + 1, users.length))
        setUsers(newUsers);
        closeEditModal();
        break;
      }
    }
  }

  let getUserCard = (i) => {
    const {id, name, username, email, phone, website} = users[i];
    return (
        <UserCard
            key={id} name={name} username={username} email={email} phone={phone} website={website}
            onClickDelete={() => handleDeleteUser(id)}
            onClickLove={() => toggleLoveUser(id)}
            onClickEditOpen={() => openEditModal(id)}
            isLoved={users[i].isLoved}
        />)
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

    const customStyles = {
      content: {
        width: '40%',
        height: '50%',
        margin: 'auto',
        marginTop: 'auto',
      },
    };

    let user = null;
    if (isEditOpen) {
      for (let i = 0; i < users.length; i++) {
        if (idEditUser === users[i].id) {
          user = users[i];
          break;
        }
      }
    }

    return (
        <div>
          <div className="page">
            {rows}
          </div>
          <Modal
              isOpen={isEditOpen}
              onAfterOpen={afterOpenEditModal}
              onRequestClose={closeEditModal}
              contentLabel="Example Modal"
              style={customStyles}
          >
            {isEditOpen ?
                <UserModal closeEditModal={closeEditModal} editUser={editUser} user={user}/>
                :
                <UserModal closeEditModal={closeEditModal} editUser={editUser}/>
            }

          </Modal>
        </div>
    );
  }
}

function UserModal(props) {
  let defaultName, defaultEmail, defaultPhone, defaultWebsite;
  if (props.user) {
    defaultName = props.user.name;
    defaultEmail = props.user.email;
    defaultPhone = props.user.phone;
    defaultWebsite = props.user.website;
  }
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState(defaultPhone);
  const [website, setWebsite] = useState(defaultWebsite);
  return (
      <div>
        <div className="modal-header">
          <p>Edit User</p>
          <button onClick={props.closeEditModal}><AiOutlineClose/></button>
        </div>
        <div className="modal-body">
          <form>
            <div>
              <label>Name</label>
              <input
                  type="text"
                  defaultValue={defaultName}
                  onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div>
              <label>Email</label>
              <input
                  type="text"
                  defaultValue={defaultEmail}
                  onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <label>Phone</label>
              <input
                  type="text"
                  defaultValue={defaultPhone}
                  onChange={(event) => setPhone(event.target.value)}
              />
            </div>
            <div>
              <label>Website</label>
              <input
                  type="text"
                  defaultValue={defaultWebsite}
                  onChange={(event) => setWebsite(event.target.value)}
              />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button onClick={props.closeEditModal}>Cancel</button>
          <button onClick={() => props.editUser(props.user.id, name, email, phone, website)}>OK</button>
        </div>
      </div>
  );
}

Modal.setAppElement('#root');
ReactDOM.render(<UsersPage/>, document.getElementById('root'));