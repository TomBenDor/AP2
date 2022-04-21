const usersDB = [
    {
        "username": "user123",
        "password": "pass123",
        "displayName": "Coolest dude ever",
        "profilePicture": "profile_picture.png"
    },
    {
        "username": "user456",
        "password": "pass456",
        "displayName": "Lion",
        "profilePicture": "profile_picture.png"
    },
];

const contactsDB = [
    {
        id: 0,
        username: 'Panda',
        name: 'Panda Bear',
        profilePicture: 'panda.jpg',
        unreadMessages: 1,
        messages: [
            {
                id: 1,
                sender: 'left',
                text: 'Do you got any bamboo left?',
                timestamp: '4/16/2022, 14:49:00',
                type: 'text'
            },
            {
                id: 2,
                sender: 'right',
                text: 'Not for you, sorry.',
                timestamp: '4/16/2022, 15:01:00',
                type: 'text'
            }
        ]
    },
    {
        id: 1,
        username: 'Koala',
        name: 'Koala Bear',
        profilePicture: 'koala.jpg',
        unreadMessages: 1,
        messages: [
            {
                id: 1,
                sender: 'right',
                text: 'Wanna have a sleepover?',
                timestamp: '4/16/2022, 12:32:00',
                type: 'text'
            },
        ]
    },
];

export { usersDB, contactsDB };