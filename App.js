import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, FlatList, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { addDoc, deleteDoc, doc, collection, firestore, SHOPPING_ITEM, serverTimestamp } from './firebase/Config';
import { useEffect, useState } from 'react';
import { onSnapshot, orderBy, query, QuerySnapshot } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';


export default function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    const itemsRef = collection(firestore, SHOPPING_ITEM);
    const q = query(itemsRef, orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(list);
    });
    return () => unsubscribe();
  }, []);

  const addItem = async () => {
    if (newItem.trim()) {
      await addDoc(collection(firestore, SHOPPING_ITEM), {
        name: newItem,
        timestamp: serverTimestamp(),
      });
      setNewItem('');
    }
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(firestore, SHOPPING_ITEM, id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping List</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a new item"
        value={newItem}
        onChangeText={setNewItem}
      />
      <Button title="Add Item" onPress={addItem} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
              <Ionicons name="trash-outline" size={24} color="red" />
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
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 18,
  },
});