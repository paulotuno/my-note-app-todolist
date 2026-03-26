import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Pressable, Alert } from 'react-native';
import { useState } from 'react';

export default function App() {

  const [enteredNoteText, setEnteredNoteText] = useState('');
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  function noteInputHandler(text) {
    setEnteredNoteText(text);
  }

  function addNoteHandler() {
    if (!enteredNoteText.trim()) return;

    setNotes((currentNotes) => [
      ...currentNotes,
      { id: Math.random().toString(), text: enteredNoteText }
    ]);

    setEnteredNoteText("");
  }

  function deleteNoteHandler(id) {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== id)
    );

    if (selectedNoteId === id) {
      setSelectedNoteId(null);
      setEnteredNoteText("");
    }
  }

  function confirmDeleteHandler(id) {
    Alert.alert(
      "Delete this note?",
      "Are you sure you want to delete it?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", style: "destructive", onPress: () => deleteNoteHandler(id) }
      ]
    );
  }

  function openNoteHandler(id) {
    const noteToEdit = notes.find((note) => note.id === id);
    if (!noteToEdit) return;

    setSelectedNoteId(id);
    setEnteredNoteText(noteToEdit.text);
  }

  function updateNoteHandler() {
    if (!enteredNoteText.trim()) return;

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === selectedNoteId
          ? { ...note, text: enteredNoteText }
          : note
      )
    );

    setSelectedNoteId(null);
    setEnteredNoteText("");
  }

  function cancelEditHandler() {
    setSelectedNoteId(null);
    setEnteredNoteText("");
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Notes App</Text>

      <View style={styles.addNote}>
        <TextInput
          style={styles.textInput}
          placeholder="Add a note"
          onChangeText={noteInputHandler}
          value={enteredNoteText}
        />

        {selectedNoteId ? (
          <View style={styles.editButtons}>
            <Button title="Update" onPress={updateNoteHandler} />
            <Button title="Cancel" color="red" onPress={cancelEditHandler} />
          </View>
        ) : (
          <Button title="Add Note" onPress={addNoteHandler} />
        )}
      </View>

      <View style={styles.notesList}>
        <Text style={styles.listTitle}>List of Notes:</Text>

        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => openNoteHandler(item.id)}
              onLongPress={() => confirmDeleteHandler(item.id)}
              delayLongPress={300}
              style={({ pressed }) => [
                styles.noteItem,
                selectedNoteId === item.id && styles.selectedItem,
                pressed && styles.pressedItem
              ]}
            >
              <Text>{item.text}</Text>
            </Pressable>
          )}
        />
      </View>

      <StatusBar style="auto" />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  addNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },

  editButtons: {
    flexDirection: 'row',
    gap: 10,
  },

  notesList: {
    flex: 1,
  },

  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  noteItem: {
    backgroundColor: '#e3e3e3',
    padding: 15,
    borderRadius: 6,
    marginBottom: 10,
  },

  selectedItem: {
    backgroundColor: '#cce5ff',
  },

  pressedItem: {
    opacity: 0.5,
  },
});