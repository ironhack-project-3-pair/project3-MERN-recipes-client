class MessageService {
  constructor() {
    this.timeoutId = null;
    this.defaultTimer = 2000; // default duration for message display
  }

  showMessage = (message, setMessage, timer = this.defaultTimer) => {
    // Clear the previous timeout if there is one to avoid nested setTimeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    setMessage(message);

    // Save the ID of the new timeout so it can be cleared later
    this.timeoutId = setTimeout(() => {
      setMessage('');
    }, timer);
  };

  showCreateMessage = (itemName, setMessage, timer = this.defaultTimer) => {
    this.showMessage(`Successfully created ${itemName}`, setMessage, timer);
  };

  showAddMessage = (itemName, setMessage, timer = this.defaultTimer) => {
    this.showMessage(`Successfully added ${itemName}`, setMessage, timer);
  };
  
  showWarningMessage = (itemName, setMessage, timer = this.defaultTimer) => {
    this.showMessage(`Please provide quantity for ${itemName}`, setMessage, timer);
  };

  showUpdateMessage = (itemName, setMessage, timer = this.defaultTimer) => {
    this.showMessage(`Successfully updated ${itemName}`, setMessage, timer);
  };

  showDeleteMessage = (itemName, setMessage, timer = this.defaultTimer) => {
    this.showMessage(`Successfully deleted ${itemName}`, setMessage, timer);
  };
}

// Create one instance object
const messagesService = new MessageService();

export default messagesService;
