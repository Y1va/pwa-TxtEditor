import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    }
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
// Function to add some content to the database
export const putDb = async (content) => {
  console.log('PUT from the database');

  // Open the database
  const textDb = await openDB('jate', 1);

  // Create new transaction
  const tx = textDb.transaction('jate', 'readwrite');
  const store = tx.objectStore('jate');

  // Adds the data to the object store
  const request = store.put({ id: 1, value: content })
  const result = await request;
  console.log('Data saved to the database', result)
}



// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  console.log('GET from the database');

  // Create a connection to the database and version we want to use
  const textDb = await openDB('jate', 1);

  // New transaction, and data privileges
  const tx = textDb.transaction('jate', 'readonly');

  // Open up the desired object store
  const store = tx.objectStore('jate')

  // Use the getAll method to get all data in the database
  const request = store.getAll();

  // Get confirmation of the request
  const result = await request;
  console.log('result.value', result)
  return result?.value
};

// Start the database
initdb();
