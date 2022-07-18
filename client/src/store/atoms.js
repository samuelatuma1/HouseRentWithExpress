import {atom, selector} from 'recoil'

const MyUser = atom({
    key: "MyUser",
    default: "Samuel"
});

/**
 * @value -> {
            fullName: string | null,
            email: string | null,
            token: jwttoken | null
        }
 */
const User = atom({
    key: "User",
    default: localStorage.getItem("user") ? 
        JSON.parse(localStorage.getItem("user")) :
        null
})

/**
 * @desc 
 * @method (get) returns User from User atom
 * @method (set) sets User atom and adds data to LocalStorage.
 * @method (set) param newUser =>  {
            fullName: string ,
            email: string ,
            token: jwttoken 
        }
 */
const SetUser = selector({
    key: "SelectUser",
    /**
     * @desc Returns user either stored in User Global State || user stored in Local Storal Storage
     * 
     */
    get: (({get}) => {
        const lsUser = localStorage.getItem("user") ? 
                        JSON.parse(localStorage.getItem("user")) 
                        : null
        let user = get(User) || lsUser
    
        return user
    }),
    set: ({get, set}, newUser) => {
        // Set user in local storage
        localStorage.setItem("user", JSON.stringify(newUser))
        // Set User to newUser
        return set(User, newUser)
    }
})
// const SetUser = selector({
//     key: 'SetUser',
//     get: ({get}) => get(User).toUpperCase(),
//     set: ({set}, newVal = 'Timmy') => {
//         return set(User, newVal)
//     }
// })

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