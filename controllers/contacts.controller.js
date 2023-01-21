const { dbContacts } = require('../models/contacts.js');

async function getContacts(req, res, next) {
  const { limit = 5, page = 1 } = req.query;
  const skip = (page - 1) * limit;
  const { user } = req;
  const { id: movieId } = req.body;

  const contacts = await dbContacts.find({}).skip(skip).limit(limit);
  return res.status(200).json(contacts);
}

async function getContactById(req, res, next) {
  const { contactId } = req.params;
  const contact = await dbContacts.findById(contactId);
  return res.status(200).json(contact);
}

async function deleteContact(req, res, next) {
  const { contactId } = req.params;

  await dbContacts.findByIdAndDelete(contactId);
  return res.status(200).json({ message: 'contact deleted' });
}

async function postContact(req, res, next) {
  const newContact = await dbContacts.create(req.body);
  return res.status(201).json(newContact);
}

async function putContact(req, res, next) {
  const { contactId } = req.params;
  const updatedContact = await dbContacts.findByIdAndUpdate(
    contactId,
    req.body,
    { new: true }
  );
  return res.status(200).json(updatedContact);
}

async function updateStatusContact(req, res, next) {
  const { contactId } = req.params;
  const updatedContact = await dbContacts.findByIdAndUpdate(
    contactId,
    req.body,
    { new: true }
  );
  return res.status(200).json(updatedContact);
}

module.exports = {
  getContacts,
  getContactById,
  deleteContact,
  postContact,
  putContact,
  updateStatusContact,
};
