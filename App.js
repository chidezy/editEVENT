import React, { useState, useEffect } from 'react';
import './App.css';
import db from './firebase-config'
import firebase from 'firebase';

import { AddCircleOutlineRounded, DeleteOutlineRounded, Edit } from '@material-ui/icons';

import { Button, TextField, Container, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Dialog, DialogContent, DialogActions } from '@material-ui/core';


function App() {

  const [events, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState('');
  const [toUpdateId, setToUpdateId] = useState('');


  useEffect(() => {
    console.log('useEffect Hook!!!');

    db.collection('event').onSnapshot(snapshot => {
      console.log('Firebase Snap!');
      setTodos(snapshot.docs.map(doc => {
        return {
          id: doc.id,
          name: doc.data().Name

        }
      }))
    })

  }, []);

  const addEVENT = (event) => {
    event.preventDefault();
    db.collection('event').add({
      Name: input,
      datetime: firebase.firestore.FieldValue.serverTimestamp()
    })
    setInput('');
  }

  const delEVENT = (id) => {
    db.collection('event').doc(id).delete().then(res => {
      console.log('Deleted!', res);
    });
  }

  const openUpdateDialog = (todo) => {
    setOpen(true);
    setToUpdateId(todo.id);
    setUpdate(todo.name);
  }

  const editTodo = () => {
    db.collection('event').doc(toUpdateId).update({
      Name: update,
      datetime: firebase.firestore.FieldValue.serverTimestamp()
    });
    setOpen(false);
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="sm">

      <form noValidate>

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="New Event ID"
          label="Enter Event"
          name="New Event Name"
          autoFocus
          value={input}
          onChange={event => setInput(event.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          onClick={addEVENT}
          disabled={!input}
          startIcon={<AddCircleOutlineRounded />}
        >
          ADD EVENT
      </Button>

      </form>

      <List dense={true}>
        {
          events.map(e => (

            <ListItem key={e.id} >

              <ListItemText
                primary={e.name}
                secondary={e.datetime}
              />

              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="JOIN" onClick={() => openUpdateDialog(e)}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" aria-label="REMOVE" onClick={() => delEVENT(e.id)}>
                  <DeleteOutlineRounded />
                </IconButton>
              </ListItemSecondaryAction>

            </ListItem>
          ))
        }
      </List>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            label="Update Event Name"
            type="text"
            fullWidth
            name="updateEventName"
            value={update}
            onChange={event => setUpdate(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={editTodo} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>


    </Container >
  );
}

export default App;