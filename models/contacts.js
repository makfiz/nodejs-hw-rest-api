const fs = require('fs/promises');
const path = require('path');
const shortid = require('shortid');

const contactsPath = path.resolve(__dirname, 'models/contacts.json');

const readDb = async () => {
  const db = await fs.readFile(contactsPath);
  const contacts = JSON.parse(db);
  return contacts;
};

const writeDB = async data => {
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
};

const listContacts = async () => {
  try {
    return await readDb();
  } catch (err) {
    console.log(err);
  }
};

const getContactById = async contactId => {
  try {
    const contacts = await readDb();
    return contacts.find(contact => contact.id === contactId);
  } catch (err) {
    console.log(err);
  }
};

const removeContact = async contactId => {
  try {
    const contacts = await readDb();
    const newContacts = contacts.filter(contact => contact.id !== contactId);
    await writeDB(newContacts);
  } catch (err) {
    console.log(err);
  }
};

const addContact = async body => {
  try {
    const { name, email, phone } = body;
    const contacts = await readDb();
    contacts.push({
      id: `${shortid.generate()}`,
      name,
      email,
      phone,
    });
    await writeDB(contacts);
  } catch (err) {
    console.log(err);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await readDb();
    const { name, email, phone } = body;

    contacts.forEach(contact => {
      if (contact.id === contactId) {
        if (name) {
          contact.name = name;
        }
        if (email) {
          contact.email = email;
        }
        if (phone) {
          contact.phone = phone;
        }
      }
    });

    await writeDB(contacts);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
