import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Failed to load notes', error);
    }
  };

  const saveNotes = async (notes) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
    } catch (error) {
      console.error('Failed to save notes', error);
    }
  };

  const addNote = () => {
    if (note.trim()) {
      const newNotes = [...notes, { id: Date.now().toString(), text: note }];
      setNotes(newNotes);
      setNote('');
      saveNotes(newNotes);
    }
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    saveNotes(newNotes);
  };

  return (
    <View style = {styles.container}>
      <Text style={styles.title}>Note Taking App</Text>
      <TextInput
        style = {styles.input}
        placeholder='Add a new note'
        value={note}
        onChangeText={setNote}
      />
      <Button title="Add Note" onPress={addNote} />
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.note}>
            <Text style={styles.noteText}>{item.text}</Text>
            <TouchableOpacity onPress={() => deleteNote(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  note: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBlockColor: '#ddd',
  },
  noteText: {
    fontSize: 18,
  },
  deleteButton: {
    color: 'red',
  },
});