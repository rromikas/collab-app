const schema = {
  users: {
    id: {
      projects: {
        projectId: { projectId, title, description, starred: false },
        projectId: { projectId, title, description, starred: false },
        projectId: { projectId, title, description, starred: false },
      },
    },
    id: {
      projects: [projectId, projectId, projectId],
    },
    id: {
      projects: [projectId, projectId, projectId],
    },
  },

  projects: {
    id: {
      activity: {
        "2020-05-16": [
          { time: "11 AM", user: { photo, name }, action, document },
        ],
        "2020-05-17": [
          { time: "7 AM", user: { photo, name }, action, document },
        ],
        "2020-05-18": [
          { time: "10 AM", user: { photo, name }, action, document },
        ],
      },
      events: {
        id: {
          // id reikalingas kad galetum istrinti ivyki pagal id.
          id: id,
          title: "Football game",
          start: "Thu Jun 15 2020 12:00:00",
          end: "Thu Jun 15 2020 12:30:00",
        },
        id: {
          // id reikalingas kad galetum istrinti ivyki pagal id.
          id: id,
          title: "Football game",
          start: "Thu Jun 15 2020 12:00:00",
          end: "Thu Jun 15 2020 12:30:00",
        },
        id: {
          // id reikalingas kad galetum istrinti ivyki pagal id.
          id: id,
          title: "Football game",
          start: "Thu Jun 15 2020 12:00:00",
          end: "Thu Jun 15 2020 12:30:00",
        },
      },

      chats: {
        chatId: {
          chatId,
          lastMessage: { status: "guest|owner", text },
          guest: { photo, name },
        },
        chatId: {
          chatId,
          lastMessage: { status: "guest|owner", text },
          guest: { photo, name },
        },
        chatId: {
          chatId,
          lastMessage: { status: "guest|owner", text },
          guest: { photo, name },
        },
      },
    },
  },

  chats: {
    chatId: {
      id: chatId,
      guest: {
        haveUnreadMessages: false,
        name: "Kreate",
        photo:
          "https://images.pexels.com/photos/2897883/pexels-photo-2897883.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      owner: {
        haveUnreadMessages: false,
        name: "Sioma",
        photo:
          "https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },

      messages: {
        firbaseId: {
          date,
          status, //who send the mssages: owner|guest
          text,
        },
        firbaseId: {
          date,
          status, //who send the mssages: owner|guest
          text,
        },
        firbaseId: {
          date,
          status, //who send the mssages: owner|guest
          text,
        },
      },
    },
  },
};
