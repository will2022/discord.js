const Action = require('./Action');
const { Events } = require('../../util/Constants');

class UserNoteUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const oldNote = client.user.cache.notes.get(data.id);
    const note = data.note.length ? data.note : null;

    client.user.cache.notes.set(data.id, note);

    client.emit(Events.USER_NOTE_UPDATE, data.id, oldNote, note);

    return {
      old: oldNote,
      updated: note,
    };
  }
}

/**
 * Emitted whenever a note is updated.
 * @event Client#userNoteUpdate
 * @param {User} user The user the note belongs to
 * @param {string} oldNote The note content before the update
 * @param {string} newNote The note content after the update
 */

module.exports = UserNoteUpdateAction;