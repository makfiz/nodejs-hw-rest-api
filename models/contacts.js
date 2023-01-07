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
  try {
    return await readDb();
  } catch (err) {
    console.log(err);
  }
};

const getContactById = async contactId => {
  try {
    const contacts = await readDb();
    const contact = contacts.find(contact => contact.id === contactId);
    return contact || null;
  } catch (err) {
    console.log(err);
  }
};

const removeContact = async contactId => {
  try {
    const contacts = await readDb();
    const newContacts = contacts.filter(contact => contact.id !== contactId);
    await writeDb(newContacts);
  } catch (err) {
    console.log(err);
  }
};

const addContact = async body => {
  try {
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
  } catch (err) {
    console.log(err);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await readDb();
    const { name, email, phone } = body;
    let updatedСontact;
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
        updatedСontact = contact;
        return updatedСontact;
      }
    });
    await writeDb(contacts);
    return updatedСontact;
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
