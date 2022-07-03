import {atom, selector} from 'recoil'

const User = atom({
    key: "User",
    default: "Samuel"
});

const SetUser = selector({
    key: 'SetUser',
    get: ({get}) => get(User).toUpperCase(),
    set: ({set}, newVal = 'Timmy') => {
        return set(User, newVal)
    }
})

const Users = atom({
    key: "Users",
    default: ['Samuel', 'Victor', 'Pete']
})

const AddUser = selector({
    key: "AddUsers",
    get: ({get}) => {
        const allUsers = get(Users)
        return allUsers
    },
    set: ({get, set}, newVal = 'NewUser') => {
        const allUsers = Array.from(get(Users))
        console.log(allUsers)
        allUsers.push(newVal)
        return set(Users, allUsers)
        
    }
})

export {User, SetUser, AddUser, Users}