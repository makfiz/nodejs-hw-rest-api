const fs = require('fs/promises');
const path = require('path');
const shortid = require('shortid');

const contactsPath = path.resolve(__dirname, 'contacts.json');

const readDb = async () => {
  const db = await fs.readFile(contactsPath);
  const contacts = JSON.parse(db);
  return contacts;
};

const writeDb = async data => {
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
};

const listContacts = async () => {
  return await readDb();
};

const getContactById = async contactId => {
  const contacts = await readDb();
  const contact = contacts.find(contact => contact.id === contactId);
  return contact || null;
};

const removeContact = async contactId => {
  const contacts = await readDb();
  const updatedDb = contacts.filter(contact => contact.id !== contactId);
  await writeDb(updatedDb);
};

const addContact = async body => {
  const { name, email, phone } = body;
  const contacts = await readDb();
  const newContact = {
    id: `${shortid.generate()}`,
    name,
    email,
    phone,
  };

  contacts.push(newContact);
  await writeDb(contacts);
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await readDb();
  const { name, email, phone } = body;

  const [updatedContact] = contacts.filter(contact => contact.id === contactId);

  if (name) {
    updatedContact.name = name;
  }
  if (email) {
    updatedContact.email = email;
  }
  if (phone) {
    updatedContact.phone = phone;
  }

  await writeDb(contacts);
  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
