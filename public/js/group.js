let currentgroupId;
document.addEventListener("DOMContentLoaded", async function () {
  const addGroupButton = document.getElementById("add-group-button");
  const addGroupForm = document.getElementById("add-group-form");

  try {
    const token = localStorage.getItem("token");

    // Fetch groups
    const response = await axios.get("http://localhost:3000/getgroups", {
      headers: { Authorization: token },
    });
    console.log(response);
    const groupContainer = document.getElementById("group-container");
    const newGroup = response.data;

    newGroup.forEach((group) => {
      const groupEntry = document.createElement("p");
      groupEntry.innerText = group.group_name;
      groupEntry.addEventListener("click", () => switchGroup(group.id));
      groupContainer.appendChild(groupEntry);
    });
  } catch (err) {
    console.log("error in getting groups");
  }

  addGroupButton.addEventListener("click", () => {
    addGroupForm.style.display = "block";
  });

  // Handle add group form submission
  const addGroupSubmitButton = document.getElementById("add-group-submit");

  addGroupSubmitButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const groupNameInput = document.getElementById("group-name");
    const groupName = groupNameInput.value;
    const token = localStorage.getItem("token");
    const groupContainer = document.getElementById("group-container");

    try {
      const response = await axios.post(
        "http://localhost:3000/creategroup",
        { groupName },
        { headers: { Authorization: token } }
      );

      const newGroup = response.data.response;
      console.log(newGroup);

      const groupEntry = document.createElement("p");
      groupEntry.innerText = newGroup.group_name;
      groupEntry.addEventListener("click", () => switchGroup(newGroup.id));
      groupContainer.appendChild(groupEntry);

      // Reset the input field
      groupNameInput.value = "";

      // Hide the add group form
      addGroupForm.style.display = "none";
    } catch (err) {
      console.log("Error occurred in creating group", err);
    }
  });

  async function switchGroup(groupId) {
    console.log(`switched to${groupId}`);
    currentgroupId = groupId;

    createChatSec(groupId);
    displayMessages(groupId);
  }

  function getCurrentGroupId() {
    //console.log("grooouuuppp id", currentgroupId);
    return currentgroupId;
  }

  function createChatSec(groupId) {
    const chatSec = document.getElementById("chat-sec");
    chatSec.innerHTML = ""; // Clear previous content

    const chatHead = document.createElement("h1");
    chatHead.id = "chat-head";
    chatHead.innerText = "Chat";
    chatSec.appendChild(chatHead);
    const addMembersButton = document.createElement("button");
    addMembersButton.id = "add-members-button";
    addMembersButton.innerText = "Add Members";
    addMembersButton.addEventListener("click", () =>
      getUsersAndDisplay(groupId)
    );

    chatSec.appendChild(addMembersButton);

    const removeMembersButton = document.createElement("button");
    removeMembersButton.id = "remove-members-button";
    removeMembersButton.innerText = "Remove Members";
    removeMembersButton.addEventListener("click", () =>
      getMembersAndDisplay(groupId)
    );

    chatSec.appendChild(removeMembersButton);

    const container = document.createElement("div");
    container.id = "container";

    const userContainer = document.createElement("div");
    userContainer.id = "user-container";

    const messageContainer = document.createElement("div");
    messageContainer.id = "message-container";

    container.appendChild(userContainer);
    container.appendChild(messageContainer);
    chatSec.appendChild(container);

    const inputContainer = document.createElement("div");
    inputContainer.id = "input-container";

    const messageForm = document.createElement("form");
    messageForm.id = "message-form";

    const messageInput = document.createElement("input");
    messageInput.type = "text";
    messageInput.id = "message-input";
    messageInput.classList.add("input-field");
    messageInput.placeholder = "Type your message";
    messageInput.required = true;

    const sendButton = document.createElement("button");
    sendButton.type = "submit";
    sendButton.id = "send-button";
    sendButton.innerText = "Send";

    messageForm.appendChild(messageInput);
    messageForm.appendChild(sendButton);
    inputContainer.appendChild(messageForm);
    chatSec.appendChild(inputContainer);

    const messageform = document.getElementById("message-form");

    messageform.addEventListener("submit", async (e) => {
      console.log("message formmm  submiteedddd");
      e.preventDefault();
      const messageInput = document.getElementById("message-input");
      const message = messageInput.value;
      const groupId = getCurrentGroupId();
      const token = localStorage.getItem("token");

      const obj = { message, groupId };
      console.log("messageeé", message, groupId);

      try {
        // Send the message to the selected group
        const response = await axios.post(
          "http://localhost:3000/sendGmessage",
          obj,
          { headers: { Authorization: token } }
        );
        console.log(response);
        // Fetch and display messages for the selected group
        await switchGroup(groupId);

        // Reset the input field
        messageInput.value = "";
      } catch (err) {
        console.log("Error occurred in sending message", err);
      }
    });
  }

  async function displayMessages(groupId) {
    try {
      const token = localStorage.getItem("token");

      // Fetch messages for the selected group
      const messagesResponse = await axios.get(
        `http://localhost:3000/getGmessages/${groupId}`,
        {
          headers: { Authorization: token },
        }
      );

      const messages = messagesResponse.data;
      console.log(messages);
      // Display messages in the message container
      const messageContainer = document.getElementById("message-container");
      messageContainer.innerHTML = "";

      const userIds = messages.map((message) => message.userId);
      const usersResponse = await axios.post(
        "http://localhost:3000/getusernames",
        { userIds },
        { headers: { Authorization: token } }
      );
      const userNamesMap = usersResponse.data;
      console.log("USERNAMESS MAPPS", userNamesMap);

      messages.forEach((message) => {
        const messageEntry = document.createElement("p");
        const userName = userNamesMap[message.userId];

        messageEntry.innerText = `${userName}: ${message.message_content}`;
        messageContainer.appendChild(messageEntry);
      });
    } catch (err) {
      console.log("Error occurred in fetching and displaying messages", err);
    }
  }

  async function getUsersAndDisplay(groupId) {
    {
      try {
        const token = localStorage.getItem("token");
        console.log(groupId);
        // Fetch users from the database
        const usersResponse = await axios.get(
          "http://localhost:3000/getusers",
          {
            headers: { Authorization: token },
          }
        );

        const users = usersResponse.data;
        console.log(users);

        displayUserSelectionModal(users, groupId);
      } catch (err) {
        console.log("Error occurred in fetching and displaying users", err);
      }
    }
  }

  function displayUserSelectionModal(users, groupId) {
    const modalContainer = document.createElement("div");
    modalContainer.id = "user-selection-modal";

    // Create a checkbox for each user
    users.forEach((user) => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = user.id;
      checkbox.id = `user-${user.id}`;

      const label = document.createElement("label");
      label.htmlFor = `user-${user.id}`;
      label.innerText = user.name;
      const adminCheckbox = document.createElement("input");
      adminCheckbox.type = "checkbox";
      adminCheckbox.value = user.id;
      adminCheckbox.id = `admin-${user.id}`;
      const adminLabel = document.createElement("label");
      adminLabel.htmlFor = `admin-${user.id}`;
      adminLabel.innerText = "Make Admin";

      modalContainer.appendChild(checkbox);
      modalContainer.appendChild(label);
      modalContainer.appendChild(adminCheckbox);
      modalContainer.appendChild(adminLabel);
      modalContainer.appendChild(document.createElement("br"));
    });

    // Create a button to add selected users to the group
    const addButton = document.createElement("button");
    addButton.innerText = "Add Selected Users";
    addButton.addEventListener("click", () => addSelectedUsers(groupId));

    modalContainer.appendChild(addButton);

    // Append the modal to the document body
    document.body.appendChild(modalContainer);
  }

  async function addSelectedUsers(groupId) {
    const selectedUserIds = [];
    const selectedAdminUserIds = [];
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );

    checkboxes.forEach((checkbox) => {
      const userId = checkbox.value;
      selectedUserIds.push(userId);

      const adminCheckbox = document.getElementById(`admin-${userId}`);
      if (adminCheckbox.checked) {
        selectedAdminUserIds.push(userId);
      }
    });

    try {
      const token = localStorage.getItem("token");

      // Add selected users to the group
      await axios.post(
        `http://localhost:3000/adduserstogroup/${groupId}`,
        { userIds: selectedUserIds },
        { headers: { Authorization: token } }
      );

      if (selectedAdminUserIds.length > 0) {
        await axios.post(
          `http://localhost:3000/makeadmins/${groupId}`,
          { userIds: selectedAdminUserIds },
          { headers: { Authorization: token } }
        );
      }

      // Close the user selection modal
      document.getElementById("user-selection-modal").remove();

      // Refresh the group members
      await switchGroup(groupId);
    } catch (err) {
      console.log("Error occurred in adding users to the group", err);
    }
  }

  async function getMembersAndDisplay(groupId) {
    try {
      const token = localStorage.getItem("token");

      // Fetch members of the group
      const membersResponse = await axios.get(
        `http://localhost:3000/getgroupmembers/${groupId}`,
        {
          headers: { Authorization: token },
        }
      );

      const members = membersResponse.data;
      console.log(members);

      displayMembersRemovalModal(members, groupId);
    } catch (err) {
      console.log("Error occurred in fetching and displaying members", err);
    }
  }

  function displayMembersRemovalModal(members, groupId) {
    const modalContainer = document.createElement("div");
    modalContainer.id = "member-removal-modal";

    // Create a checkbox for each member
    members.forEach((member) => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = member.id;
      checkbox.id = `member-${member.id}`;

      const label = document.createElement("label");
      label.htmlFor = `member-${member.id}`;
      label.innerText = member.name;

      modalContainer.appendChild(checkbox);
      modalContainer.appendChild(label);
      modalContainer.appendChild(document.createElement("br"));
    });

    // Create a button to remove selected members from the group
    const removeButton = document.createElement("button");
    removeButton.innerText = "Remove Selected Members";
    removeButton.addEventListener("click", () =>
      removeSelectedMembers(groupId)
    );

    modalContainer.appendChild(removeButton);

    // Append the modal to the document body
    document.body.appendChild(modalContainer);
  }

  async function removeSelectedMembers(groupId) {
    const selectedMemberIds = [];
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );

    checkboxes.forEach((checkbox) => {
      const memberId = checkbox.value;
      selectedMemberIds.push(memberId);
    });

    try {
      const token = localStorage.getItem("token");

      // Remove selected members from the group
      await axios.post(
        `http://localhost:3000/removeusersfromgroup/${groupId}`,
        { userIds: selectedMemberIds },
        { headers: { Authorization: token } }
      );

      // Close the member removal modal
      document.getElementById("member-removal-modal").remove();

      // Refresh the group members
      await switchGroup(groupId);
    } catch (err) {
      console.log("Error occurred in removing members from the group", err);
    }
  }

  // Your existing code...
});
